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
const css = read('src/admin.css')
const publicCss = read('src/public.css')
const allCss = `${publicCss}\n${css}`
const supabase = read('src/supabase.js')
const vercel = read('vercel.json')
const gitignore = read('.gitignore')
const pkg = JSON.parse(read('package.json'))

assert(clients.length >= 10, 'Base de clientes insuficiente.')
assert(featuredProjects.length >= 8, 'Portfólio seeded insuficiente.')
assert(partners.length >= 25, 'Rede de parceiros seeded insuficiente.')
assert(/function ExperienceGate/.test(app) && /v11-gateway/.test(app), 'Gateway V11 ausente.')
assert(/function Hero/.test(app) && /v11-hero/.test(app), 'Hero V11 ausente.')
assert(/function CompaniesAtlas/.test(app) && /id="companies"/.test(app), 'Atlas de empresas V11 ausente.')
assert(/function Capabilities/.test(app) && /id="capabilities"/.test(app), 'Capability deck V11 ausente.')
assert(/function Method/.test(app) && /id="method"/.test(app), 'Método / briefing V11 ausente.')
assert(/function FeaturedWork/.test(app) && /id="work"/.test(app), 'Selected Work V11 ausente.')
assert(/function CompanyIndex/.test(app), 'Índice público de empresas V11 ausente.')
assert(/function CreativeLab/.test(app) && /id="lab"/.test(app), 'Creative Lab V11 ausente.')
assert(/function PartnerNetwork/.test(app) && /v11-partner-row/.test(app), 'Rede cinética de parceiros V11 ausente.')
assert(/function ProblemSolver/.test(app), 'Problem-first conversion V11 ausente.')
assert(/function BentoCase/.test(app), 'Case Study preservado.')
assert(/function Brief/.test(app), 'Brief rápido preservado.')
assert(/WA_KAREN/.test(app) && /WA_GUSTAVO/.test(app), 'Roteamento de contato não configurado.')
assert(/useCmsContent/.test(app), 'Experiência pública deixou de consumir o CMS.')
assert(/prefers-reduced-motion/.test(allCss), 'Fallback reduced motion ausente.')
assert(/@media\s*\(max-width:\s*900px\)/.test(allCss), 'Layout mobile V11 ausente.')
assert(/v11-company-actions/.test(allCss) && /v11-lab-stage/.test(allCss), 'CSS público V11 incompleto.')

assert(/VITE_SUPABASE_URL/.test(supabase), 'VITE_SUPABASE_URL ausente.')
assert(/VITE_SUPABASE_PUBLISHABLE_KEY/.test(supabase), 'VITE_SUPABASE_PUBLISHABLE_KEY ausente.')
assert(/cms_admins/.test(read('SUPABASE_V8_MIGRATION.sql')), 'Camada de autorização do CMS ausente.')
assert(/friendlyAuthError/.test(admin), 'Tratamento de autenticação do Admin ausente.')
assert(/aria-modal="true"/.test(admin), 'Acessibilidade de modal do Admin ausente.')

assert(/^12\.\d+\.\d+$/.test(pkg.version), `Versão V12 inválida; atual ${pkg.version}.`)
assert(/node_modules\//.test(gitignore) && /dist\//.test(gitignore), '.gitignore incompleto.')
assert(/X-Robots-Tag/.test(vercel) && /noindex/.test(vercel), '/admin sem noindex no Vercel.')
assert(/X-Content-Type-Options/.test(vercel), 'Headers de segurança básicos ausentes.')
assert(exists('index.html') && exists('public/favicon.svg'), 'Arquivos públicos essenciais ausentes.')
assert(exists('src/public-entry.jsx') && exists('src/admin-entry.jsx'), 'Entrypoints isolados público/admin ausentes.')
assert(exists('src/public-entry.jsx') && exists('src/admin-entry.jsx'), 'Entrypoints isolados público/admin ausentes.')
if (!process.env.VERCEL) warn(!exists('node_modules'), 'node_modules está presente localmente; remova antes de compactar/commitar.')

if (allCss.split('{').length !== allCss.split('}').length) failures.push('Quantidade de chaves CSS não confere.')

if (failures.length) {
  console.error('\nSEE7VEN V12 / PREFLIGHT FAILED')
  failures.forEach(item => console.error(`✗ ${item}`))
  warnings.forEach(item => console.warn(`! ${item}`))
  process.exit(1)
}
console.log('SEE7VEN V12 / PREFLIGHT OK')
console.log(`✓ ${clients.length} clientes seeded`)
console.log(`✓ ${featuredProjects.length} projetos seeded`)
console.log(`✓ ${partners.length} parceiros seeded`)
warnings.forEach(item => console.warn(`! ${item}`))
