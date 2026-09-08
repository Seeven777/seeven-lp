import { createRoot } from 'react-dom/client'
import './styles.css'

const root = createRoot(document.getElementById('root'))
const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'

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

const modulePromise = isAdmin ? import('./admin') : import('./App')

modulePromise
  .then(({ default: Component }) => root.render(<Component/>))
  .catch(error => {
    console.error(error)
    root.render(<main className="fatal-state"><span>SEE7VEN / RECOVERY</span><h1>Não foi possível iniciar a experiência.</h1><p>Recarregue a página. Se o problema persistir, verifique o deploy.</p><button onClick={() => window.location.reload()}>Recarregar</button></main>)
  })
