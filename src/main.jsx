import adminCssUrl from './admin.css?url'
import publicCssUrl from './public.css?url'

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isAdmin = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')

function ensureStylesheet(href, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id)
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve()
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', reject, { once: true })
      return
    }

    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = href
    link.addEventListener('load', () => {
      link.dataset.loaded = 'true'
      resolve()
    }, { once: true })
    link.addEventListener('error', reject, { once: true })
    document.head.appendChild(link)
  })
}

if (isAdmin) {
  document.documentElement.dataset.app = 'admin'
  document.body.classList.add('admin-route')
  document.title = 'Seeven Control Room'

  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) {
    robots = document.createElement('meta')
    robots.name = 'robots'
    document.head.appendChild(robots)
  }
  robots.content = 'noindex,nofollow,noarchive'
} else {
  document.documentElement.dataset.app = 'public'
  document.body.classList.add('public-route')
}

async function boot() {
  const cssHref = isAdmin ? adminCssUrl : publicCssUrl
  const cssId = isAdmin ? 'seeven-admin-css' : 'seeven-public-css'
  await ensureStylesheet(cssHref, cssId)

  if (isAdmin) {
    await import('./admin-entry.jsx')
  } else {
    await import('./public-entry.jsx')
  }
}

boot().catch(error => {
  console.error(error)
  const root = document.getElementById('root')
  if (!root) return
  root.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#fff;font-family:Arial,sans-serif;padding:24px">
      <div style="max-width:620px">
        <span style="font-size:12px;letter-spacing:.15em;opacity:.6">SEE7VEN / RECOVERY</span>
        <h1 style="font-size:clamp(32px,6vw,64px);line-height:.95">Não foi possível iniciar a experiência.</h1>
        <p style="opacity:.72;line-height:1.5">Recarregue a página. Se o problema persistir, verifique o deploy.</p>
        <button onclick="window.location.reload()" style="margin-top:12px;padding:12px 16px;border-radius:999px;border:0;cursor:pointer">Recarregar</button>
      </div>
    </main>`
})
