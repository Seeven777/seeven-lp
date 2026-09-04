function decode(value = '') {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim()
}

function getMeta(html, key) {
  const tags = html.match(/<meta\b[^>]*>/gi) || []
  for (const tag of tags) {
    const property = tag.match(/(?:property|name)=["']([^"']+)["']/i)?.[1]
    if (property !== key) continue
    const content = tag.match(/content=["']([^"']*)["']/i)?.[1]
    if (content) return decode(content)
  }
  return ''
}

export default async function handler(req, res) {
  try {
    const raw = String(req.query?.url || '')
    const url = new URL(raw)
    if (!['www.behance.net', 'behance.net'].includes(url.hostname) || !/^\/gallery\/\d+\//.test(url.pathname)) {
      return res.status(400).json({ error: 'invalid_behance_url' })
    }
    const response = await fetch(url.toString(), {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; SeevenPortfolioBot/1.0)',
        'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8'
      }
    })
    if (!response.ok) return res.status(response.status).json({ error: 'behance_fetch_failed' })
    const html = await response.text()
    const title = getMeta(html, 'og:title') || decode(html.match(/<title>(.*?)<\/title>/is)?.[1] || '')
    const image = getMeta(html, 'og:image')
    const description = getMeta(html, 'og:description')
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400')
    return res.status(200).json({ url: url.toString(), title, image, description })
  } catch (error) {
    return res.status(500).json({ error: 'behance_meta_error', message: error?.message || 'Unknown error' })
  }
}
