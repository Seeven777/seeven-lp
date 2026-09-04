const PROFILE_URL = 'https://www.behance.net/wedeseeven'

function titleFromUrl(url) {
  try {
    const slug = new URL(url).pathname.split('/').filter(Boolean).slice(2).join('-')
    return decodeURIComponent(slug).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
  } catch (_) { return 'Projeto Behance' }
}

export default async function handler(_req, res) {
  try {
    const response = await fetch(PROFILE_URL, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; SeevenPortfolioBot/1.0; +https://www.behance.net/wedeseeven)',
        'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8'
      }
    })
    if (!response.ok) return res.status(response.status).json({ error: 'behance_fetch_failed' })
    const html = await response.text()
    const urls = new Set()
    const patterns = [
      /https:\/\/www\.behance\.net\/gallery\/\d+\/[^"'<>?\s]+/gi,
      /href=["'](\/gallery\/\d+\/[^"'<>?\s]+)["']/gi
    ]
    for (const pattern of patterns) {
      let match
      while ((match = pattern.exec(html))) {
        const raw = match[1] || match[0]
        const url = raw.startsWith('http') ? raw : `https://www.behance.net${raw}`
        urls.add(url.replace(/\/$/, ''))
      }
    }
    const projects = [...urls].slice(0, 60).map(url => ({ url, title: titleFromUrl(url) }))
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=1800')
    return res.status(200).json({ profile: PROFILE_URL, projects, checkedAt: new Date().toISOString() })
  } catch (error) {
    return res.status(500).json({ error: 'behance_profile_error', message: error?.message || 'Unknown error' })
  }
}
