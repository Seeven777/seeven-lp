import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import {
  clients as fallbackClients,
  featuredProjects as fallbackProjects,
  reels as fallbackReels,
  behanceProjects as fallbackBehance,
  solutions as fallbackSolutions
} from './data'

const projectThemes = ['orange', 'wine', 'acid', 'violet', 'steel', 'sky', 'event', 'music', 'food']
const projectSizes = ['xl', 'md', 'md', 'lg', 'sm', 'sm']

const text = (value, fallback = '') => String(value ?? fallback).trim()

function parseList(value) {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean)
  return text(value).split(/[,\n]/).map(v => v.trim()).filter(Boolean)
}

function parseSignal(value) {
  return parseList(value)
    .map(Number)
    .filter(Number.isFinite)
    .map(v => Math.max(0, Math.min(100, v)))
    .slice(0, 6)
}

function mergeClients(rows = []) {
  const cmsRows = rows.filter(row => row?.active !== false)
  if (!cmsRows.length) return fallbackClients

  const normalized = cmsRows.map((item, index) => {
    const base = fallbackClients.find(client =>
      client.id === item.slug ||
      client.id === item.client_id ||
      client.id === item.id ||
      client.name === item.name ||
      client.handle === item.handle
    ) || {}

    return {
      ...base,
      ...item,
      id: text(item.slug || item.client_id || base.id || item.id, `client-${index}`),
      name: text(item.name || base.name, `Cliente ${index + 1}`),
      handle: text(item.handle || base.handle),
      category: text(item.category || base.category, 'Projeto'),
      accent: text(item.accent || base.accent, '#8b5cf6'),
      url: text(item.url || base.url),
      website: text(item.website || base.website),
      brandPoster: text(item.brandPoster || item.brand_poster || base.brandPoster),
      publicCover: text(item.publicCover || item.public_cover || base.publicCover),
      publicCoverFit: text(item.publicCoverFit || item.public_cover_fit || base.publicCoverFit, 'cover'),
      publicProof: text(item.publicProof || item.public_proof || base.publicProof)
    }
  })

  const keys = new Set(normalized.flatMap(client => [String(client.id), client.name, client.handle].filter(Boolean)))
  return [
    ...normalized,
    ...fallbackClients.filter(client => !keys.has(String(client.id)) && !keys.has(client.name) && !keys.has(client.handle))
  ]
}

function resolveClient(list, value) {
  if (!value) return null
  const needle = String(value)
  return list.find(client =>
    String(client.id) === needle ||
    client.name === value ||
    client.handle === value ||
    client.slug === value
  ) || null
}

