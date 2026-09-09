import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { clients, featuredProjects, partners } from '../src/data.js'

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
const vercel = read('vercel.json')
const gitignore = read('.gitignore')
const pkg = JSON.parse(read('package.json'))

// Data / public experience
assert(clients.length >= 10, 'Base de clientes insuficiente.')
assert(featuredProjects.length >= 8, 'Portfólio seeded insuficiente.')
assert(partners.length >= 25, 'Rede de parceiros seeded insuficiente.')
assert(/function Hero/.test(app) && /<Hero/.test(app), 'Hero V10 ausente.')
assert(/function PresenceSystem/.test(app) && /<PresenceSystem/.test(app), 'Presence System V10 ausente.')
assert(/function SelectedWork/.test(app) && /<SelectedWork/.test(app), 'Selected Work V10 ausente.')
assert(/function BentoCase/.test(app), 'Case Study V10 ausente.')
assert(/function WorkArchive/.test(app), 'Arquivo visual V10.3 ausente.')
assert(/function Partners/.test(app) && /<Partners/.test(app), 'Rede de parceiros V10.3 ausente.')
assert(/function Brief/.test(app), 'Brief rápido V10 ausente.')
assert(/prefers-reduced-motion/.test(css), 'Fallback reduced motion ausente.')
assert(/@media\s*\(max-width:900px\)|@media\s*\(max-width:\s*900px\)/.test(css), 'Layout mobile V10 ausente.')
assert(/v10-system/.test(css) && /v10-project/.test(css), 'CSS público V10 incompleto.')
assert(/WA_KAREN/.test(app) && /WA_GUSTAVO/.test(app), 'Roteamento de contato não configurado.')
assert(/useCmsContent/.test(app), 'Experiência pública deixou de consumir o CMS.')

// Supabase / admin preserved
assert(/VITE_SUPABASE_URL/.test(supabase), 'VITE_SUPABASE_URL ausente.')
assert(/VITE_SUPABASE_PUBLISHABLE_KEY/.test(supabase), 'VITE_SUPABASE_PUBLISHABLE_KEY ausente.')
assert(/cms_admins/.test(read('SUPABASE_V8_MIGRATION.sql')), 'Camada de autorização do CMS ausente.')
assert(/friendlyAuthError/.test(admin), 'Tratamento de autenticação do Admin ausente.')
assert(/aria-modal="true"/.test(admin), 'Acessibilidade de modal do Admin ausente.')

// Deploy / repo
assert(pkg.version === '10.4.0', `Versão esperada 10.4.0; atual ${pkg.version}.`)
assert(/node_modules\//.test(gitignore) && /dist\//.test(gitignore), '.gitignore incompleto.')
assert(/X-Robots-Tag/.test(vercel) && /noindex/.test(vercel), '/admin sem noindex no Vercel.')
assert(/X-Content-Type-Options/.test(vercel), 'Headers de segurança básicos ausentes.')
assert(exists('index.html') && exists('public/favicon.svg'), 'Arquivos públicos essenciais ausentes.')
warn(!exists('node_modules'), 'node_modules está presente localmente; remova antes de compactar/commitar.')

if (css.split('{').length !== css.split('}').length) failures.push('Quantidade de chaves CSS não confere.')

if (failures.length) {
  console.error('\nSEE7VEN V10 / PREFLIGHT FAILED')
  failures.forEach(item => console.error(`✗ ${item}`))
  warnings.forEach(item => console.warn(`! ${item}`))
  process.exit(1)
}
console.log('SEE7VEN V10.4 / PREFLIGHT OK')
console.log(`✓ ${clients.length} clientes seeded`)
console.log(`✓ ${featuredProjects.length} projetos seeded`)
console.log(`✓ ${partners.length} parceiros seeded`)
warnings.forEach(item => console.warn(`! ${item}`))
