import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  solutions,
  touchpoints,
  sindpetshopStats,
  sindpetshopScale,
  knowledgeGroups,
  pitchPresets,
  caseStudies,
  portfolioFilterOptions,
  pitchCopy,
  projectIntelligence,
  strategyStages
} from './data'
import { useCmsContent } from './useCmsContent'

const externalArrow = '↗'
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

function preferredScrollBehavior() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
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
    ['Como fazemos', '#presence-engine'],
    ['Vídeo', '#motion'],
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
    ['03', 'Presence Engine', '#presence-engine', 'estratégia branding conteúdo web físico capacidade'],
    ['04', 'Motion archive', '#motion', 'reels vídeo motion audiovisual'],
    ['05', 'Arquivo Behance', '#behance', 'behance projetos arquivo visual'],
    ['06', 'Por que Seeven', '#why-seeven', 'clareza direção sistema capacidade'],
    ['07', 'Contato / brief rápido', '#contact', 'whatsapp orçamento projeto contato'],
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


function StoryIntro({ pitch, prospect, onBrief, clientList = [], projects = [] }) {
  const sectionRef = useRef(null)
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const context = pitchCopy[pitch]

  const frames = [
    {
      eyebrow: context?.kicker || 'SEE7VEN / SÃO PAULO / PRESENÇA DE MARCA',
      title: `FAZEMOS\nMARCAS\nPARAREM.`,
      body: prospect
        ? `Uma ideia para ${prospect}: role para ver como atenção vira presença, ponto por ponto.`
        : context?.line
          ? `${context.line} Role para ver como essa lógica vira presença.`
          : 'Role. Em poucos minutos você entende o que fazemos, como pensamos e por que isso pode mudar a percepção de uma marca.',
      accent: 'ROLE PARA COMEÇAR'
    },
    {
      eyebrow: '01 / ATENÇÃO',
      title: `PARAR É SÓ\nO PRIMEIRO\nSEGUNDO.`,
      body: 'Depois a marca precisa ser entendida, lembrada e escolhida. É aí que estética deixa de ser decoração e vira direção.',
      accent: 'ENTENDER → LEMBRAR → ESCOLHER'
    },
    {
      eyebrow: '02 / PRESENÇA',
      title: `UMA MARCA\nNÃO VIVE\nEM UM POST.`,
      body: 'Ela continua no site, no vídeo, no Google, no WhatsApp, no evento, na embalagem e na experiência com o cliente.',
      accent: 'UMA MARCA / VÁRIOS PONTOS'
    },
    {
      eyebrow: '03 / SISTEMA',
      title: `NÃO SOMAMOS\nPEÇAS.\nCONECTAMOS.`,
      body: 'Estratégia, branding, conteúdo, motion, web e físico trabalhando como partes de uma mesma presença.',
      accent: 'DO PIXEL AO PAPEL'
    },
    {
      eyebrow: '04 / PROVA',
      title: `AGORA,\nOLHE O\nTRABALHO.`,
      body: 'Menos promessa. Mais repertório, decisões, execução e contexto real de projeto.',
      accent: 'A PROVA COMEÇA ABAIXO'
    }
  ]

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const node = sectionRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const total = Math.max(node.offsetHeight - window.innerHeight, 1)
        const passed = Math.min(total, Math.max(0, -rect.top))
        const nextProgress = passed / total
        const nextActive = Math.min(frames.length - 1, Math.floor(nextProgress * frames.length))
        node.style.setProperty('--story-progress', `${nextProgress * 100}%`)
        setActive(current => current === nextActive ? current : nextActive)
        const phase = 'light'
        node.dataset.phase = phase
        if (rect.top <= 48 && rect.bottom > 48) document.documentElement.dataset.phase = phase
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(rafRef.current)
    }
  }, [frames.length])

  const clientNames = clientList.filter(Boolean).slice(0, 8).map(item => item.name)
  const clientMap = useMemo(() => new Map(clientList.map(item => [item.id, item])), [clientList])
  const proofProjects = useMemo(() => (projects || []).slice(0, 4).map(project => ({
    ...project,
    brandPoster: project.poster || project.cover || clientMap.get(project.clientId)?.brandPoster || ''
  })), [projects, clientMap])
  useEffect(() => { track('story_step', { step: active + 1, label: frames[active]?.accent }) }, [active])

  const scrollToStoryStep = index => {
    const node = sectionRef.current
    if (!node) return
    const total = Math.max(node.offsetHeight - window.innerHeight, 1)
    const clamped = Math.max(0, Math.min(frames.length - 1, index))
    window.scrollTo({ top: node.offsetTop + total * ((clamped + .04) / frames.length), behavior: preferredScrollBehavior() })
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      className={`story-intro story-step-${active}`}
      data-phase="light"
      style={{ '--story-step': active }}
    >
      <div className="story-sticky">
        <div className="story-grid" aria-hidden="true"/>
        <div className="story-chrome">
          <span>SEE7VEN / PRESENCE SYSTEM</span>
          <div><span>{String(active + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}</span><a href="#work" onClick={() => track('story_skip')}>PULAR INTRO →</a></div>
        </div>

        <div className="story-frames" aria-live="polite">
          {frames.map((frame, index) => (
            <article key={frame.title} className={`story-frame ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index} inert={active !== index}>
              <span className="story-eyebrow">{frame.eyebrow}</span>
              <h1>{frame.title.split('\n').map((line, lineIndex) => <React.Fragment key={`${line}-${lineIndex}`}>{line}{lineIndex < frame.title.split('\n').length - 1 && <br/>}</React.Fragment>)}</h1>
              <p>{frame.body}</p>
              <strong>{frame.accent}</strong>
              {index === frames.length - 1 && (
                <div className="story-actions">
                  <a href="#work" tabIndex={active === index ? 0 : -1}>VER TRABALHOS ↓</a>
                  <button tabIndex={active === index ? 0 : -1} onClick={() => onBrief()}>TENHO UM PROJETO {externalArrow}</button>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="story-visual" aria-hidden="true">
          <div className="story-seven">7</div>
          <div className="story-rings"><i/><i/><i/></div>

          <div className={`story-words ${active === 1 ? 'is-active' : ''}`}>
            {['PERCEBER','ENTENDER','LEMBRAR','ESCOLHER'].map((word, index) => <span key={word} style={{ '--i': index }}>{word}</span>)}
          </div>

          <div className={`story-touchpoints ${active === 2 ? 'is-active' : ''}`}>
            {touchpoints.slice(0, 8).map((point, index) => <span key={point} style={{ '--i': index }}>{point}</span>)}
          </div>

          <div className={`story-system ${active === 3 ? 'is-active' : ''}`}>
            {['ESTRATÉGIA','BRANDING','CONTEÚDO','MOTION','WEB','FÍSICO'].map((item, index) => <span key={item} style={{ '--i': index }}>{item}</span>)}
          </div>

          <div className={`story-clients story-proof ${active === 4 ? 'is-active' : ''}`}>
            <small>REPERTÓRIO / {clientList.length || 11} MARCAS</small>
            {proofProjects.length ? <div className="story-proof-grid">{proofProjects.map((project, index) => <span className="story-proof-card" key={project.id || `${project.client}-${index}`}>
              <SmartImage src={project.brandPoster} alt="" loading="eager"/>
              <i>{String(index + 1).padStart(2, '0')}</i>
              <b>{project.client}</b>
              <em>{(project.tags || []).slice(0, 2).join(' / ') || project.label}</em>
            </span>)}</div> : <div>{clientNames.map(name => <span key={name}>{name}</span>)}</div>}
          </div>
        </div>

        <div className="story-scroll">
          <span>{active === frames.length - 1 ? 'CONTINUE' : isMobile ? 'PUXE PARA DESCOBRIR' : 'ROLE PARA DESCOBRIR'}</span>
          <i><b/></i>
        </div>
        <div className="story-stepper" aria-label="Navegar pela introdução">{frames.map((frame, index) => <button key={frame.eyebrow} className={active === index ? 'active' : ''} onClick={() => { scrollToStoryStep(index); track('story_seek', { step: index + 1 }) }} aria-label={`Ir para etapa ${index + 1}: ${frame.eyebrow.replace(/^\d+ \/ /, '')}`} aria-current={active === index ? 'step' : undefined}><i/><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>
        <div className="story-progress"><i/></div>
      </div>
    </section>
  )
}


const journeyChapters = [
  ['top', 'COMEÇO'],
  ['work', 'TRABALHOS'],
  ['case-sindpetshop', 'CASE'],
  ['presence-engine', 'SISTEMA'],
  ['motion', 'VÍDEO'],
  ['behance', 'ARQUIVO'],
  ['why-seeven', 'DECISÃO'],
  ['contact', 'CONTATO']
]

function JourneyRail() {
  const [activeId, setActiveId] = useState('top')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const center = window.innerHeight * .48
        let best = journeyChapters[0][0]
        let distance = Number.POSITIVE_INFINITY
        journeyChapters.forEach(([id]) => {
          const node = document.getElementById(id)
          if (!node) return
          const rect = node.getBoundingClientRect()
          const within = rect.top <= center && rect.bottom >= center
          const nextDistance = within ? 0 : Math.min(Math.abs(rect.top - center), Math.abs(rect.bottom - center))
          if (nextDistance < distance) {
            best = id
            distance = nextDistance
          }
        })
        setActiveId(current => current === best ? current : best)
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        setProgress(Math.min(100, Math.max(0, (window.scrollY / max) * 100)))
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  const activeIndex = Math.max(0, journeyChapters.findIndex(([id]) => id === activeId))
  useEffect(() => { track('journey_chapter', { chapter: activeId, index: activeIndex + 1 }) }, [activeId, activeIndex])
  return (
    <nav className={`journey-rail ${activeId === 'contact' ? 'is-contact' : ''} ${activeId === 'top' ? 'is-intro' : ''}`} aria-label="Capítulos da experiência">
      <div className="journey-rail-mobile"><span>{String(activeIndex + 1).padStart(2, '0')} / {String(journeyChapters.length).padStart(2, '0')}</span><b>{journeyChapters[activeIndex]?.[1]}</b><i><em style={{ width: `${progress}%` }}/></i></div>
      <div className="journey-rail-desktop">
        <span className="journey-rail-title">SEE7VEN / JOURNEY</span>
        {journeyChapters.map(([id, label], index) => <a key={id} href={`#${id}`} className={activeId === id ? 'active' : ''} aria-current={activeId === id ? 'step' : undefined}><i/><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b></a>)}
      </div>
    </nav>
  )
}

function PresenceEngine({ onBrief, items }) {
  const sectionRef = useRef(null)
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)
  const [problemIndex, setProblemIndex] = useState(0)
  const problems = (items?.length ? items : solutions).slice(0, 5)
  const selectedProblem = problems[problemIndex] || problems[0]
  useEffect(() => { if (problemIndex >= problems.length) setProblemIndex(0) }, [problemIndex, problems.length])
  const steps = [
    {
      index: '01',
      label: 'PROBLEMA',
      title: 'VOCÊ NÃO PRECISA\nSABER O NOME\nDO SERVIÇO.',
      copy: 'Chegue com o problema. A gente organiza o que precisa mudar antes de escolher formato, canal ou ferramenta.'
    },
    {
      index: '02',
      label: 'DECISÃO',
      title: 'ANTES DA\nESTÉTICA, EXISTE\nUMA ESCOLHA.',
      copy: 'Contexto, público e objetivo vêm antes da peça. O design é consequência de uma direção — não o ponto de partida.'
    },
    {
      index: '03',
      label: 'PRESENÇA',
      title: 'UMA MARCA\nNÃO VIVE EM\nUM CANAL.',
      copy: 'Social, site, vídeo, busca, WhatsApp, evento e impresso precisam reconhecer a mesma marca sem parecer cópia.'
    },
    {
      index: '04',
      label: 'PIXEL → PAPEL',
      title: 'A TELA TERMINA.\nA MARCA\nNÃO.',
      copy: 'Uma direção forte continua funcionando quando vira interface, embalagem, crachá, folder, uniforme ou material de evento.'
    },
    {
      index: '05',
      label: 'CAPACIDADE',
      title: 'FERRAMENTAS\nMUDAM. CAPACIDADE\nFICA.',
      copy: 'Design, motion, 3D, desenvolvimento e IA entram quando ajudam a resolver melhor — não para enfeitar o processo.'
    }
  ]

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const node = sectionRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const total = Math.max(node.offsetHeight - window.innerHeight, 1)
        const passed = Math.min(total, Math.max(0, -rect.top))
        const nextProgress = passed / total
        const nextActive = Math.min(steps.length - 1, Math.floor(nextProgress * steps.length))
        node.style.setProperty('--engine-progress', `${nextProgress * 100}%`)
        setActive(current => current === nextActive ? current : nextActive)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(rafRef.current)
    }
  }, [steps.length])

  useEffect(() => { track('presence_engine_step', { step: active + 1, label: steps[active]?.label }) }, [active])

  const scrollToStep = index => {
    const node = sectionRef.current
    if (!node) return
    const total = Math.max(node.offsetHeight - window.innerHeight, 1)
    window.scrollTo({ top: node.offsetTop + total * ((index + .04) / steps.length), behavior: preferredScrollBehavior() })
  }

  return (
    <section id="presence-engine" ref={sectionRef} className={`presence-engine engine-step-${active}`} data-phase="dark">
      <div className="presence-engine-sticky">
        <div className="presence-engine-grid" aria-hidden="true"/>
        <div className="presence-engine-top"><span>04 / PRESENCE ENGINE</span><b>{steps[active].index} / {steps[active].label}</b></div>
        <div className="presence-engine-copy">
          <span>{steps[active].index} / {steps[active].label}</span>
          <h2>{steps[active].title.split('\n').map((line, index) => <React.Fragment key={`${line}-${index}`}>{line}{index < steps[active].title.split('\n').length - 1 && <br/>}</React.Fragment>)}</h2>
          <p>{steps[active].copy}</p>
          <div className="presence-engine-tabs" aria-label="Etapas do Presence Engine">{steps.map((step, index) => <button key={step.index} className={active === index ? 'active' : ''} onClick={() => scrollToStep(index)} aria-label={`${step.index} ${step.label}`}><span>{step.index}</span><b>{step.label}</b></button>)}</div>
        </div>

        <div className="presence-engine-visual" aria-live="polite">
          <div className={`engine-panel engine-problems ${active === 0 ? 'is-active' : ''}`} aria-hidden={active !== 0} inert={active !== 0}>
            <span>COMECE PELO QUE DÓI</span>
            <div className="engine-problem-list">{problems.map((item, index) => <button key={item.problem} className={problemIndex === index ? 'active' : ''} onClick={() => setProblemIndex(index)}><small>{String(index + 1).padStart(2, '0')}</small><b>{item.problem}</b></button>)}</div>
            {selectedProblem && <article><p>{selectedProblem.answer}</p><div>{(selectedProblem.stack || []).slice(0, 4).map(item => <span key={item}>{item}</span>)}</div><button onClick={() => onBrief(selectedProblem.problem)}>QUERO RESOLVER ISSO →</button></article>}
          </div>

          <div className={`engine-panel engine-decision ${active === 1 ? 'is-active' : ''}`} aria-hidden={active !== 1} inert={active !== 1}>
            <span>DECISION SYSTEM</span>
            <div>{strategyStages.slice(0, 6).map((item, index) => <article key={item.id}><small>{item.index || String(index + 1).padStart(2, '0')}</small><b>{item.label}</b><i/></article>)}</div>
            <strong>PROBLEMA → CONTEXTO → INSIGHT → DIREÇÃO → EXECUÇÃO → RESULTADO</strong>
          </div>

          <div className={`engine-panel engine-touchpoints ${active === 2 ? 'is-active' : ''}`} aria-hidden={active !== 2} inert={active !== 2}>
            <div className="engine-core"><small>SEE7VEN</small><b>MARCA</b></div>
            {touchpoints.slice(0, 10).map((point, index) => <span key={point} style={{ '--angle': `${index * (360 / Math.min(10, touchpoints.length))}deg` }}>{point}</span>)}
          </div>

          <div className={`engine-panel engine-pixel ${active === 3 ? 'is-active' : ''}`} aria-hidden={active !== 3} inert={active !== 3}>
            <div className="engine-screen"><span>DIGITAL</span><b>7</b><small>INTERFACE / SOCIAL / VIDEO</small></div>
            <div className="engine-paper engine-paper-a"><span>FOLDER</span><b>SEE7VEN</b></div>
            <div className="engine-paper engine-paper-b"><span>CRACHÁ</span><b>7</b></div>
            <div className="engine-paper engine-paper-c"><span>PACKAGING</span><b>BRAND SYSTEM</b></div>
            <i>PIXEL</i><i>PAPEL</i>
          </div>

          <div className={`engine-panel engine-capability ${active === 4 ? 'is-active' : ''}`} aria-hidden={active !== 4} inert={active !== 4}>
            <span>CAPABILITY STACK</span>
            <div>{knowledgeGroups.map(group => <article key={group.id}><i style={{ background: group.accent }}/><b>{group.label}</b><small>{group.tools.slice(0, 4).map(tool => tool.short).join(' / ')}</small></article>)}</div>
            <button onClick={() => onBrief()}>TENHO UM PROJETO →</button>
          </div>
        </div>
        <div className="presence-engine-hint"><span>{active === steps.length - 1 ? 'CONTINUE PARA VER O TRABALHO EM MOVIMENTO' : 'CONTINUE ROLANDO'}</span><i><b/></i></div>
        <div className="presence-engine-progress"><i/></div>
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
  const [showAll, setShowAll] = useState(false)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const filter = portfolioFilterOptions.find(item => item.id === filterId) || portfolioFilterOptions[0]
  const matched = projects.filter(project => projectMatches(project, filter))
  const compactLimit = isMobile ? 5 : 8
  const visible = filterId === 'all' && !showAll ? matched.slice(0, compactLimit) : matched
  const activeIndex = projects.findIndex(project => project.id === activeCaseId)
  const activeProject = activeIndex >= 0 ? projects[activeIndex] : null

  useEffect(() => {
    const onPop = () => setActiveCaseId(caseIdFromLocation())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  useEffect(() => { setShowAll(false) }, [filterId])
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
        <h2 data-reveal>NÃO REPETIMOS<br/><span>A MESMA FÓRMULA.</span></h2>
        <p data-reveal>Cada marca pede uma linguagem. Explore por disciplina e abra um case para entender o raciocínio por trás do visual.</p>
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
      {matched.length > visible.length && <button className="work-expand" onClick={() => setShowAll(true)}>VER MAIS {matched.length - visible.length} PROJETOS ↓</button>}
      {!matched.length && <div className="empty-state"><b>Nenhum projeto publicado nesta categoria.</b><span>Novos trabalhos entram aqui conforme o portfólio cresce.</span></div>}
      <CaseDrawer project={activeProject} clientList={clientList} onClose={closeCase} onNext={() => navigate(1)} onPrevious={() => navigate(-1)} onBrief={onBrief}/>
    </section>
  )
}

function CaseSpotlight({ onBrief }) {
  const study = caseStudies['sindpetshop-ecosystem']
  const sectionRef = useRef(null)
  const rafRef = useRef(0)
  const [active, setActive] = useState(0)

  const steps = [
    {
      index: '01',
      label: 'O DESAFIO',
      title: 'MUITA INFORMAÇÃO.\nPOUCO ESPAÇO PARA CONFUSÃO.',
      copy: study?.challenge || 'O desafio era organizar informação complexa sem transformar a comunicação em burocracia.'
    },
    {
      index: '02',
      label: 'A DECISÃO',
      title: 'PARAR DE PENSAR\nEM PEÇAS ISOLADAS.',
      copy: study?.strategy || 'A solução passou a tratar cada canal como parte de um mesmo sistema de comunicação.'
    },
    {
      index: '03',
      label: 'O SISTEMA',
      title: 'UMA MARCA.\nMUITOS PONTOS DE CONTATO.',
      copy: study?.result || 'Site, social, vídeo, campanhas, landing pages e físico passam a reforçar a mesma presença.'
    },
    {
      index: '04',
      label: 'O RESULTADO',
      title: 'CLAREZA TAMBÉM\nPRECISA APARECER NOS NÚMEROS.',
      copy: 'Resultado entra como evidência, com período e contexto separados da dimensão institucional do cliente.'
    }
  ]

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const node = sectionRef.current
        if (!node) return
        const rect = node.getBoundingClientRect()
        const total = Math.max(node.offsetHeight - window.innerHeight, 1)
        const passed = Math.min(total, Math.max(0, -rect.top))
        const nextProgress = passed / total
        const nextActive = Math.min(steps.length - 1, Math.floor(nextProgress * steps.length))
        node.style.setProperty('--case-scroll-progress', `${nextProgress * 100}%`)
        setActive(current => current === nextActive ? current : nextActive)
      })
    }
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      cancelAnimationFrame(rafRef.current)
    }
  }, [steps.length])

  return (
    <section
      id="case-sindpetshop"
      ref={sectionRef}
      className={`case-scroll case-scroll-step-${active}`}
      data-phase="dark"

    >
      <div className="case-scroll-sticky">
        <div className="case-scroll-grid" aria-hidden="true"/>
        <div className="case-scroll-kicker"><span>03 / FLAGSHIP CASE</span><b>SINDPETSHOP-SP / PRESENCE SYSTEM</b></div>

        <div className="case-scroll-copy">
          <span className="case-scroll-overline">{steps[active].index} / {steps[active].label}</span>
          <h2>{steps[active].title.split('\n').map((line, index) => <React.Fragment key={`${line}-${index}`}>{line}{index === 0 && <br/>}</React.Fragment>)}</h2>
          <p>{steps[active].copy}</p>
          <div className="case-scroll-tabs" aria-label="Etapas do case">
            {steps.map((step, index) => <button key={step.index} className={active === index ? 'active' : ''} onClick={() => {
              const node = sectionRef.current
              if (!node) return
              const total = Math.max(node.offsetHeight - window.innerHeight, 1)
              window.scrollTo({ top: node.offsetTop + total * ((index + .05) / steps.length), behavior: preferredScrollBehavior() })
            }}><span>{step.index}</span><b>{step.label.replace('O ', '').replace('A ', '')}</b></button>)}
          </div>
        </div>

        <div className="case-scroll-visual">
          <div className={`case-panel case-panel-problem ${active === 0 ? 'is-active' : ''}`} aria-hidden={active !== 0} inert={active !== 0}>
            <div className="system-screen"><span>SINDPETSHOP.ORG.BR</span><strong>INFORMAÇÃO<br/>PRECISA VIRAR<br/>CLAREZA.</strong><small>ECOSSISTEMA DIGITAL / SEE7VEN</small></div>
            <div className="case-scale-mini">{sindpetshopScale.slice(0, 3).map(item => <span key={item.label}><b>{item.value}</b><small>{item.label}</small></span>)}</div>
          </div>

          <div className={`case-panel case-panel-decision ${active === 1 ? 'is-active' : ''}`} aria-hidden={active !== 1} inert={active !== 1}>
            <span>DE PEÇA → PARA SISTEMA</span>
            <div>{['ESTRATÉGIA','IDENTIDADE','CONTEÚDO','SITE','LANDING','VÍDEO','IMPRESSO'].map((item, index) => <b key={item} style={{ '--i': index }}>{item}</b>)}</div>
          </div>

          <div className={`case-panel case-panel-system ${active === 2 ? 'is-active' : ''}`} aria-hidden={active !== 2} inert={active !== 2}>
            <span>UM SISTEMA / VÁRIOS CANAIS</span>
            <div className="case-system-core"><small>SEE7VEN</small><strong>PRESENÇA</strong></div>
            {['SOCIAL','SITE','VÍDEO','CAMPANHA','LP','IMPRESSO'].map((item, index) => <b key={item} style={{ '--i': index }}>{item}</b>)}
          </div>

          <div className={`case-panel case-panel-results ${active === 3 ? 'is-active' : ''}`} aria-hidden={active !== 3} inert={active !== 3}>
            <span>RECORTE / AGOSTO 2026</span>
            <div>{sindpetshopStats.map(item => <article key={item.label}><strong>{item.value}</strong><b>{item.label}</b><small>{item.delta}</small></article>)}</div>
            <button type="button" onClick={() => onBrief('Preciso organizar vários pontos de contato da minha marca')}>QUERO ORGANIZAR MINHA MARCA →</button>
            <a href="https://sindpetshop.org.br/" target="_blank" rel="noreferrer">VER ECOSSISTEMA AO VIVO {externalArrow}</a>
          </div>
        </div>

        <div className="case-scroll-progress"><i/></div>
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
  const collapsedLimit = isMobile ? 4 : 8
  const display = archive.slice(0, expanded ? archive.length : collapsedLimit)
  const connectedLabel = playable.length ? `${playable.length} de ${totalReels} vídeos conectados para assistir agora` : 'As marcas já estão organizadas; os vídeos entram conforme os links reais são conectados.'

  return (
    <section id="motion" className="motion-section section-shell" data-phase="dark">
      <div className="motion-heading"><div className="section-index" data-reveal>05 / MOTION ARCHIVE</div><h2 data-reveal>ATENÇÃO<br/><span>TAMBÉM TEM RITMO.</span></h2><div data-reveal><p>{totalReels} peças organizadas, {new Set(items.map(item => item.clientId)).size} linguagens. O objetivo não é repetir formato: é encontrar o ritmo que pertence a cada marca.</p><span>{connectedLabel}</span></div></div>
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

function BehanceWall({ projects }) {
  const [expanded, setExpanded] = useState(false)
  const isMobile = useMediaQuery('(max-width: 760px)')
  const validProjects = useMemo(() => (projects || []).filter(project => safeHttpUrl(project.url)), [projects])
  const limit = isMobile ? 4 : 8
  const visible = validProjects.slice(0, expanded ? validProjects.length : limit)
  return (
    <section id="behance" className="behance-section section-shell" data-phase="dark">
      <div className="behance-heading"><div className="section-index" data-reveal>06 / VISUAL ARCHIVE</div><h2 data-reveal>O PORTFÓLIO<br/><span>CONTINUA CRESCENDO.</span></h2><p data-reveal>Campanhas, identidades, 3D, interfaces e experimentos publicados pela própria Seeven. O arquivo é o rastro do que estamos produzindo.</p></div>
      <div className="behance-grid">{visible.map((project, index) => <a key={project.id || project.url} href={safeHttpUrl(project.url)} target="_blank" rel="noreferrer" className={`behance-card behance-${index % 5}`} data-reveal onClick={() => track('behance_project_open', { project: project.title })}><div className="behance-art"><div className="behance-fallback" aria-hidden="true"><span>SEE7VEN / BEHANCE</span><b>{project.title}</b></div><SmartImage src={project.cover} alt={`Capa de ${project.title}`} loading="lazy"/><span className="behance-index">{String(index + 1).padStart(2, '0')}</span></div><div className="behance-meta"><div><strong>{project.title}</strong><span>{project.client}</span></div><div>{(project.tools || []).slice(0, 3).map(tool => <small key={tool}>{tool}</small>)}</div><i>{externalArrow}</i></div></a>)}</div>
      {validProjects.length > limit && <button className="behance-expand" onClick={() => setExpanded(value => !value)}>{expanded ? 'MOSTRAR MENOS ↑' : `VER MAIS PROJETOS / ${validProjects.length} ↓`}</button>}
      <a className="behance-profile-link" href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">VER PERFIL COMPLETO NO BEHANCE {externalArrow}</a>
    </section>
  )
}

function DecisionSection({ onBrief }) {
  const [open, setOpen] = useState(0)
  return (
    <section id="why-seeven" className="decision-section section-shell" data-phase="dark">
      <div className="decision-value"><div className="section-index" data-reveal>07 / WHY SEE7VEN</div><h2 data-reveal>O QUE VOCÊ ESTÁ<br/><span>CONTRATANDO DE VERDADE.</span></h2><div className="value-grid"><article data-reveal><span>01</span><strong>Clareza antes de produção.</strong><p>Entender o problema evita investir energia na peça errada.</p></article><article data-reveal><span>02</span><strong>Uma linguagem que pertence à marca.</strong><p>Direção visual não deveria parecer o mesmo template trocando a logo.</p></article><article data-reveal><span>03</span><strong>Execução conectada.</strong><p>Social, site, vídeo e físico passam a trabalhar como partes do mesmo sistema.</p></article><article data-reveal><span>04</span><strong>Capacidade de evoluir.</strong><p>Identidade, conteúdo, site e materiais podem evoluir por etapas sem perder coerência.</p></article></div></div>
      <div className="faq"><span>ANTES DE CHAMAR / FAQ</span>{faqItems.map(([question, answer], index) => <article key={question} className={open === index ? 'active' : ''}><button onClick={() => setOpen(open === index ? -1 : index)}><strong>{question}</strong><i>{open === index ? '−' : '+'}</i></button><p>{answer}</p></article>)}<button className="faq-cta" onClick={() => onBrief()}>Ainda ficou uma dúvida? Comece pelo brief →</button></div>
    </section>
  )
}

function People() {
  return (
    <section className="people-section section-shell" data-phase="dark">
      <div><div className="section-index" data-reveal>08 / PEOPLE</div><h2 data-reveal>POR TRÁS DA SEE7VEN,<br/><span>TEM GENTE.</span></h2></div>
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
      <div className="section-index" data-reveal>09 / NEXT PROJECT</div>
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
      const workStart = document.getElementById('work')?.offsetTop || window.innerHeight * 3
      setMobileDock(window.scrollY > Math.max(window.innerHeight * 0.9, workStart - window.innerHeight * 0.35))
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
      <JourneyRail/>
      <main>
        <StoryIntro pitch={pitch} prospect={prospect} onBrief={openBrief} clientList={cms.clients} projects={pitchProjects}/>
        <Work projects={pitchProjects} clientList={cms.clients} onBrief={openBrief}/>
        <CaseSpotlight onBrief={openBrief}/>
        <PresenceEngine onBrief={openBrief} items={cms.services}/>
        <MotionArchive items={cms.reels} clientList={cms.clients}/>
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
