const PROFILE_URL = 'https://www.behance.net/wedeseeven'
const MAX_HTML_CHARS = 12_000_000

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', status === 200 ? 'public, s-maxage=600, stale-while-revalidate=1800' : 'no-store')
  res.end(JSON.stringify(body))
}

function titleFromUrl(url) {
  const raw = String(url).split('/').pop() || 'Projeto Behance'
  let decoded = raw
  try { decoded = decodeURIComponent(raw) } catch {}
  return decoded.replace(/^\d+-/, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(PROFILE_URL, {
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; SeevenPortfolioBot/1.0)',
        'accept': 'text/html,application/xhtml+xml'
      }
    })
    if (!response.ok) return send(res, 502, { error: 'behance_unavailable', message: 'O Behance não respondeu à consulta pública.' })
    let html = (await response.text()).slice(0, MAX_HTML_CHARS)
    html = html.replace(/\\\//g, '/')
    const matches = [...html.matchAll(/https?:\/\/(?:www\.)?behance\.net\/gallery\/\d+\/[A-Za-z0-9%_()'.,+\-]+/gi)].map(match => match[0])
    const relative = [...html.matchAll(/(?:href=["']|["'])(\/gallery\/\d+\/[A-Za-z0-9%_()'.,+\-]+)(?:["'?#])/gi)].map(match => `https://www.behance.net${match[1]}`)
    const urls = [...new Set([...matches, ...relative].map(url => url.replace(/["'<>]+$/g, '').replace(/\?.*$/, '')))].slice(0, 60)
    return send(res, 200, { profile: PROFILE_URL, checked_at: new Date().toISOString(), projects: urls.map(url => ({ url, title: titleFromUrl(url) })) })
  } catch (error) {
    const timeout = error?.name === 'AbortError'
    return send(res, 502, { error: timeout ? 'behance_timeout' : 'behance_fetch_failed', message: timeout ? 'O Behance demorou demais para responder.' : 'Não foi possível verificar o Behance agora.' })
  } finally {
    clearTimeout(timer)
  }
}
