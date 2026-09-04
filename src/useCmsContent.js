import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import { clients as fallbackClients, featuredProjects as fallbackProjects, reels as fallbackReels, behanceProjects as fallbackBehance } from './data'

const projectThemes = ['orange', 'wine', 'acid', 'violet', 'steel', 'sky', 'event', 'music', 'food']
const projectSizes = ['xl', 'md', 'md', 'lg', 'sm', 'sm']

function mergeClients(rows = []) {
  if (!rows.length) return fallbackClients
  const normalized = rows.filter(item => item.active !== false).map((item, index) => {
    const base = fallbackClients.find(c => c.id === item.slug || c.id === item.client_id || c.id === item.id || c.name === item.name || c.handle === item.handle) || {}
    return {
      ...base,
      ...item,
      // Preserve the stable front-end id whenever the CMS row clearly belongs
      // to one of the seeded clients. Supabase UUIDs should not break static
      // reel/client relationships while the CMS is being migrated.
      id: item.slug || item.client_id || base.id || item.id || `client-${index}`,
      name: item.name || base.name || `Cliente ${index + 1}`,
      handle: item.handle || base.handle || '',
      category: item.category || base.category || 'Projeto',
      accent: item.accent || base.accent || '#8b5cf6',
      url: item.url || base.url || '#',
      website: item.website || base.website || '',
      brandPoster: item.brandPoster || item.brand_poster || base.brandPoster || '',
      publicCover: item.publicCover || item.public_cover || base.publicCover || '',
      publicCoverFit: item.publicCoverFit || item.public_cover_fit || base.publicCoverFit || 'cover',
      publicProof: item.publicProof || item.public_proof || base.publicProof || ''
    }
  })
  const keys = new Set(normalized.flatMap(c => [String(c.id), c.name, c.handle].filter(Boolean)))
  return [...normalized, ...fallbackClients.filter(c => !keys.has(String(c.id)) && !keys.has(c.name) && !keys.has(c.handle))]
}

function resolveClient(list, value) {
  if (!value) return null
  return list.find(c => String(c.id) === String(value) || c.name === value || c.handle === value) || null
}

function parseList(value) {
  if (Array.isArray(value)) return value.filter(Boolean)
  return String(value || '').split(/[,\n]/).map(v => v.trim()).filter(Boolean)
}

function parseSignal(value) {
  const values = parseList(value).map(v => Math.max(0, Math.min(100, Number(v)))).filter(Number.isFinite)
  return values.length ? values.slice(0, 6) : []
}

function normalizeProject(item, index, clientList) {
  const client = resolveClient(clientList, item.client || item.client_id)
  const id = item.slug || item.id || `cms-project-${index}`
  const execution = parseList(item.execution)
  const proof = parseList(item.proof)
  const hasCase = Boolean(item.challenge || item.strategy || item.result || item.case_intro || item.headline || execution.length || proof.length)
  const before = item.before_title || item.before_text ? { title: item.before_title || 'ANTES', text: item.before_text || '' } : null
  const after = item.after_title || item.after_text ? { title: item.after_title || 'DEPOIS', text: item.after_text || '' } : null
  const caseStudy = hasCase ? {
    id,
    clientId: client?.id || item.client_id || '',
    client: client?.name || item.client || item.title || 'Projeto Seeven',
    eyebrow: item.eyebrow || item.label || item.category || 'CASE / SEE7VEN',
    headline: item.headline || item.title || 'Projeto',
    intro: item.case_intro || item.description || '',
    challenge: item.challenge || 'Contexto em documentação.',
    strategy: item.strategy || 'Estratégia em documentação.',
    execution: execution.length ? execution : parseList(item.tags),
    result: item.result || item.description || '',
    accent: item.accent || client?.accent || '#8b5cf6',
    proof,
    before,
    after,
    source: item.source_url || item.url || client?.website || client?.url || ''
  } : null

  const intelligenceSignal = parseSignal(item.signal)
  const hasIntelligence = Boolean(item.research_context || item.audience || item.objective || item.constraint_text || item.insight || item.decision_text || item.system_map || item.focus || item.channels || intelligenceSignal.length)
  const intelligence = hasIntelligence ? {
    id,
    client: client?.name || item.client || item.title || 'Projeto Seeven',
    category: item.category || item.label || 'PROJECT / SEE7VEN',
    accent: item.accent || client?.accent || '#8b5cf6',
    context: item.research_context || item.description || '',
    audience: item.audience || '',
    objective: item.objective || '',
    constraint: item.constraint_text || '',
    insight: item.insight || '',
    decision: item.decision_text || item.strategy || '',
    system: item.system_map || '',
    result: item.result || '',
    focus: parseList(item.focus),
    channels: parseList(item.channels),
    signal: intelligenceSignal
  } : null

  return {
    _rawId: item.id,
    _slug: item.slug || '',
    id,
    clientId: client?.id || item.client_id || '',
    client: client?.name || item.client || item.title || 'Projeto Seeven',
    label: item.label || item.category || 'PROJECT / SEE7VEN',
    title: item.title || 'Projeto',
    summary: item.description || item.summary || '',
    tags: parseList(item.tags),
    theme: item.theme || projectThemes[index % projectThemes.length],
    size: item.size || projectSizes[index % projectSizes.length],
    href: item.url || '#portfolio',
    cover: item.cover || item.poster || '',
    active: item.active !== false,
    order: Number(item.order ?? index),
    caseStudy,
    intelligence
  }
}