function normalizeProject(item, index, clientList) {
  const client = resolveClient(clientList, item.client || item.client_id)
  const id = text(item.slug || item.id, `cms-project-${index}`)
  const execution = parseList(item.execution)
  const proof = parseList(item.proof)
  const tags = parseList(item.tags)
  const hasCase = Boolean(
    item.challenge || item.strategy || item.result || item.case_intro || item.headline || execution.length || proof.length
  )
  const before = item.before_title || item.before_text ? {
    title: text(item.before_title, 'ANTES'),
    text: text(item.before_text)
  } : null
  const after = item.after_title || item.after_text ? {
    title: text(item.after_title, 'DEPOIS'),
    text: text(item.after_text)
  } : null

  const caseStudy = hasCase ? {
    id,
    clientId: client?.id || text(item.client_id),
    client: client?.name || text(item.client || item.title, 'Projeto Seeven'),
    eyebrow: text(item.eyebrow || item.label || item.category, 'CASE / SEE7VEN'),
    headline: text(item.headline || item.title, 'Projeto'),
    intro: text(item.case_intro || item.description),
    challenge: text(item.challenge),
    strategy: text(item.strategy),
    execution: execution.length ? execution : tags,
    result: text(item.result || item.description),
    accent: text(item.accent || client?.accent, '#8b5cf6'),
    proof,
    before,
    after,
    source: text(item.source_url || item.url || client?.website || client?.url)
  } : null

  const intelligenceSignal = parseSignal(item.signal)
  const hasIntelligence = Boolean(
    item.research_context || item.audience || item.objective || item.constraint_text || item.insight ||
    item.decision_text || item.system_map || item.focus || item.channels || intelligenceSignal.length
  )
  const intelligence = hasIntelligence ? {
    id,
    client: client?.name || text(item.client || item.title, 'Projeto Seeven'),
    category: text(item.category || item.label, 'PROJECT / SEE7VEN'),
    accent: text(item.accent || client?.accent, '#8b5cf6'),
    context: text(item.research_context || item.description),
    audience: text(item.audience),
    objective: text(item.objective),
    constraint: text(item.constraint_text),
    insight: text(item.insight),
    decision: text(item.decision_text || item.strategy),
    system: text(item.system_map),
    result: text(item.result),
    focus: parseList(item.focus),
    channels: parseList(item.channels),
    signal: intelligenceSignal
  } : null

  return {
    _rawId: item.id,
    _slug: text(item.slug),
    id,
    clientId: client?.id || text(item.client_id),
    client: client?.name || text(item.client || item.title, 'Projeto Seeven'),
    label: text(item.label || item.category, 'PROJECT / SEE7VEN'),
    title: text(item.title, 'Projeto'),
    summary: text(item.description || item.summary),
    category: text(item.category),
    tags,
    theme: text(item.theme, projectThemes[index % projectThemes.length]),
    size: text(item.size, projectSizes[index % projectSizes.length]),
    href: text(item.url || item.source_url, '#work'),
    cover: text(item.cover || item.poster),
    active: item.active !== false,
    order: Number(item.order ?? index),
    caseStudy,
    intelligence
  }
}

