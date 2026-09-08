import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  solutions,
  touchpoints,
  sindpetshopStats,
  sindpetshopScale,
  knowledgeGroups,
  capabilityPipelines,
  ecosystemDetails,
  pitchPresets,
  caseStudies,
  portfolioFilterOptions,
  pitchCopy,
  projectIntelligence,
  strategyStages
} from './data'
import { useCmsContent } from './useCmsContent'

const externalArrow = '↗'
const toolEvidenceLinks = {
  'Adobe Photoshop': 'https://www.behance.net/gallery/246850317/Sindpetshop-SP',
  Photoshop: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D',
  'Adobe Illustrator': 'https://www.behance.net/gallery/246850317/Sindpetshop-SP',
  'Adobe Premiere Pro': 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D',
  'Adobe After Effects': 'https://www.behance.net/gallery/246850317/Sindpetshop-SP',
  'After Effects': 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D',
  Blender: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D'
}

const filterTerms = {
  strategy: ['estratégia', 'strategy', 'posicionamento', 'b2b', 'sistema', 'conversão'],
  brand: ['branding', 'brand', 'identidade', 'direção visual', 'design'],
  social: ['social', 'conteúdo', 'content', 'instagram'],
  video: ['vídeo', 'video', 'motion', 'música', 'music', 'reel'],
  web: ['web', 'site', 'landing', 'digital'],
  physical: ['físico', 'evento', 'event', 'impresso', 'embalagem', 'uniforme', 'experiência']
}

const curatedProjectIds = new Set(portfolioFilterOptions.flatMap(option => option.ids || []))

const faqItems = [
  ['Preciso saber exatamente o que contratar?', 'Não. Você pode chegar com um problema, uma meta ou uma sensação de que a marca parou no tempo. O primeiro trabalho é organizar o que realmente precisa mudar.'],
  ['Vocês fazem só redes sociais?', 'Não. Social é um ponto de contato. A Seeven também trabalha com identidade, campanhas, vídeo, sites, landing pages, materiais físicos, eventos e sistemas de comunicação.'],
  ['Dá para começar por um projeto menor?', 'Sim. O escopo pode começar por uma campanha, identidade, landing page, vídeo ou outro projeto pontual e evoluir conforme fizer sentido.'],
  ['Vocês atendem marcas de segmentos diferentes?', 'Sim. O portfólio mostra justamente linguagens diferentes porque a solução parte do problema, do público e do contexto de cada marca.'],
  ['Como começa a conversa?', 'O brief rápido leva menos de um minuto. Depois disso, a conversa já começa com contexto suficiente para entender o próximo passo.']
]

function track(event, detail = {}) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...detail })
    window.dispatchEvent(new CustomEvent('seeven:analytics', { detail: { event, ...detail } }))
  } catch (_) {}
}

let bodyLockCount = 0
let bodyLockPrevious = ''
function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    if (bodyLockCount === 0) {
      bodyLockPrevious = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    bodyLockCount += 1
    return () => {
      bodyLockCount = Math.max(0, bodyLockCount - 1)
      if (bodyLockCount === 0) document.body.style.overflow = bodyLockPrevious
    }
  }, [locked])
}

function getFocusable(container) {
  if (!container) return []
  return [...container.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(node => !node.hasAttribute('hidden') && node.getAttribute('aria-hidden') !== 'true' && node.getClientRects().length > 0)
}

function useDialogFocus(open, { containerRef, initialRef, onClose, onKey } = {}) {
  const previousFocus = useRef(null)
  const closeHandler = useRef(onClose)
  const keyHandler = useRef(onKey)
  closeHandler.current = onClose
  keyHandler.current = onKey
  useEffect(() => {
    if (!open) return undefined
    previousFocus.current = document.activeElement
    const focusInitial = () => {
      const target = initialRef?.current || getFocusable(containerRef?.current)[0]
      target?.focus?.()
    }
    const raf = requestAnimationFrame(focusInitial)
    const handleKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeHandler.current?.()
        return
      }
      if (event.key === 'Tab') {
        const nodes = getFocusable(containerRef?.current)
        if (!nodes.length) return
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
      keyHandler.current?.(event)
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', handleKey)
      previousFocus.current?.focus?.()
    }
  }, [open, containerRef, initialRef])
}

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [query])
  return matches
}

function isInstagramMedia(url = '') {
  return /instagram\.com\/(reel|p|tv)\//i.test(String(url))
}

function isDirectVideo(url = '') {
  return /\.(mp4|webm)(\?|$)/i.test(String(url))
}

function safeHttpUrl(value = '') {
  try {
    const parsed = new URL(String(value))
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.toString() : ''
  } catch (_) {
    return ''
  }
}

function reelReady(reel) {
  return Boolean(reel?.video || reel?.poster || isInstagramMedia(reel?.permalink || reel?.url))
}

function playableReel(reel) {
  return Boolean(reel?.video || isInstagramMedia(reel?.permalink || reel?.url))
}

function instagramEmbedUrl(url = '') {
  try {
    const parsed = new URL(url)
    const parts = parsed.pathname.split('/').filter(Boolean)
    const typeIndex = parts.findIndex(part => ['reel', 'p', 'tv'].includes(part))
    if (typeIndex < 0 || !parts[typeIndex + 1]) return ''
    return `https://www.instagram.com/${parts[typeIndex]}/${parts[typeIndex + 1]}/embed/`
  } catch (_) {
    return ''
  }
}

function SmartImage({ src, alt = '', className = '', ...props }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [src])
  if (!src || failed) return null
  return <img src={src} alt={alt} className={className} decoding="async" onError={() => setFailed(true)} {...props}/>
}

function caseIdFromLocation() {
  const match = window.location.pathname.match(/^\/work\/([^/]+)\/?$/)
  return match ? decodeURIComponent(match[1]) : ''
}

