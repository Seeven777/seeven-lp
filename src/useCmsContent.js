import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { clients as fallbackClients, featuredProjects as fallbackProjects, reels as fallbackReels } from './data'

const projectThemes = ['orange', 'wine', 'acid', 'violet', 'steel', 'sky']
const projectSizes = ['xl', 'md', 'md', 'lg', 'sm', 'sm']

function normalizeClientName(value) {
  if (!value) return ''
  const byId = fallbackClients.find(c => String(c.id) === String(value))
  return byId?.name || String(value)
}

export function useCmsContent() {
  const [content, setContent] = useState({ projects: fallbackProjects, reels: fallbackReels, source: 'static' })

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    const load = async () => {
      const [projectResult, contentResult] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('contents').select('*')
      ])

      if (cancelled) return

      let projects = fallbackProjects
      if (!projectResult.error && projectResult.data?.length) {
        const active = projectResult.data.filter(item => item.active !== false)
        if (active.length) {
          projects = active
            .sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
            .slice(0, 8)
            .map((item, index) => ({
              id: item.id,
              client: item.client || item.title || 'Projeto Seeven',
              label: item.category || 'PROJECT / SEE7VEN',
              title: item.title || 'Projeto',
              summary: item.description || '',
              tags: item.tags || [],
              theme: item.theme || projectThemes[index % projectThemes.length],
              size: item.size || projectSizes[index % projectSizes.length],
              href: item.url || '#portfolio',
              cover: item.cover || item.poster || ''
            }))
        }
      }

      let reelItems = fallbackReels
      if (!contentResult.error && contentResult.data?.length) {
        const active = contentResult.data.filter(item => item.active !== false)
        const probableReels = active.filter(item => /reel|video|motion/i.test(String(item.category || '')))
        const source = probableReels.length ? probableReels : active.filter(item => item.poster || /\.mp4|\.webm|instagram/i.test(String(item.url || '')))
        if (source.length) {
          reelItems = source
            .sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
            .map((item, index) => {
              const clientName = normalizeClientName(item.client)
              const client = fallbackClients.find(c => c.name === clientName || c.id === item.client)
              return {
                id: item.id || `cms-${index}`,
                clientId: client?.id || `cms-${index}`,
                client: clientName || item.client || 'Seeven',
                title: item.title || `Reel ${index + 1}`,
                poster: item.poster || '',
                video: /\.mp4|\.webm/i.test(String(item.url || '')) ? item.url : '',
                url: item.url || client?.url || '#',
                accent: client?.accent || '#8b5cf6'
              }
            })
        }
      }

      setContent({ projects, reels: reelItems, source: 'supabase' })
    }

    load().catch(() => {})
    return () => { cancelled = true }
  }, [])

  return content
}
