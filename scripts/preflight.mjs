import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { clients, featuredProjects, reels, portfolioFilterOptions } from '../src/data.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')
const failures = []
const warnings = []
const assert = (condition, message) => { if (!condition) failures.push(message) }
const warn = (condition, message) => { if (!condition) warnings.push(message) }
const exists = file => fs.existsSync(path.join(root, file))
const read = file => fs.readFileSync(path.join(root, file), 'utf8')

const app = read('src/App.jsx')
const admin = read('src/admin.jsx')
const css = read('src/styles.css')
const supabase = read('src/supabase.js')
const migration = read('SUPABASE_V8_MIGRATION.sql')
const bootstrap = read('SUPABASE_V8_BOOTSTRAP.sql')
const readme = read('README.md')
const adminSetup = read('ADMIN_SETUP.md')
const migrationGuide = read('MIGRATION_V8.md')
const envExample = read('.env.example')
const vercel = read('vercel.json')
const packageJson = JSON.parse(read('package.json'))
const gitignore = read('.gitignore')
const brandDir = path.join(root, 'public/portfolio/brands')
const publicSvgs = fs.readdirSync(brandDir).filter(name => name.endsWith('.svg'))
const internalLeakSources = [app, ...publicSvgs.map(name => read(`public/portfolio/brands/${name}`))].join('\n')

// Data integrity --------------------------------------------------------
assert(reels.length === 32, `Esperado: 32 Reels seeded. Encontrado: ${reels.length}.`)
assert(clients.length >= 11, `Esperado: pelo menos 11 clientes seeded. Encontrado: ${clients.length}.`)
assert(featuredProjects.length >= 11, `Selected Work muito curto: ${featuredProjects.length} projetos.`)
assert(new Set(clients.map(item => item.id)).size === clients.length, 'IDs duplicados em clients.')
assert(new Set(featuredProjects.map(item => item.id)).size === featuredProjects.length, 'IDs duplicados em featuredProjects.')
assert(new Set(reels.map(item => item.id)).size === reels.length, 'IDs duplicados nos 32 Reels seeded.')
const clientIds = new Set(clients.map(item => item.id))
reels.forEach(item => assert(clientIds.has(item.clientId), `Reel ${item.id} aponta para clientId inexistente: ${item.clientId}.`))
featuredProjects.filter(item => item.clientId).forEach(item => assert(clientIds.has(item.clientId), `Projeto ${item.id} aponta para clientId inexistente: ${item.clientId}.`))
assert(publicSvgs.length >= 11, `Faltam fallbacks de marca: ${publicSvgs.length}/11.`)
clients.forEach(item => {
  if (item.brandPoster?.startsWith('/portfolio/brands/')) assert(exists(`public${item.brandPoster}`), `Poster local ausente para ${item.name}: ${item.brandPoster}`)
})

// Filter curation should actually change the portfolio -----------------
const filterTerms = {
  strategy: ['estratégia','strategy','posicionamento','b2b','sistema','conversão'],
  brand: ['branding','brand','identidade','direção visual','design'],
  social: ['social','conteúdo','content','instagram'],
  video: ['vídeo','video','motion','música','music','reel'],
  web: ['web','site','landing','digital'],
  physical: ['físico','evento','event','impresso','embalagem','uniforme','experiência']
}
const curated = new Set(portfolioFilterOptions.flatMap(item => item.ids || []))
const projectText = item => [item.id,item.client,item.label,item.title,item.summary,item.category,...(item.tags || [])].filter(Boolean).join(' ').toLowerCase()
const sets = portfolioFilterOptions.filter(item => item.id !== 'all').map(filter => {
  const ids = featuredProjects.filter(project => filter.ids?.includes(project.id) || (!curated.has(project.id) && (filterTerms[filter.id] || []).some(term => projectText(project).includes(term)))).map(item => item.id)
  assert(ids.length > 0, `Filtro ${filter.id} ficou vazio.`)
  assert(ids.length < featuredProjects.length, `Filtro ${filter.id} mostra o portfólio inteiro e não parece uma curadoria.`)
  return ids.join('|')
})
assert(new Set(sets).size === sets.length, 'Dois ou mais filtros têm exatamente o mesmo conjunto de projetos.')