function projectSearchText(project) {
  return [project.id, project.client, project.label, project.title, project.summary, project.category, ...(project.tags || [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function projectMatches(project, filter) {
  if (!filter || filter.id === 'all') return true
  if (filter.ids?.includes(project.id)) return true
  // Seeded/curated projects stay intentionally different between filters.
  // Projects added later through the CMS can still enter a filter by taxonomy.
  if (curatedProjectIds.has(project.id)) return false
  const haystack = projectSearchText(project)
  return (filterTerms[filter.id] || []).some(term => haystack.includes(term))
}

function mergeCaseData(project) {
  return project?.caseStudy || caseStudies[project?.id] || null
}

function mergeIntelligence(project) {
  return project?.intelligence || projectIntelligence.find(item => item.id === project?.id) || null
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    track('ui_error', { message: error?.message || 'unknown' })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <main className="fatal-state">
        <span>SEE7VEN / RECOVERY</span>
        <h1>A experiência encontrou um erro.</h1>
        <p>Recarregue a página. Se o problema persistir, o contato continua disponível.</p>
        <div><button onClick={() => window.location.reload()}>Recarregar</button>{import.meta.env.VITE_KAREN_WHATSAPP && <a href={`https://wa.me/${String(import.meta.env.VITE_KAREN_WHATSAPP).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">WhatsApp {externalArrow}</a>}</div>
      </main>
    )
  }
}

function useExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const lowMemory = Number(navigator.deviceMemory || 8) <= 4
    const lowCpu = Number(navigator.hardwareConcurrency || 8) <= 4
    root.dataset.motion = reduced || coarse || lowMemory || lowCpu ? 'lite' : 'full'

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        root.style.setProperty('--scroll-pct', `${Math.min(100, Math.max(0, window.scrollY / max * 100))}%`)
        const sections = [...document.querySelectorAll('main > section')]
        const active = sections.find(section => {
          const rect = section.getBoundingClientRect()
          return rect.top <= 48 && rect.bottom > 48
        })
        root.dataset.phase = active?.dataset.phase || 'light'
      })
    }

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' })

    const observe = (scope = document) => scope.querySelectorAll?.('[data-reveal]').forEach(node => revealObserver.observe(node))
    observe()
    const mutationObserver = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches?.('[data-reveal]')) revealObserver.observe(node)
          observe(node)
        }
      }))
    })
    mutationObserver.observe(document.getElementById('root') || document.body, { childList: true, subtree: true })

    const onKey = event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(value => !value)
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setMenuOpen(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKey)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKey)
      revealObserver.disconnect()
      mutationObserver.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return { menuOpen, setMenuOpen, paletteOpen, setPaletteOpen }
}

function Header({ menuOpen, setMenuOpen, setPaletteOpen, onBrief }) {
  const mobile = useMediaQuery('(max-width: 980px)')
  useBodyLock(menuOpen && mobile)
  const links = [
    ['Trabalhos', '#work'],
    ['Case', '#case-sindpetshop'],
    ['Vídeo', '#motion'],
    ['O que resolvemos', '#solutions'],
    ['Contato', '#contact']
  ]
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="Seeven — início"><span className="brand-mark">7</span><span>SEE7VEN</span></a>
      <nav id="primary-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="command-trigger" onClick={() => setPaletteOpen(true)} aria-label="Abrir navegação rápida">Explorar <kbd>⌘K</kbd></button>
        <button className="header-cta" onClick={() => { setMenuOpen(false); onBrief() }}>Falar sobre um projeto</button>
        <button className="menu-toggle" onClick={() => setMenuOpen(value => !value)} aria-expanded={menuOpen} aria-controls="primary-navigation" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}><span/><span/></button>
      </div>
      <i className="header-progress" aria-hidden="true" />
    </header>
  )
}

function CommandPalette({ open, onClose, projects, onBrief }) {
  const [query, setQuery] = useState('')
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  useBodyLock(open)
  useDialogFocus(open, { containerRef: dialogRef, initialRef: inputRef, onClose })
  useEffect(() => { if (!open) setQuery('') }, [open])
  if (!open) return null

  const base = [
    ['01', 'Trabalhos selecionados', '#work', 'portfolio branding social'],
    ['02', 'Case Sindpetshop-SP', '#case-sindpetshop', 'case resultado estratégia site'],
    ['03', 'Motion archive', '#motion', 'reels vídeo motion'],
    ['04', 'Como a Seeven pensa', '#strategy', 'método insight decisão'],
    ['05', 'Do pixel ao papel', '#pixel-paper', 'impresso embalagem evento'],
    ['06', 'Problemas que resolvemos', '#solutions', 'soluções vender marca campanha site'],
    ['07', 'Capability OS', '#capabilities', 'photoshop blender react ferramentas'],
    ['08', 'Arquivo Behance', '#behance', 'behance projetos'],
    ['09', 'Contato / brief rápido', '#contact', 'whatsapp orçamento projeto contato'],
  ]
  const projectItems = projects.map((project, index) => [
    `P${String(index + 1).padStart(2, '0')}`,
    `${project.client} — ${project.title}`,
    `/work/${encodeURIComponent(project.id)}`,
    projectSearchText(project)
  ])
  const normalized = query.trim().toLowerCase()
  const visible = [...base, ...projectItems]
    .filter(item => !normalized || `${item[1]} ${item[3]}`.toLowerCase().includes(normalized))
    .slice(0, 14)

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div ref={dialogRef} className="command-palette" role="dialog" aria-modal="true" aria-label="Navegação rápida" onMouseDown={event => event.stopPropagation()}>
        <div className="palette-search"><span>SEE7VEN / FIND</span><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Busque projeto, cliente ou capacidade…" aria-label="Buscar na Seeven"/><button onClick={onClose}>ESC</button></div>
        <div className="palette-results">
          {visible.map(([n, label, href]) => <a key={`${n}-${href}`} href={href} onClick={onClose}><span>{n}</span><strong>{label}</strong><i>{externalArrow}</i></a>)}
          {!visible.length && <p>Nenhum resultado para “{query}”.</p>}
        </div>
        <button className="palette-brief" onClick={() => { onClose(); onBrief() }}>Não sabe o que buscar? Conte o problema em 60 segundos →</button>
      </div>
    </div>
  )
}

function Hero({ pitch, prospect, onBrief }) {
  const context = pitchCopy[pitch]
  return (
    <section id="top" className="hero" data-phase="light">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-kicker" data-reveal><span className="status-dot"/> SEE7VEN / SÃO PAULO / ESTRATÉGIA + CRIAÇÃO + EXECUÇÃO</div>
      <div className="hero-copy">
        {context && <div className="pitch-context" data-reveal><b>{context.kicker}</b><span>{prospect ? `Uma ideia para ${prospect}.` : context.line}</span></div>}
        <h1 data-reveal>FAZEMOS<br/><span>MARCAS PARAREM.</span></h1>
        <div className="hero-sub" data-reveal>
          <p>Estratégia, branding, conteúdo, vídeo, web e físico conectados para transformar atenção em <strong>presença de marca.</strong></p>
          <div><a href="#work">Ver o que já fizemos ↓</a><button onClick={() => onBrief()}>Tenho um problema para resolver {externalArrow}</button></div>
        </div>
      </div>
      <div className="hero-seven" aria-hidden="true"><span>7</span><i/><i/><i/></div>
      <div className="hero-foot"><span>DO PIXEL AO PAPEL.</span><span>UMA MARCA. VÁRIOS PONTOS DE CONTATO.</span></div>
    </section>
  )
}

function ClientRail({ clientList }) {
  const visible = clientList.filter(Boolean).slice(0, 18)
  return (
    <section className="client-rail" data-phase="light" aria-label="Marcas no portfólio">
      <div><span>REPERTÓRIO / {visible.length} MARCAS</span><p>Uma linguagem diferente para cada problema.</p></div>
      <div className="client-rail-track" role="list">
        {visible.map(client => <span className="client-chip" role="listitem" key={client.id} title={client.name}><b>{client.name}</b><small>{client.category}</small></span>)}
      </div>
    </section>
  )
}

function ProofBar({ clientCount = 0, reelCount = 32 }) {
  const items = [
    [String(clientCount || 11), 'marcas no repertório'],
    [String(reelCount || 32), 'Reels organizados no acervo'],
    ['WEB + SOCIAL + VÍDEO', 'execução conectada'],
    ['DIGITAL + FÍSICO', 'presença além da tela']
  ]
  return <section className="proof-bar" data-phase="light" aria-label="Resumo de capacidades">{items.map(([value, label]) => <article key={`${value}-${label}`}><strong>{value}</strong><span>{label}</span></article>)}</section>
}

function Manifesto() {
  return (
    <section className="manifesto section-shell" data-phase="light">
      <div className="section-index" data-reveal>01 / POSITION</div>
      <div className="manifesto-layout">
        <p className="manifesto-note" data-reveal>Mais conteúdo não resolve uma marca que não é percebida, entendida ou lembrada.</p>
        <div className="manifesto-copy" data-reveal>
          <p>Sua marca não precisa de <em>mais um post.</em></p>
          <p>Precisa ser <strong>percebida.</strong></p>
          <p>Entendida.</p>
          <p>Lembrada.</p>
          <p className="manifesto-accent">E continuar existindo quando a tela desliga.</p>
        </div>
      </div>
    </section>
  )
}

function ProjectVisual({ project, clientList }) {
  const client = clientList.find(item => item.id === project.clientId)
  const cover = project.cover || client?.publicCover || client?.brandPoster
  return (
    <div className={`project-visual theme-${project.theme || 'default'}`} style={{ '--accent': client?.accent || '#8b5cf6' }}>
      <div className="project-fallback" aria-hidden="true"><span>{project.client}</span><b>{project.label}</b><i>SEE7VEN / SELECTED WORK</i></div>
      <SmartImage src={cover} alt="" loading="lazy" />
      <div className="project-shade" />
      <span className="project-client">{project.client}</span>
      <span className="project-open">ABRIR CASE {externalArrow}</span>
    </div>
  )
}

function BeforeAfter({ study }) {
  const [position, setPosition] = useState(50)
  if (!study?.before || !study?.after) return null
  return (
    <div className="ba-block">
      <div className="ba-toolbar"><span>MUDANÇA DE LÓGICA / NÃO É UMA MÉTRICA</span><div><button onClick={() => setPosition(100)}>ANTES</button><button onClick={() => setPosition(50)}>COMPARAR</button><button onClick={() => setPosition(0)}>DEPOIS</button></div></div>
      <div className={`ba-stage ${position <= 2 ? 'edge-left' : position >= 98 ? 'edge-right' : ''}`} style={{ '--ba': `${position}%` }}>
        <article className="ba-side ba-before"><small>ANTES</small><strong>{study.before.title}</strong><p>{study.before.text}</p></article>
        <article className="ba-side ba-after"><small>DEPOIS</small><strong>{study.after.title}</strong><p>{study.after.text}</p></article>
        <label className="ba-slider"><span className="sr-only">Comparar antes e depois</span><input type="range" min="0" max="100" value={position} aria-valuetext={`${position}% de Antes`} onChange={event => setPosition(Number(event.target.value))}/><i><b>↔</b></i></label>
      </div>
    </div>
  )
}

function CaseDrawer({ project, clientList, onClose, onNext, onPrevious, onBrief }) {
  const study = mergeCaseData(project)
  const intelligence = mergeIntelligence(project)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useBodyLock(Boolean(project))
  useDialogFocus(Boolean(project), {
    containerRef: dialogRef,
    initialRef: closeRef,
    onClose,
    onKey: event => {
      if (event.key === 'ArrowRight') onNext()
      if (event.key === 'ArrowLeft') onPrevious()
    }
  })
  if (!project) return null

  const client = clientList.find(item => item.id === project.clientId)
  const accent = study?.accent || client?.accent || '#8b5cf6'
  const storyParts = [
    ['01 / DESAFIO', study?.challenge, 'text'],
    ['02 / ESTRATÉGIA', study?.strategy, 'text'],
    ['03 / EXECUÇÃO', Array.isArray(study?.execution) ? study.execution.filter(Boolean) : [], 'tags'],
    ['04 / RESULTADO', study?.result, 'text']
  ].filter(([, value, type]) => type === 'tags' ? value.length : String(value || '').trim())
  const intelligenceParts = [
    ['CONTEXTO', intelligence?.context], ['PÚBLICO', intelligence?.audience], ['INSIGHT', intelligence?.insight], ['DECISÃO', intelligence?.decision]
  ].filter(([, value]) => String(value || '').trim())
  const source = safeHttpUrl(study?.source) || safeHttpUrl(project.href)

  return (
    <div ref={dialogRef} className="case-drawer" role="dialog" aria-modal="true" aria-label={`Case ${project.client}`} style={{ '--case-accent': accent }}>
      <div className="case-drawer-top"><a href="#top" onClick={event => { event.preventDefault(); onClose() }}>SEE7VEN / CASE</a><button ref={closeRef} onClick={onClose}>FECHAR ×</button></div>
      <div className="case-hero">
        <div><span>{study?.eyebrow || project.label}</span><h2>{study?.headline || project.title}</h2><p>{study?.intro || project.summary}</p><div className="case-hero-tags">{(project.tags || []).slice(0, 5).map(tag => <b key={tag}>{tag}</b>)}</div></div>
        <ProjectVisual project={project} clientList={clientList}/>
      </div>
      {storyParts.length > 0 && <div className="case-story">{storyParts.map(([label, value, type]) => <article key={label}><span>{label}</span>{type === 'tags' ? <div>{value.map(item => <b key={item}>{item}</b>)}</div> : <p>{value}</p>}</article>)}</div>}
      {study?.before && study?.after && <BeforeAfter study={study}/>} 
      {intelligenceParts.length > 0 && <div className="case-intelligence"><div><span>PROJECT INTELLIGENCE</span><h3>O que guiou a decisão.</h3></div><div className="intelligence-grid">{intelligenceParts.map(([label, value]) => <article key={label}><small>{label}</small><p>{value}</p></article>)}</div></div>}
      {!storyParts.length && !intelligenceParts.length && <div className="case-minimal"><span>PROJETO SELECIONADO</span><h3>{project.client}</h3><p>{project.summary}</p><div>{(project.tags || []).map(tag => <b key={tag}>{tag}</b>)}</div></div>}
      <div className="case-conversion"><div><span>ESTE RACIOCÍNIO FAZ SENTIDO PARA SUA MARCA?</span><p>Você não precisa contratar a mesma entrega. Use o case como ponto de partida para discutir o problema.</p></div><button onClick={() => { onClose(); onBrief?.(`Quero explorar uma direção inspirada no case ${project.client}`) }}>CONVERSAR SOBRE UMA DIREÇÃO →</button></div>
      <div className="case-drawer-footer"><button onClick={onPrevious}>← CASE ANTERIOR</button>{source && <a href={source} target="_blank" rel="noreferrer">VER FONTE / PROJETO {externalArrow}</a>}<button onClick={onNext}>PRÓXIMO CASE →</button></div>
    </div>
  )
}

function Work({ projects, clientList, onBrief }) {
  const [filterId, setFilterId] = useState('all')
  const [activeCaseId, setActiveCaseId] = useState(() => caseIdFromLocation())
  const [showAllMobile, setShowAllMobile] = useState(false)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const filter = portfolioFilterOptions.find(item => item.id === filterId) || portfolioFilterOptions[0]
  const matched = projects.filter(project => projectMatches(project, filter))
  const visible = filterId === 'all' && isMobile && !showAllMobile ? matched.slice(0, 6) : matched
  const activeIndex = projects.findIndex(project => project.id === activeCaseId)
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null

  useEffect(() => {
    const onPop = () => setActiveCaseId(caseIdFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => { setShowAllMobile(false) }, [filterId])
  useEffect(() => {
    const baseTitle = 'Seeven — Fazemos marcas pararem.'
    document.title = activeProject ? `${activeProject.client} — Case Seeven` : baseTitle
    return () => { document.title = baseTitle }
  }, [activeProject])

  const openCase = project => {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
    setActiveCaseId(project.id)
    window.history.pushState({ seevenCase: true, returnTo }, '', `/work/${encodeURIComponent(project.id)}${window.location.search}`)
    track('case_open', { project: project.id, client: project.client })
  }
  const closeCase = () => {
    if (window.history.state?.seevenCase) {
      window.history.back()
      return
    }
    setActiveCaseId('')
    window.history.replaceState({}, '', `/${window.location.search}#work`)
  }
  const navigate = delta => {
    if (!projects.length) return
    const nextIndex = (activeIndex + delta + projects.length) % projects.length
    const project = projects[nextIndex]
    setActiveCaseId(project.id)
    window.history.replaceState({ ...(window.history.state || {}), seevenCase: true }, '', `/work/${encodeURIComponent(project.id)}${window.location.search}`)
    track('case_navigate', { project: project.id })
  }

  return (
    <section id="work" className="work-section section-shell" data-phase="light">
      <div className="work-heading">
        <div className="section-index" data-reveal>02 / SELECTED WORK</div>
        <h2 data-reveal>O TRABALHO<br/><span>VEM ANTES DA PROMESSA.</span></h2>
        <p data-reveal>Veja linguagens diferentes para problemas diferentes. Abra um projeto para entender a decisão por trás da estética.</p>
      </div>
      <div className="work-filter" role="tablist" aria-label="Filtrar portfólio">
        {portfolioFilterOptions.map(option => {
          const count = projects.filter(project => projectMatches(project, option)).length
          return <button key={option.id} className={filterId === option.id ? 'active' : ''} onClick={() => { setFilterId(option.id); track('work_filter', { filter: option.id }) }} role="tab" aria-selected={filterId === option.id}>{option.label}<small>{count}</small></button>
        })}
      </div>
      <div className="filter-context" key={filter.id}><span>{filter.label.toUpperCase()} / CURADORIA</span><p>{filter.description}</p><b>{matched.length} PROJETOS</b></div>
      <div className={`project-grid filter-${filter.id}`} key={filter.id}>
        {visible.map((project, index) => <button className={`project-card project-slot-${index % 6}`} key={project.id} onClick={() => openCase(project)} data-reveal>
          <ProjectVisual project={project} clientList={clientList}/>
          <div className="project-meta"><span>{project.label}</span><h3>{project.title}</h3><p>{project.summary}</p><div>{(project.tags || []).slice(0, 4).map(tag => <small key={tag}>{tag}</small>)}</div></div>
        </button>)}
      </div>
      {matched.length > visible.length && <button className="work-expand" onClick={() => setShowAllMobile(true)}>VER MAIS {matched.length - visible.length} PROJETOS ↓</button>}
      {!matched.length && <div className="empty-state"><b>Nenhum projeto publicado nesta categoria.</b><span>Novos trabalhos entram aqui conforme o portfólio cresce.</span></div>}
      <CaseDrawer project={activeProject} clientList={clientList} onClose={closeCase} onNext={() => navigate(1)} onPrevious={() => navigate(-1)} onBrief={onBrief}/>
    </section>
  )
}

function CaseSpotlight({ onBrief }) {
  const study = caseStudies['sindpetshop-ecosystem']
  return (
    <section id="case-sindpetshop" className="spotlight section-shell" data-phase="dark">
      <div className="spotlight-head"><div className="section-index" data-reveal>03 / FLAGSHIP CASE</div><h2 data-reveal>UM CASE QUE EXIGIA<br/><span>CLAREZA EM ESCALA.</span></h2><p data-reveal>Comunicação sindical envolve informação trabalhista, notícia, serviço, campanha, atendimento, site e materiais físicos. O desafio não era criar peças. Era criar um sistema.</p></div>
      <div className="spotlight-system" data-reveal>
        <div className="system-screen"><span>SINDPETSHOP.ORG.BR</span><strong>QUEM CUIDA<br/>TAMBÉM PRECISA<br/>SER CUIDADO.</strong><small>ECOSSISTEMA DIGITAL / SEE7VEN</small></div>
        <div className="system-stack">{['ESTRATÉGIA','IDENTIDADE','SOCIAL','SITE','LANDING PAGES','VÍDEO','IMPRESSO'].map((item, index) => <span key={item} style={{ '--i': index }}>{item}</span>)}</div>
      </div>
      <div className="spotlight-story">
        <article data-reveal><span>O PROBLEMA</span><p>{study?.challenge}</p></article>
        <article data-reveal><span>A DECISÃO</span><p>{study?.strategy}</p></article>
        <article data-reveal><span>O SISTEMA</span><p>{study?.result}</p></article>
      </div>
      <div className="spotlight-scale">
        <div><span>CONTEXTO PÚBLICO DO CLIENTE</span><p>Dimensão da operação que a comunicação precisa organizar.</p></div>
        {sindpetshopScale.map(item => <article key={item.label} data-reveal><strong>{item.value}</strong><span>{item.label}</span></article>)}
      </div>
      <div className="spotlight-results">
        <div><span>RECORTE / AGOSTO 2026</span><h3>RESULTADO PRECISA<br/>TER CONTEXTO.</h3><p>Métricas identificadas por período, sem misturar alcance da operação com performance de conteúdo.</p></div>
        {sindpetshopStats.map(item => <article key={item.label} data-reveal><strong>{item.value}</strong><span>{item.label}</span><small>{item.delta}</small></article>)}
      </div>
      <div className="spotlight-actions" data-reveal>
        <button type="button" onClick={() => onBrief('Preciso organizar vários pontos de contato da minha marca')}>QUERO UM SISTEMA ASSIM →</button>
        <a className="spotlight-link" href="https://sindpetshop.org.br/" target="_blank" rel="noreferrer">VER ECOSSISTEMA AO VIVO {externalArrow}</a>
      </div>
    </section>
  )
}

function ReelPoster({ reel, clientList }) {
  const client = clientList.find(item => item.id === reel.clientId)
  const cover = reel.poster || client?.brandPoster
  return <div className="reel-poster" style={{ '--reel-accent': reel.accent || client?.accent || '#8b5cf6' }}><div className="reel-poster-fallback" aria-hidden="true"><em>7</em></div><SmartImage src={cover} alt="" loading="lazy"/><span>{reel.client}</span><strong>{reel.title}</strong>{playableReel(reel) ? <i>PLAY</i> : <i>VER MARCA</i>}</div>
}

function ReelModal({ reel, clientList, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useBodyLock(Boolean(reel))
  useDialogFocus(Boolean(reel), { containerRef: dialogRef, initialRef: closeRef, onClose })
  if (!reel) return null
  const embed = instagramEmbedUrl(reel.permalink || reel.url)
  return <div className="media-modal" onMouseDown={onClose}><div ref={dialogRef} className="media-dialog" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Vídeo — ${reel.client}`}><div className="media-top"><span>{reel.client} / {reel.title}</span><button ref={closeRef} onClick={onClose}>FECHAR ×</button></div><div className="media-frame">{reel.video ? <video src={reel.video} controls autoPlay playsInline/> : embed ? <iframe src={embed} title={`${reel.client} — ${reel.title}`} allowFullScreen/> : <ReelPoster reel={reel} clientList={clientList}/>}</div>{!playableReel(reel) && reel.url && <a href={reel.url} target="_blank" rel="noreferrer">VER PERFIL / FONTE {externalArrow}</a>}</div></div>
}

function MotionArchive({ items, clientList }) {
  const [modalReel, setModalReel] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const ready = useMemo(() => items.filter(reelReady).sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || Number(a.order ?? 999) - Number(b.order ?? 999)), [items])
  const playable = ready.filter(playableReel)
  const uniqueBrandFallbacks = useMemo(() => {
    const connectedClients = new Set(ready.map(item => item.clientId))
    return items.filter((item, index, array) => !connectedClients.has(item.clientId) && array.findIndex(other => other.clientId === item.clientId) === index)
  }, [items, ready])
  const archive = ready.length ? [...ready, ...uniqueBrandFallbacks] : items.filter((item, index, array) => array.findIndex(other => other.clientId === item.clientId) === index)
  const totalReels = items.length
  const collapsedLimit = isMobile ? 6 : 12
  const display = archive.slice(0, expanded ? archive.length : collapsedLimit)
  const connectedLabel = playable.length ? `${playable.length} de ${totalReels} vídeos conectados para assistir agora` : 'As marcas já estão organizadas; os vídeos entram conforme os links reais são conectados.'

  return (
    <section id="motion" className="motion-section section-shell" data-phase="dark">
      <div className="motion-heading"><div className="section-index" data-reveal>04 / MOTION ARCHIVE</div><h2 data-reveal>{totalReels} REELS.<br/><span>{new Set(items.map(item => item.clientId)).size} LINGUAGENS.</span></h2><div data-reveal><p>Ritmo, enquadramento e linguagem mudam conforme a marca. O arquivo cresce sem esconder o que ainda aguarda mídia real.</p><span>{connectedLabel}</span></div></div>
      <div className={`motion-grid ${ready.length ? 'has-media' : 'brand-mode'}`}>
        {display.map((reel, index) => {
          const clientUrl = clientList.find(client => client.id === reel.clientId)?.url
          const destination = safeHttpUrl(reel.url) || safeHttpUrl(clientUrl)
          return <button key={reel.id || `${reel.clientId}-${index}`} className={`reel-card ${playableReel(reel) ? 'is-playable' : ''}`} onClick={() => playableReel(reel) ? setModalReel(reel) : destination && window.open(destination, '_blank', 'noopener,noreferrer')} data-reveal>
            <ReelPoster reel={reel} clientList={clientList}/>
            <div className="reel-meta"><span>{String(index + 1).padStart(2, '0')}</span><b>{reel.client}</b><small>{playableReel(reel) ? 'REPRODUZIR' : 'VER PRESENÇA PÚBLICA'}</small></div>
          </button>
        })}
      </div>
      {archive.length > collapsedLimit && <button className="motion-expand" onClick={() => setExpanded(value => !value)}>{expanded ? 'REDUZIR ARQUIVO ↑' : `EXPLORAR ${archive.length} ITENS ↓`}</button>}
      <ReelModal reel={modalReel} clientList={clientList} onClose={() => setModalReel(null)}/>
    </section>
  )
}

function StrategyLens({ projects }) {
  const available = useMemo(() => projects.map(project => mergeIntelligence(project)).filter(Boolean).filter((item, index, array) => array.findIndex(other => other.id === item.id) === index), [projects])
  const [activeId, setActiveId] = useState('')
  const [stage, setStage] = useState('context')
  useEffect(() => {
    if (!available.length) return
    if (!available.some(item => item.id === activeId)) setActiveId(available[0].id)
  }, [available, activeId])
  const active = available.find(item => item.id === activeId) || available[0]
  if (!active) return null
  const stageCopy = { context: active.context, audience: active.audience, insight: active.insight, decision: active.decision, system: active.system, result: active.result }
  return (
    <section id="strategy" className="strategy-section section-shell" data-phase="dark">
      <div className="strategy-heading"><div className="section-index" data-reveal>05 / DECISION SYSTEM</div><h2 data-reveal>ANTES DA ESTÉTICA,<br/><span>EXISTE UMA DECISÃO.</span></h2><p data-reveal>Case bom não mostra só a peça final. Mostra contexto, público, insight e o porquê de cada escolha.</p></div>
      <div className="strategy-os" data-reveal>
        <aside>{available.map(item => <button key={item.id} className={item.id === active.id ? 'active' : ''} onClick={() => { setActiveId(item.id); setStage('context'); track('strategy_project', { project: item.id }) }}><span>{item.category || 'PROJETO'}</span><b>{item.client}</b></button>)}</aside>
        <div className="strategy-screen">
          <div className="strategy-screen-top"><span>{active.category || 'PROJECT INTELLIGENCE'}</span><b>{active.client}</b><i style={{ background: active.accent || '#8b5cf6' }}/></div>
          <div className="strategy-stage-tabs">{strategyStages.map(item => <button key={item.id} className={stage === item.id ? 'active' : ''} onClick={() => { setStage(item.id); track('strategy_stage', { stage: item.id, project: active.id }) }}><span>{item.index}</span>{item.label}</button>)}</div>
          <div className="strategy-stage-copy" key={`${active.id}-${stage}`}><span>{stage.toUpperCase()}</span><p>{stageCopy[stage] || 'Etapa não aplicável a este projeto.'}</p></div>
          {(active.objective || active.constraint) && <div className="strategy-objective">{active.objective && <article><small>OBJETIVO</small><p>{active.objective}</p></article>}{active.constraint && <article><small>RESTRIÇÃO</small><p>{active.constraint}</p></article>}</div>}
        </div>
      </div>
    </section>
  )
}

function PixelPaper() {
  const [mode, setMode] = useState('digital')
  return (
    <section id="pixel-paper" className="pixel-section section-shell" data-phase="dark">
      <div className="pixel-copy"><div className="section-index" data-reveal>06 / DIGITAL ↔ PHYSICAL</div><h2 data-reveal>DO PIXEL<br/><span>AO PAPEL.</span></h2><p data-reveal>A tela é só um dos lugares onde a marca existe. O sistema precisa continuar funcionando quando vira objeto, evento, embalagem ou material impresso.</p><div className="pixel-toggle" data-reveal><button className={mode === 'digital' ? 'active' : ''} onClick={() => setMode('digital')}>DIGITAL</button><button className={mode === 'physical' ? 'active' : ''} onClick={() => setMode('physical')}>FÍSICO</button></div><div className="pixel-mode-copy" aria-live="polite">{mode === 'digital' ? <><span>DIGITAL</span><b>Interface, social, vídeo e presença online.</b></> : <><span>FÍSICO</span><b>Impresso, evento, embalagem e objetos de marca.</b></>}</div></div>
      <div className={`pixel-stage mode-${mode}`} data-reveal>
        <div className="pixel-device"><span>SEE7VEN / SCREEN</span><b>MAKE<br/>IT STOP.</b></div>
        <div className="paper-card paper-a"><span>IDENTIDADE</span><b>7</b></div>
        <div className="paper-card paper-b"><span>CRACHÁ / EVENTO</span><b>SEE7VEN</b></div>
        <div className="paper-card paper-c"><span>FOLDER</span><b>DO PIXEL<br/>AO PAPEL.</b></div>
        <div className="paper-card paper-d"><span>PACKAGING</span><b>BRAND<br/>SYSTEM</b></div>
      </div>
    </section>
  )
}

function Ecosystem() {
  const [active, setActive] = useState(touchpoints[0])
  const detail = ecosystemDetails[active]
  return (
    <section className="ecosystem-section section-shell" data-phase="dark">
      <div className="ecosystem-copy"><div className="section-index" data-reveal>07 / TOUCHPOINTS</div><h2 data-reveal>UMA MARCA.<br/><span>VÁRIOS PONTOS DE CONTATO.</span></h2><p data-reveal>Escolha um ponto. A lógica muda, a marca não.</p><div className="ecosystem-detail" data-reveal><span>{active}</span><strong>{detail?.title}</strong><p>{detail?.copy}</p></div></div>
      <div className="ecosystem-map" data-reveal><div className="ecosystem-core"><small>SEE7VEN</small><b>MARCA</b><span>∞</span></div>{touchpoints.map((point, index) => <button key={point} className={active === point ? 'active' : ''} style={{ '--angle': `${index * (360 / touchpoints.length) - 90}deg` }} onClick={() => { setActive(point); track('ecosystem_touchpoint', { point }) }}>{point}</button>)}</div>
    </section>
  )
}

function CapabilityOS() {
  const [groupId, setGroupId] = useState(knowledgeGroups[0].id)
  const group = knowledgeGroups.find(item => item.id === groupId) || knowledgeGroups[0]
  const [toolName, setToolName] = useState(group.tools[0]?.name || '')
  useEffect(() => { setToolName(group.tools[0]?.name || '') }, [groupId])
  const tool = group.tools.find(item => item.name === toolName) || group.tools[0]
  return (
    <section id="capabilities" className="capability-section section-shell" data-phase="dark">
      <div className="capability-heading"><div className="section-index" data-reveal>09 / CAPABILITY OS</div><h2 data-reveal>FERRAMENTA NÃO É<br/><span>O PRODUTO.</span></h2><p data-reveal>O valor está em conectar estratégia, criação e execução. Aqui você vê onde cada ferramenta entra no processo — sem barras de “95%”.</p></div>
      <div className="capability-os" data-reveal>
        <aside>{knowledgeGroups.map(item => <button key={item.id} className={group.id === item.id ? 'active' : ''} onClick={() => { setGroupId(item.id); track('toolchain_group', { group: item.id }) }}><i style={{ background: item.accent }}/><span>{item.label}</span><b>{item.tools.length}</b></button>)}</aside>
        <div className="capability-tools">
          <div className="capability-tools-head"><span>{group.label}</span><small>ESCOLHA UMA FERRAMENTA. O PAINEL MOSTRA O PAPEL DELA NO FLUXO.</small></div>
          <div className="capability-tool-layout">
            <div className="capability-tool-list">{group.tools.map(item => <button key={item.name} className={item.name === tool?.name ? 'active' : ''} onClick={() => { setToolName(item.name); track('toolchain_tool', { tool: item.name }) }}><span>{item.short}</span><div><strong>{item.name}</strong><small>{item.use}</small></div><i>→</i></button>)}</div>
            {tool && <article className="capability-inspector"><span>CAPABILITY / {group.label.toUpperCase()}</span><div className="capability-icon">{tool.short}</div><h3>{tool.name}</h3><p>{tool.use}</p><div><small>COMO ENTRA</small><strong>Problema → decisão → {tool.name} → entrega</strong></div>{toolEvidenceLinks[tool.name] ? <a href={toolEvidenceLinks[tool.name]} target="_blank" rel="noreferrer" onClick={() => track('tool_evidence_open', { tool: tool.name })}>VER EVIDÊNCIA EM PROJETO {externalArrow}</a> : <span className="capability-evidence">CAPACIDADE DE PRODUÇÃO / SEE7VEN</span>}</article>}
          </div>
        </div>
      </div>
      <div className="pipeline-grid">{capabilityPipelines.map(pipe => <article key={pipe.title} data-reveal><span>{pipe.title}</span><div>{pipe.flow.map((step, index) => <React.Fragment key={step}><b>{step}</b>{index < pipe.flow.length - 1 && <i>→</i>}</React.Fragment>)}</div></article>)}</div>
    </section>
  )
}

function Solutions({ items, onBrief }) {
  const [active, setActive] = useState(0)
  const list = items?.length ? items : solutions
  useEffect(() => { if (active >= list.length) setActive(0) }, [active, list.length])
  return (
    <section id="solutions" className="solutions-section section-shell" data-phase="dark">
      <div className="solutions-heading"><div className="section-index" data-reveal>08 / BUSINESS PROBLEMS</div><h2 data-reveal>VOCÊ NÃO PRECISA<br/><span>SABER O NOME DO SERVIÇO.</span></h2><p data-reveal>Diga o que precisa mudar. A combinação de estratégia, design, conteúdo, web ou mídia vem depois.</p></div>
      <div className="solution-list">
        {list.map((item, index) => <article className={active === index ? 'active' : ''} key={`${item.problem}-${index}`} data-reveal><button onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.problem}</strong><i>{active === index ? '−' : '+'}</i></button><div className="solution-answer"><p>{item.answer}</p><div>{(item.stack || []).map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => onBrief(item.problem)}>Quero resolver isso →</button></div></article>)}
      </div>
    </section>
  )
}

function BehanceWall({ projects }) {
  const [expanded, setExpanded] = useState(false)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const validProjects = useMemo(() => (projects || []).filter(project => safeHttpUrl(project.url)), [projects])
  const limit = isMobile ? 6 : 12
  const visible = validProjects.slice(0, expanded ? validProjects.length : limit)
  return (
    <section id="behance" className="behance-section section-shell" data-phase="dark">
      <div className="behance-heading"><div className="section-index" data-reveal>10 / VISUAL ARCHIVE</div><h2 data-reveal>TRABALHOS QUE<br/><span>PEDEM TELA CHEIA.</span></h2><p data-reveal>O arquivo acompanha projetos publicados pela Seeven no Behance e reúne experimentos, campanhas, identidades e direção visual.</p></div>
      <div className="behance-grid">{visible.map((project, index) => <a key={project.id || project.url} href={safeHttpUrl(project.url)} target="_blank" rel="noreferrer" className={`behance-card behance-${index % 5}`} data-reveal onClick={() => track('behance_project_open', { project: project.title })}><div className="behance-art"><div className="behance-fallback" aria-hidden="true"><span>SEE7VEN / BEHANCE</span><b>{project.title}</b></div><SmartImage src={project.cover} alt={`Capa de ${project.title}`} loading="lazy"/><span className="behance-index">{String(index + 1).padStart(2, '0')}</span></div><div className="behance-meta"><div><strong>{project.title}</strong><span>{project.client}</span></div><div>{(project.tools || []).slice(0, 3).map(tool => <small key={tool}>{tool}</small>)}</div><i>{externalArrow}</i></div></a>)}</div>
      {validProjects.length > limit && <button className="behance-expand" onClick={() => setExpanded(value => !value)}>{expanded ? 'MOSTRAR MENOS ↑' : `VER MAIS PROJETOS / ${validProjects.length} ↓`}</button>}
      <a className="behance-profile-link" href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">VER PERFIL COMPLETO NO BEHANCE {externalArrow}</a>
    </section>
  )
}

function DecisionSection({ onBrief }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="decision-section section-shell" data-phase="dark">
      <div className="decision-value"><div className="section-index" data-reveal>11 / WHY SEE7VEN</div><h2 data-reveal>O QUE VOCÊ ESTÁ<br/><span>CONTRATANDO DE VERDADE.</span></h2><div className="value-grid"><article data-reveal><span>01</span><strong>Clareza antes de produção.</strong><p>Entender o problema evita investir energia na peça errada.</p></article><article data-reveal><span>02</span><strong>Uma linguagem que pertence à marca.</strong><p>Direção visual não deveria parecer o mesmo template trocando a logo.</p></article><article data-reveal><span>03</span><strong>Execução conectada.</strong><p>Social, site, vídeo e físico passam a trabalhar como partes do mesmo sistema.</p></article><article data-reveal><span>04</span><strong>Capacidade de evoluir.</strong><p>Identidade, conteúdo, site e materiais podem evoluir por etapas sem perder coerência.</p></article></div></div>
      <div className="faq"><span>ANTES DE CHAMAR / FAQ</span>{faqItems.map(([question, answer], index) => <article key={question} className={open === index ? 'active' : ''}><button onClick={() => setOpen(open === index ? -1 : index)}><strong>{question}</strong><i>{open === index ? '−' : '+'}</i></button><p>{answer}</p></article>)}<button className="faq-cta" onClick={() => onBrief()}>Ainda ficou uma dúvida? Comece pelo brief →</button></div>
    </section>
  )
}

function People() {
  return (
    <section className="people-section section-shell" data-phase="dark">
      <div><div className="section-index" data-reveal>12 / PEOPLE</div><h2 data-reveal>POR TRÁS DA SEE7VEN,<br/><span>TEM GENTE.</span></h2></div>
      <div className="people-cards"><article data-reveal><span>K / 01</span><div className="person-monogram">K</div><strong>KAREN</strong><p>Relacionamento, operação e projetos.</p></article><article data-reveal><span>G / 02</span><div className="person-monogram">G</div><strong>GUSTAVO</strong><p>Estratégia, direção e desenvolvimento.</p></article></div>
    </section>
  )
}

function LeadBrief({ open, onClose, whatsappNumber, initialProblem = '' }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({ problem: '', scope: '', timing: '' })
  const [company, setCompany] = useState('')
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  useBodyLock(open)
  useDialogFocus(open, { containerRef: dialogRef, initialRef: closeRef, onClose })
  const steps = [
    { key: 'problem', title: 'O que precisa mudar?', options: ['Quero vender mais', 'Minha marca parece pequena', 'Ninguém entende o que faço', 'Preciso chamar atenção', 'Quero lançar algo novo'] },
    { key: 'scope', title: 'Onde isso precisa acontecer?', options: ['Marca / identidade', 'Social / conteúdo', 'Site / landing page', 'Vídeo / motion', 'Campanha completa', 'Ainda não sei'] },
    { key: 'timing', title: 'Quando você quer começar?', options: ['Agora', 'Nas próximas semanas', 'Neste trimestre', 'Estou pesquisando'] }
  ]
  useEffect(() => {
    if (!open) return
    const preset = String(initialProblem || '').trim()
    setAnswers({ problem: preset, scope: '', timing: '' })
    setCompany('')
    setStep(preset ? 1 : 0)
  }, [open, initialProblem])

  if (!open) return null
  const current = steps[step]
  const choose = value => {
    const next = { ...answers, [current.key]: value }
    setAnswers(next)
    track('brief_answer', { step: current.key, value })
    setStep(step < steps.length - 1 ? step + 1 : steps.length)
  }
  const goBack = () => setStep(currentStep => Math.max(0, currentStep - 1))
  const companyLine = company.trim() ? `
Empresa / marca: ${company.trim()}` : ''
  const safePhone = String(whatsappNumber || '').replace(/\D/g, '')
  const message = encodeURIComponent(`Olá! Vim pelo site da Seeven e respondi ao brief rápido.${companyLine}

Problema: ${answers.problem}
Escopo: ${answers.scope}
Prazo: ${answers.timing}

Quero conversar sobre o projeto.`)
  return <div className="brief-backdrop" onMouseDown={onClose}><div ref={dialogRef} className="brief-modal" onMouseDown={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Brief rápido Seeven"><div className="brief-top"><span>SEE7VEN / 60 SECOND BRIEF</span><button ref={closeRef} onClick={onClose}>FECHAR ×</button></div><div className="brief-progress"><i style={{ width: `${Math.min((step + 1) / steps.length, 1) * 100}%` }}/></div>{step < steps.length ? <div className="brief-step"><span>0{step + 1} / 0{steps.length}</span><h3>{current.title}</h3><div>{current.options.map(option => <button key={option} onClick={() => choose(option)}>{option}<i>→</i></button>)}</div><div className="brief-secondary-actions">{step > 0 && <button className="brief-reset" onClick={goBack}>← Voltar uma pergunta</button>}{initialProblem && step > 0 && <button className="brief-reset" onClick={() => { setAnswers({ problem: '', scope: '', timing: '' }); setStep(0) }}>Trocar o problema escolhido</button>}</div></div> : <div className="brief-result"><span>BRIEF / PRONTO</span><h3>Já temos um ponto de partida.</h3><div><p><b>Problema</b>{answers.problem}</p><p><b>Escopo</b>{answers.scope}</p><p><b>Prazo</b>{answers.timing}</p></div><label className="brief-company"><span>EMPRESA / MARCA — OPCIONAL</span><input value={company} onChange={event => setCompany(event.target.value)} placeholder="Ex.: Minha Empresa"/></label>{safePhone ? <a href={`https://wa.me/${safePhone}?text=${message}`} target="_blank" rel="noreferrer" onClick={() => track('brief_completed', { ...answers, company })}>Enviar no WhatsApp {externalArrow}</a> : <button className="brief-contact-unavailable" type="button" disabled>WhatsApp ainda não configurado</button>}</div>}</div></div>
}

function Contact({ onBrief, karenWhatsapp, gustavoWhatsapp, hasKaren, hasGustavo }) {
  return (
    <section id="contact" className="contact-section section-shell" data-phase="dark">
      <div className="section-index" data-reveal>13 / NEXT PROJECT</div>
      <h2 data-reveal>SEU PROJETO<br/><span>PODERIA ESTAR AQUI.</span></h2>
      <p data-reveal>Não precisa chegar com o briefing perfeito. Chegue com o problema. A gente começa daí.</p>
      <div className="contact-actions" data-reveal>
        <button onClick={() => onBrief()}><span>BRIEF / 60 SEGUNDOS</span><strong>Descobrir por onde começar →</strong></button>
        {hasKaren ? <a href={karenWhatsapp} target="_blank" rel="noreferrer"><span>KAREN / NOVOS PROJETOS</span><strong>WhatsApp {externalArrow}</strong></a> : <button className="contact-fallback" onClick={() => onBrief()}><span>NOVOS PROJETOS</span><strong>Contato via brief →</strong></button>}
        {hasGustavo ? <a href={gustavoWhatsapp} target="_blank" rel="noreferrer"><span>GUSTAVO / DIREÇÃO</span><strong>Conversar {externalArrow}</strong></a> : <a href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer"><span>REPERTÓRIO / SEE7VEN</span><strong>Behance {externalArrow}</strong></a>}
      </div>
      <div className="contact-next" data-reveal><span>O QUE ACONTECE DEPOIS</span><ol><li><b>01</b><p>Você conta o problema.</p></li><li><b>02</b><p>A gente organiza o que realmente precisa ser resolvido.</p></li><li><b>03</b><p>Você recebe um próximo passo claro, sem compromisso com pacote genérico.</p></li></ol></div>
      <div className="contact-word" aria-hidden="true">SEE7VEN</div>
    </section>
  )
}

function MobileActionBar({ onBrief, visible }) {
  return <div className={`mobile-action-bar ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}><a href="#work" tabIndex={visible ? 0 : -1}><span>01</span><b>VER TRABALHOS</b></a><button tabIndex={visible ? 0 : -1} onClick={() => onBrief()}><span>02</span><b>FALAR SOBRE PROJETO</b></button></div>
}

function Footer() {
  return <footer className="site-footer"><div><span className="brand-mark">7</span><b>SEE7VEN</b></div><span>© {new Date().getFullYear()} — PRESENCE, FROM PIXEL TO PAPER.</span><div><a href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">BEHANCE {externalArrow}</a><a href="#top">TOPO ↑</a></div></footer>
}

function PublicApp() {
  const cms = useCmsContent()
  const { menuOpen, setMenuOpen, paletteOpen, setPaletteOpen } = useExperience()
  const [briefOpen, setBriefOpen] = useState(false)
  const [briefPreset, setBriefPreset] = useState('')
  const [mobileDock, setMobileDock] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const pitch = (params.get('for') || '').toLowerCase()
  const prospect = (params.get('prospect') || '').trim().slice(0, 80)
  const karenNumber = String(import.meta.env.VITE_KAREN_WHATSAPP || '').replace(/\D/g, '')
  const gustavoNumber = String(import.meta.env.VITE_GUSTAVO_WHATSAPP || '').replace(/\D/g, '')
  const defaultMessage = encodeURIComponent('Olá! Conheci a Seeven e quero conversar sobre um projeto.')
  const karenWhatsapp = karenNumber ? `https://wa.me/${karenNumber}?text=${defaultMessage}` : '#contact'
  const gustavoWhatsapp = gustavoNumber ? `https://wa.me/${gustavoNumber}?text=${defaultMessage}` : karenWhatsapp

  const pitchProjects = useMemo(() => {
    const preferred = pitchPresets[pitch]
    if (!preferred?.length) return cms.projects
    const rank = new Map(preferred.map((id, index) => [id, index]))
    return [...cms.projects].sort((a, b) => (rank.has(a.id) ? rank.get(a.id) : 99) - (rank.has(b.id) ? rank.get(b.id) : 99))
  }, [cms.projects, pitch])

  const openBrief = (problem = '') => { setBriefPreset(problem); track('brief_started', { preset: problem || undefined }); setBriefOpen(true) }

  useEffect(() => {
    const reached = new Set()
    const onScroll = () => {
      setMobileDock(window.scrollY > window.innerHeight * 0.58)
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const pct = Math.min(100, Math.round((window.scrollY / max) * 100))
      ;[25, 50, 75, 100].forEach(mark => {
        if (pct >= mark && !reached.has(mark)) {
          reached.add(mark)
          track('scroll_depth', { percent: mark })
        }
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = document.getElementById('contact')
    if (!target) return undefined
    const observer = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), { threshold: 0.12 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    track('page_view', { pitch: pitch || 'default', prospect: prospect || undefined, source: cms.source })
  }, [pitch, prospect, cms.source])

  return (
    <div className="app-shell">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} setPaletteOpen={setPaletteOpen} onBrief={openBrief}/>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} projects={pitchProjects} onBrief={openBrief}/>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} whatsappNumber={karenNumber} initialProblem={briefPreset}/>
      <MobileActionBar onBrief={openBrief} visible={mobileDock && !contactVisible && !briefOpen && !paletteOpen}/>
      <main>
        <Hero pitch={pitch} prospect={prospect} onBrief={openBrief}/>
        <ClientRail clientList={cms.clients}/>
        <ProofBar clientCount={cms.clients.length} reelCount={cms.reels.length}/>
        <Manifesto/>
        <Work projects={pitchProjects} clientList={cms.clients} onBrief={openBrief}/>
        <CaseSpotlight onBrief={openBrief}/>
        <MotionArchive items={cms.reels} clientList={cms.clients}/>
        <StrategyLens projects={pitchProjects}/>
        <PixelPaper/>
        <Ecosystem/>
        <Solutions items={cms.services} onBrief={openBrief}/>
        <CapabilityOS/>
        <BehanceWall projects={cms.behance}/>
        <DecisionSection onBrief={openBrief}/>
        <People/>
        <Contact onBrief={openBrief} karenWhatsapp={karenWhatsapp} gustavoWhatsapp={gustavoWhatsapp} hasKaren={Boolean(karenNumber)} hasGustavo={Boolean(gustavoNumber)}/>
      </main>
      <Footer/>
    </div>
  )
}

export default function App() {
  return <ErrorBoundary><PublicApp/></ErrorBoundary>
}
