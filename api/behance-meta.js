const MAX_HTML_CHARS = 8_000_000
function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', status === 200 ? 'public, s-maxage=3600, stale-while-revalidate=86400' : 'no-store')
  res.end(JSON.stringify(body))
}

function decode(value='') {
  return String(value).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>')
}
function meta(html, property) {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const a = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'))
  const b = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i'))
  return decode(a?.[1] || b?.[1] || '')
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method_not_allowed' })
  const raw = Array.isArray(req.query?.url) ? req.query.url[0] : req.query?.url
  let target
  try { target = new URL(String(raw || '')) } catch { return send(res, 400, { error: 'invalid_url', message: 'URL inválida.' }) }
  if (!['behance.net','www.behance.net'].includes(target.hostname) || !/^\/gallery\/\d+\//.test(target.pathname)) return send(res, 400, { error: 'invalid_behance_url', message: 'Use uma URL pública de projeto do Behance.' })
  target.protocol = 'https:'; target.search = ''; target.hash = ''
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(target.toString(), { signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; SeevenPortfolioBot/1.0)', 'accept': 'text/html,application/xhtml+xml' } })
    if (!response.ok) return send(res, 502, { error: 'behance_unavailable', message: 'Não foi possível abrir esse projeto no Behance.' })
    const html = (await response.text()).slice(0, MAX_HTML_CHARS)
    let last = target.pathname.split('/').pop() || 'Projeto Behance'; try { last = decodeURIComponent(last) } catch {}; const fallbackTitle = last.replace(/[-_]+/g,' ').slice(0,160)
    return send(res, 200, { url: target.toString(), title: meta(html,'og:title') || fallbackTitle, image: meta(html,'og:image'), description: meta(html,'og:description') })
  } catch (error) {
    return send(res, 502, { error: error?.name === 'AbortError' ? 'behance_timeout' : 'behance_fetch_failed', message: 'Não foi possível importar os metadados agora.' })
  } finally { clearTimeout(timer) }
}