// Front-end stability / safety -----------------------------------------
assert(!/mix-blend-mode\s*:/i.test(css), 'CSS voltou a usar mix-blend-mode; pode causar glitches em scroll/captura longa.')
assert(!/filter\s*:\s*invert\(/i.test(css), 'CSS voltou a usar filter: invert() no layout.')
assert(!/content-visibility\s*:\s*auto/i.test(css), 'content-visibility:auto não deve ser usado nesta página longa; já causou captura incompleta.')
assert(!/REPLACE WITH REAL|BRAND FALLBACK|POSTER PENDENTE|MEDIA VAULT/i.test(internalLeakSources), 'Texto interno de produção vazou para a experiência pública.')
assert(!/href=["']#["']/g.test(app), 'href="#" encontrado no app público.')
assert(/scroll-padding-top/i.test(css), 'Falta compensação para o header fixo em navegação por âncora.')
assert(/VITE_SUPABASE_URL/.test(supabase), 'VITE_SUPABASE_URL não encontrada em src/supabase.js.')
assert(/VITE_SUPABASE_PUBLISHABLE_KEY/.test(supabase), 'VITE_SUPABASE_PUBLISHABLE_KEY não encontrada em src/supabase.js.')
assert(!/SUPABASE_SECRET_KEY/.test([app, admin, supabase].join('\n')), 'SUPABASE_SECRET_KEY não pode aparecer no bundle do navegador.')

// Admin / database ------------------------------------------------------
assert(/cms_admins/.test(migration) && /is_seeven_admin/.test(migration), 'Migration V8 não contém a camada de autorização do CMS.')
assert(/portfolio-assets/.test(migration), 'Migration V8 não configura o Media Vault.')
assert(/public\.is_seeven_admin\(\)/.test(migration), 'RLS V8 não usa is_seeven_admin().')
assert(/friendlyAuthError/.test(admin), 'Admin não possui tradução amigável dos principais erros de autenticação.')
assert(/friendlyDbError/.test(admin), 'Admin não possui tradução amigável dos principais erros do banco.')
assert(/useAdminDialog/.test(admin) && /aria-modal="true"/.test(admin), 'Editor do Admin não possui tratamento de diálogo/foco.')
assert(/normalizeUrl/.test(admin), 'Quick Reel não possui normalização/controle de duplicidade.')
assert(/admin-status-stack/.test(admin), 'Status editorial e publicação ainda não estão separados na tabela do Admin.')

// Deploy / repository hygiene -----------------------------------------
assert(exists('SUPABASE_V8_MIGRATION.sql'), 'Migration V8 ausente.')
assert(exists('SUPABASE_V8_BOOTSTRAP.sql'), 'Bootstrap V8 ausente.')
assert(exists('ADMIN_GUIDE.md') && exists('ADMIN_SETUP.md') && exists('DEPLOY_CHECKLIST.md') && exists('QA_V8.md'), 'Documentação operacional/QA V8 incompleta.')
assert(exists('.gitignore'), '.gitignore ausente.')
assert(!exists('node_modules'), 'node_modules não deve fazer parte do pacote V8.')
assert(/node_modules\//.test(gitignore) && /dist\//.test(gitignore) && /\.env/.test(gitignore), '.gitignore não cobre node_modules, dist e variáveis locais.')
assert(packageJson.scripts?.preflight, 'package.json não possui script preflight.')
warn(exists('package-lock.json'), 'package-lock.json não foi gerado neste ambiente; gere um novo lockfile com npm install antes do commit final.')
assert(/X-Robots-Tag/.test(vercel) && /noindex/.test(vercel), '/admin não está protegido contra indexação no vercel.json.')
assert(/X-Content-Type-Options/.test(vercel), 'Headers básicos de segurança não estão configurados no Vercel.')
assert(!/seevenprojects@gmail/i.test([migration, bootstrap, read('README.md'), read('MIGRATION_V8.md')].join('\n')), 'Dados pessoais não devem ficar hard-coded em SQL/documentação.')
assert(!/VITE_KAREN_WHATSAPP=5511\d{8,}/.test(envExample), '.env.example contém número real em vez de placeholder.')
assert(/count\(\*\) from auth\.users\) = 1/i.test(migration), 'Migration V8 deve preservar automaticamente apenas um único Auth user existente.')
assert(/SUPABASE_V8_BOOTSTRAP\.sql/.test(adminSetup), 'ADMIN_SETUP deve orientar fresh install pela V8 bootstrap.')
assert(/SUPABASE_V8_BOOTSTRAP\.sql/.test(migrationGuide), 'MIGRATION_V8 deve orientar fresh install pela V8 bootstrap.')
assert(!/SUPABASE_V7_4_SETUP\.sql/.test([readme, adminSetup, migrationGuide].join('\n')), 'Documentação final ainda referencia SUPABASE_V7_4_SETUP.sql, que não faz parte do pacote V8.')
assert(/scroll_depth/.test(app), 'Analytics não registra profundidade de scroll.')
assert(/expanded \? archive\.length/.test(app), 'Motion Archive ainda limita o arquivo expandido artificialmente.')
assert(/expanded \? validProjects\.length/.test(app), 'Behance expandido ainda limita projetos artificialmente.')
assert(/\.ba-slider>i\{left:var\(--ba\)\}/.test(css), 'Handle do Before/After não está ligado ao valor real de 0–100%.')

for (const artifact of ['src/App.jsx.pre-final','src/App.jsx.v8-qa-backup','src/admin.jsx.pre-final','src/admin.jsx.v8-qa-backup','src/styles.css.v8-qa-backup','qa-prototype.html','SUPABASE_V7_4_SETUP.sql','SUPABASE_V8_MIGRATION.sql.v8-qa-backup','vercel.json.v8-qa-backup']) {
  assert(!exists(artifact), `Arquivo legado/intermediário ainda presente no pacote: ${artifact}`)
}

if (css.split('{').length !== css.split('}').length) failures.push('Quantidade de chaves CSS não confere.')

if (failures.length) {
  console.error('\nSEE7VEN V8 / PREFLIGHT FAILED')
  failures.forEach(item => console.error(`✗ ${item}`))
  warnings.forEach(item => console.warn(`! ${item}`))
  process.exit(1)
}

console.log('SEE7VEN V8 / PREFLIGHT OK')
console.log(`✓ ${clients.length} clientes`)
console.log(`✓ ${featuredProjects.length} projetos selecionados`)
console.log(`✓ ${reels.length} slots de Reel`)
console.log(`✓ ${publicSvgs.length} fallbacks locais de marca`)
console.log(`✓ ${sets.length} curadorias distintas`)
warnings.forEach(item => console.warn(`! ${item}`))