function mergeProjects(rows, clientList) {
  const active = (rows || []).filter(item => item.active !== false).sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
  if (!active.length) return fallbackProjects

  const dynamic = active.map((item, index) => normalizeProject(item, index, clientList))
  const result = [...fallbackProjects]
  const used = new Set()

  dynamic.forEach((item, index) => {
    let target = -1
    if (item._slug) target = result.findIndex((base, i) => !used.has(i) && base.id === item._slug)
    if (target < 0 && item.clientId) target = result.findIndex((base, i) => !used.has(i) && base.clientId === item.clientId)
    if (target >= 0) {
      const base = result[target]
      result[target] = { ...base, ...item, id: item._slug || base.id }
      used.add(target)
    } else {
      const { _rawId, _slug, ...clean } = item
      result.push({ ...clean, id: _slug || `cms-project-${_rawId || index}` })
    }
  })

  return result
    .map(({ _rawId, _slug, ...item }) => item)
    .slice(0, 24)
}

function normalizeReel(item, index, clientList) {
  const client = resolveClient(clientList, item.client || item.client_id)
  const directVideo = item.video || (/\.(mp4|webm)(\?|$)/i.test(String(item.url || '')) ? item.url : '')
  return {
    _rawId: item.id,
    _slug: item.slug || '',
    clientId: client?.id || item.client_id || `cms-${index}`,
    client: client?.name || item.client || 'Seeven',
    title: item.title || `Reel ${index + 1}`,
    poster: item.poster || '',
    video: directVideo,
    url: item.permalink || (/instagram\.com\/(reel|p|tv)\//i.test(String(item.url || '')) ? item.url : '') || client?.url || '#',
    accent: item.accent || client?.accent || '#8b5cf6',
    featured: Boolean(item.featured),
    publicContext: item.description || client?.publicProof || '',
    active: item.active !== false,
    order: Number(item.order ?? index)
  }
}

function mergeReels(rows, clientList) {
  const active = (rows || []).filter(item => item.active !== false)
  const probable = active.filter(item => /reel|video|motion/i.test(String(item.category || '')))
  const hasCategories = active.some(item => String(item.category || '').trim())
  const legacyMedia = active.filter(item => item.video || item.permalink || /\.(mp4|webm)(\?|$)/i.test(String(item.url || '')) || /instagram\.com\/(reel|tv)\//i.test(String(item.url || '')))
  const source = (probable.length ? probable : hasCategories ? legacyMedia : active.filter(item => item.poster || legacyMedia.includes(item)))
    .sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
  if (!source.length) return fallbackReels

  const dynamic = source.map((item, index) => normalizeReel(item, index, clientList))
  const result = [...fallbackReels]
  const perClientSlot = new Map()

  dynamic.forEach((item, index) => {
    const count = perClientSlot.get(item.clientId) || 0
    const candidates = result.map((r, i) => ({ r, i })).filter(({ r }) => r.clientId === item.clientId)
    const target = candidates[count]?.i ?? -1
    perClientSlot.set(item.clientId, count + 1)

    if (target >= 0) {
      const base = result[target]
      result[target] = { ...base, ...item, id: item._slug || base.id }
    } else {
      const { _rawId, _slug, ...clean } = item
      result.push({ ...clean, id: _slug || `cms-reel-${_rawId || index}` })
    }
  })

  return result.map(({ _rawId, _slug, ...item }) => item)
}


function normalizeBehance(item, index) {
  return {
    id: item.id || `behance-${index + 1}`,
    title: item.title || `Projeto Behance ${index + 1}`,
    client: item.client || 'Seeven Projects',
    theme: item.theme || 'editorial',
    url: item.url || item.source_url || '#',
    cover: item.cover || item.poster || '',
    tools: parseList(item.tools),
    active: item.active !== false,
    order: Number(item.order ?? index)
  }
}

function mergeBehance(rows = []) {
  const active = rows.filter(item => item.active !== false).sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
  if (!active.length) return fallbackBehance
  const dynamic = active.map(normalizeBehance)
  const byUrl = new Map(fallbackBehance.map(item => [item.url, item]))
  dynamic.forEach(item => byUrl.set(item.url || `cms-${item.id}`, { ...(byUrl.get(item.url) || {}), ...item }))
  return [...byUrl.values()].sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
}

export function useCmsContent() {
  const [content, setContent] = useState({ clients: fallbackClients, projects: fallbackProjects, reels: fallbackReels, behance: fallbackBehance, source: 'static' })

  useEffect(() => {
    if (!supabase) return
    let cancelled = false

    const load = async () => {
      const [clientResult, projectResult, contentResult, behanceResult] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('contents').select('*'),
        supabase.from('behance_items').select('*')
      ])
      if (cancelled) return

      const clientList = !clientResult.error ? mergeClients(clientResult.data || []) : fallbackClients
      const projects = !projectResult.error ? mergeProjects(projectResult.data || [], clientList) : fallbackProjects
      const reelItems = !contentResult.error ? mergeReels(contentResult.data || [], clientList) : fallbackReels
      const behance = !behanceResult.error ? mergeBehance(behanceResult.data || []) : fallbackBehance
      const anyCms = [clientResult, projectResult, contentResult, behanceResult].some(result => !result.error && result.data?.length)

      setContent({ clients: clientList, projects, reels: reelItems, behance, source: anyCms ? 'supabase+fallback' : 'static' })
    }

    load().catch(() => {})
    return () => { cancelled = true }
  }, [])

  return content
}