function mergeProjects(rows = [], clientList) {
  const active = rows
    .filter(item => item?.active !== false)
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
  if (!active.length) return fallbackProjects

  const dynamic = active.map((item, index) => normalizeProject(item, index, clientList))
  const result = [...fallbackProjects]
  const used = new Set()

  dynamic.forEach((item, index) => {
    let target = -1
    // A slug is the canonical identity of a project. A new project for the
    // same client must be appended instead of silently replacing the seeded
    // case for that client. Client matching is kept only for legacy rows that
    // predate slugs.
    if (item._slug) target = result.findIndex((base, i) => !used.has(i) && base.id === item._slug)
    if (target < 0 && !item._slug && item.clientId) target = result.findIndex((base, i) => !used.has(i) && base.clientId === item.clientId)

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
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
    .slice(0, 36)
}

function normalizeReel(item, index, clientList) {
  const client = resolveClient(clientList, item.client || item.client_id)
  const legacyUrl = text(item.url)
  const permalink = text(item.permalink || (/instagram\.com\/(reel|p|tv)\//i.test(legacyUrl) ? legacyUrl : ''))
  const directVideo = text(item.video || (/\.(mp4|webm)(\?|$)/i.test(legacyUrl) ? legacyUrl : ''))

  return {
    _rawId: item.id,
    _slug: text(item.slug),
    clientId: client?.id || text(item.client_id, `cms-${index}`),
    client: client?.name || text(item.client, 'Seeven'),
    title: text(item.title, `Reel ${index + 1}`),
    description: text(item.description || client?.publicProof),
    poster: text(item.poster),
    video: directVideo,
    permalink,
    url: permalink || directVideo || text(client?.url),
    accent: text(item.accent || client?.accent, '#8b5cf6'),
    featured: Boolean(item.featured),
    active: item.active !== false,
    order: Number(item.order ?? index)
  }
}

function mergeReels(rows = [], clientList) {
  const active = rows.filter(item => item?.active !== false)
  const reelLike = active.filter(item =>
    /reel|video|motion/i.test(text(item.category)) ||
    item.video || item.permalink || item.poster ||
    /instagram\.com\/(reel|tv|p)\//i.test(text(item.url)) ||
    /\.(mp4|webm)(\?|$)/i.test(text(item.url))
  )

  if (!reelLike.length) return fallbackReels
  const dynamic = reelLike
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
    .map((item, index) => normalizeReel(item, index, clientList))

  const result = [...fallbackReels]
  const perClientSlot = new Map()

  dynamic.forEach((item, index) => {
    const count = perClientSlot.get(item.clientId) || 0
    const candidates = result.map((reel, i) => ({ reel, i })).filter(({ reel }) => reel.clientId === item.clientId)
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

  return result
    .map(({ _rawId, _slug, ...item }) => item)
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
}

function normalizeBehance(item, index) {
  return {
    id: item.id || `behance-${index + 1}`,
    title: text(item.title, `Projeto Behance ${index + 1}`),
    client: text(item.client, 'Seeven Projects'),
    theme: text(item.theme, 'editorial'),
    url: text(item.url || item.source_url),
    cover: text(item.cover || item.poster),
    tools: parseList(item.tools),
    active: item.active !== false,
    order: Number(item.order ?? index)
  }
}

function mergeBehance(rows = []) {
  const active = rows
    .filter(item => item?.active !== false)
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
  if (!active.length) return fallbackBehance

  const byUrl = new Map(fallbackBehance.filter(item => item.url).map(item => [item.url, item]))
  active.map(normalizeBehance).forEach(item => {
    const key = item.url || `cms-${item.id}`
    byUrl.set(key, { ...(byUrl.get(key) || {}), ...item })
  })
  return [...byUrl.values()].sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))
}

function normalizeServices(rows = []) {
  const active = rows
    .filter(row => row?.active !== false)
    .sort((a, b) => Number(a.order ?? 999) - Number(b.order ?? 999))

  if (!active.length) return fallbackSolutions
  return active.map((row, index) => ({
    id: row.id || `service-${index}`,
    problem: text(row.title, 'Qual problema precisa resolver?'),
    answer: text(row.description),
    stack: parseList(row.stack || row.tags)
  }))
}

export function useCmsContent() {
  const [content, setContent] = useState({
    clients: fallbackClients,
    projects: fallbackProjects,
    reels: fallbackReels,
    behance: fallbackBehance,
    services: fallbackSolutions,
    source: 'static',
    loading: Boolean(supabase),
    errors: []
  })

  useEffect(() => {
    if (!supabase) return undefined
    let cancelled = false

    const load = async () => {
      // Always scope the public experience to published rows explicitly.
      // This prevents drafts from leaking into the LP when an admin session is
      // stored in the same browser and RLS also grants that admin draft access.
      const publicRows = table => supabase.from(table).select('*').or('active.is.null,active.eq.true').order('order', { ascending: true })
      const resources = [
        ['clients', publicRows('clients')],
        ['projects', publicRows('projects')],
        ['contents', publicRows('contents')],
        ['behance_items', publicRows('behance_items')],
        ['services', publicRows('services')]
      ]
      const results = await Promise.all(resources.map(([, request]) => request))
      if (cancelled) return

      const map = Object.fromEntries(resources.map(([name], index) => [name, results[index]]))
      const errors = Object.entries(map)
        .filter(([, result]) => result.error)
        .map(([name, result]) => `${name}: ${result.error.message}`)

      const clientList = map.clients.error ? fallbackClients : mergeClients(map.clients.data || [])
      const projects = map.projects.error ? fallbackProjects : mergeProjects(map.projects.data || [], clientList)
      const reelItems = map.contents.error ? fallbackReels : mergeReels(map.contents.data || [], clientList)
      const behance = map.behance_items.error ? fallbackBehance : mergeBehance(map.behance_items.data || [])
      const services = map.services.error ? fallbackSolutions : normalizeServices(map.services.data || [])
      const anyCms = Object.values(map).some(result => !result.error && result.data?.length)

      setContent({
        clients: clientList,
        projects,
        reels: reelItems,
        behance,
        services,
        source: anyCms ? 'supabase+fallback' : 'static',
        loading: false,
        errors
      })
    }

    load().catch(error => {
      if (cancelled) return
      setContent(current => ({ ...current, loading: false, errors: [error?.message || 'Falha ao carregar CMS'] }))
    })

    return () => { cancelled = true }
  }, [])

  return content
}
