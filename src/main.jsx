const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/'
const isAdmin = normalizedPath === '/admin' || normalizedPath.startsWith('/admin/')

if (isAdmin) {
  document.title = 'Seeven Control Room'
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) {
    robots = document.createElement('meta')
    robots.name = 'robots'
    document.head.appendChild(robots)
  }
  robots.content = 'noindex,nofollow,noarchive'
}

const entryPromise = isAdmin ? import('./admin-entry.jsx') : import('./public-entry.jsx')

entryPromise.catch(error => {
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
