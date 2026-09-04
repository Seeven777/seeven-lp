import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  behanceProjects,
  clients,
  featuredProjects,
  process,
  reels,
  sindpetshopScale,
  sindpetshopStats,
  solutions,
  touchpoints,
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
const downArrow = '↓'

const toolEvidenceLinks = {
  'Adobe Photoshop': { label: 'VER EVIDÊNCIA / BEHANCE', url: 'https://www.behance.net/gallery/246850317/Sindpetshop-SP' },
  'Photoshop': { label: 'VER EVIDÊNCIA / 3D CASE', url: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D' },
  'Adobe Illustrator': { label: 'VER EVIDÊNCIA / BEHANCE', url: 'https://www.behance.net/gallery/246850317/Sindpetshop-SP' },
  'Adobe Premiere Pro': { label: 'VER EVIDÊNCIA / 3D CASE', url: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D' },
  'Adobe After Effects': { label: 'VER EVIDÊNCIA / BEHANCE', url: 'https://www.behance.net/gallery/246850317/Sindpetshop-SP' },
  'After Effects': { label: 'VER EVIDÊNCIA / 3D CASE', url: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D' },
  'Blender': { label: 'VER EVIDÊNCIA / 3D CASE', url: 'https://www.behance.net/gallery/252638325/Treino-demonstrativo-de-modelagem-3D' }
}

function track(event, detail = {}) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...detail })
    window.dispatchEvent(new CustomEvent('seeven:analytics', { detail: { event, ...detail } }))
  } catch (_) {}
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [locked])
}

function useExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    let raf = 0
    const root = document.documentElement
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = matchMedia('(pointer:fine)').matches
    const coarsePointer = matchMedia('(pointer:coarse)').matches
    const lowMemory = Number(navigator.deviceMemory || 8) <= 4
    const lowCpu = Number(navigator.hardwareConcurrency || 8) <= 4
    root.dataset.motion = (reduced || coarsePointer || lowMemory || lowCpu) ? 'lite' : 'full'

    const updateScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1)
        const p = Math.min(1, Math.max(0, scrollY / max))
        root.style.setProperty('--scroll-progress', p.toFixed(4))
        root.style.setProperty('--scroll-pct', `${(p * 100).toFixed(2)}%`)

        // Stable light/dark header without mix-blend-mode. This also avoids
        // compositing glitches in very long screenshots and mobile browsers.
        const probeY = 42
        const phases = [...document.querySelectorAll('main > section')]
        const current = phases.find(section => {
          const rect = section.getBoundingClientRect()
          return rect.top <= probeY && rect.bottom > probeY
        })
        let darkPhase = current?.classList.contains('dark-phase') || current?.classList.contains('final-phase')
        if (current?.classList.contains('transition-phase')) {
          const rect = current.getBoundingClientRect()
          darkPhase = Math.max(0, -rect.top) > rect.height * .58
        }
        root.dataset.phase = darkPhase ? 'dark' : 'light'
      })
    }

    const updatePointer = (event) => {
      if (!finePointer || reduced) return
      root.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.style.setProperty('--pointer-y', `${event.clientY}px`)
    }

    const observed = new WeakSet()
    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          reveal.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' })

    const observeReveals = (scope = document) => {
      scope.querySelectorAll?.('[data-reveal]').forEach(el => {
        if (!observed.has(el)) {
          observed.add(el)
          reveal.observe(el)
        }
      })
    }
    observeReveals()

    const mutations = new MutationObserver(records => {
      records.forEach(record => record.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches?.('[data-reveal]') && !observed.has(node)) {
            observed.add(node); reveal.observe(node)
          }
          observeReveals(node)
        }
      }))
      updateScroll()
    })
    mutations.observe(document.getElementById('root') || document.body, { childList: true, subtree: true })

    addEventListener('scroll', updateScroll, { passive: true })
    if (finePointer) addEventListener('pointermove', updatePointer, { passive: true })
    updateScroll()

    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(v => !v)
      }
      if (event.key === 'Escape') {
        setPaletteOpen(false)
        setMenuOpen(false)
      }
    }
    addEventListener('keydown', onKey)

    return () => {
      reveal.disconnect()
      mutations.disconnect()
      removeEventListener('scroll', updateScroll)
      if (finePointer) removeEventListener('pointermove', updatePointer)
      removeEventListener('keydown', onKey)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { menuOpen, setMenuOpen, paletteOpen, setPaletteOpen }
}

function Header({ menuOpen, setMenuOpen, setPaletteOpen, whatsapp }) {
  return (
    <header className="site-header">
      <a className="brand-lockup" href="#top" aria-label="Seeven — início">
        <span className="brand-mark">7</span>
        <span className="brand-word">SEE<span>7</span>VEN</span>
      </a>

      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navegação principal">
        <a href="#work" onClick={() => setMenuOpen(false)}>Trabalhos</a>
        <a href="#strategy" onClick={() => setMenuOpen(false)}>Método</a>
        <a href="#case-sindpetshop" onClick={() => setMenuOpen(false)}>Case</a>
        <a href="#solutions" onClick={() => setMenuOpen(false)}>O que resolvemos</a>
        <a href="#toolchain" onClick={() => setMenuOpen(false)}>Ferramentas</a>
        <a href="#contact" onClick={() => setMenuOpen(false)}>Contato</a>
      </nav>

      <div className="header-actions">
        <button className="command-trigger" onClick={() => setPaletteOpen(true)} aria-label="Abrir navegação rápida">
          <span>Explorar</span><kbd>⌘ K</kbd>
        </button>
        <a className="header-cta" href={whatsapp} target="_blank" rel="noreferrer">Iniciar projeto {externalArrow}</a>
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-expanded={menuOpen} aria-label="Abrir menu">
          <span/><span/>
        </button>
      </div>
      <div className="header-progress" />
    </header>
  )
}

function CommandPalette({ open, onClose, whatsapp, projects = featuredProjects }) {
  const [query, setQuery] = useState('')
  useBodyLock(open)
  const projectItems = projects.map((project, index) => ({
    n: `P${String(index + 1).padStart(2,'0')}`,
    label: `${project.client} — ${project.title}`,
    href: `/work/${encodeURIComponent(project.id)}`,
    keywords: `${project.client} ${project.label} ${project.title} ${(project.tags || []).join(' ')}`,
    type: 'CASE'
  }))
  const toolItems = knowledgeGroups.flatMap(group => group.tools.map(tool => ({
    n: tool.short,
    label: tool.name,
    href: '#toolchain',
    keywords: `${group.label} ${tool.name} ${tool.use}`,
    type: 'TOOL'
  })))
  const items = [
    { n:'01', label:'Trabalhos selecionados', href:'#work', keywords:'portfolio branding social', type:'SECTION' },
    { n:'02', label:'Project Intelligence / Método', href:'#strategy', keywords:'estrategia research ux processo decisão insight contexto publico', type:'SECTION' },
    { n:'03', label:'Motion archive / Reels', href:'#reels', keywords:'video motion reels premiere after effects', type:'SECTION' },
    { n:'04', label:'Case Sindpetshop-SP', href:'#case-sindpetshop', keywords:'case estrategia site social performance', type:'SECTION' },
    { n:'05', label:'Do pixel ao papel', href:'#pixel-paper', keywords:'impresso fisico folder cracha material', type:'SECTION' },
    { n:'06', label:'Problemas que resolvemos', href:'#solutions', keywords:'servicos estrategia venda branding', type:'SECTION' },
    { n:'07', label:'Conhecimento & ferramentas', href:'#toolchain', keywords:'photoshop premiere after effects blender illustrator coreldraw capcut claude codex visual studio fl studio github', type:'SECTION' },
    { n:'08', label:'Seeven Lab', href:'#lab', keywords:'3d motion interface experimento', type:'SECTION' },
    { n:'09', label:'Iniciar projeto', href:whatsapp, keywords:'contato whatsapp orçamento projeto', type:'ACTION' },
    ...projectItems,
    ...toolItems
  ]
  const normalized = query.trim().toLowerCase()
  const visible = (normalized ? items.filter(item => `${item.label} ${item.keywords}`.toLowerCase().includes(normalized)) : items.slice(0, 8)).slice(0, 14)

  useEffect(() => { if (!open) setQuery('') }, [open])
  if (!open) return null
  return (
    <div className="palette-backdrop" onMouseDown={onClose} role="presentation">
      <div className="command-palette" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Navegação rápida">
        <div className="palette-top"><span>SEE7VEN / SEARCH</span><button onClick={onClose}>ESC</button></div>
        <div className="palette-search"><span>⌕</span><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Busque cliente, projeto, ferramenta ou capacidade…"/></div>
        <div className="palette-results">
          {visible.map((item, index) => (
            <a key={`${item.type}-${item.label}-${index}`} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={() => { track('command_palette_open', { target: item.label, type: item.type }); onClose() }}>
              <span>{item.n}</span><strong>{item.label}<small>{item.type}</small></strong><i>↘</i>
            </a>
          ))}
          {!visible.length && <div className="palette-empty">Nada encontrado. Tente “vídeo”, “Photoshop”, “Sindpetshop”, “site” ou “food”.</div>}
        </div>
      </div>
    </div>
  )
}

function Hero({ whatsapp, pitch, prospect }) {
  const pitchInfo = pitchCopy[pitch]
  return (
    <section id="top" className="hero light-phase">
      <div className="hero-micro hero-micro-left"><span>EST. 20—</span><span>SÃO PAULO / BR</span></div>
      <div className="hero-micro hero-micro-right"><span>STRATEGY × DESIGN × TECH</span><span>SCROLL TO ENTER</span></div>

      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="status-dot"/> {prospect ? `UMA IDEIA PARA ${prospect.toUpperCase()}` : pitch ? `PITCH MODE / ${pitch.toUpperCase()}` : 'PRESENÇA, NÃO BARULHO.'}</div>
        <h1>
          <span>FAZEMOS</span>
          <span className="hero-outline">MARCAS</span>
          <span>PARAREM.</span>
        </h1>
        <div className="hero-bottomline">
          <div className="hero-thesis"><p>Estratégia, design, conteúdo e tecnologia para construir marcas que continuam existindo quando a tela desliga.</p>{pitchInfo && <div className="pitch-thesis"><span>{pitchInfo.kicker}</span><b>{pitchInfo.line}</b></div>}</div>
          <a href="#work" className="round-link" aria-label="Explorar trabalhos">{downArrow}</a>
        </div>
      </div>

      <div className="hero-object" aria-hidden="true">
        <div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="orbit orbit-c"/>
        <div className="seven-sculpture"><span>7</span></div>
        <div className="hero-tag tag-one">DIRECTION / 01</div>
        <div className="hero-tag tag-two">PRESENCE / ∞</div>
      </div>

      <a href={whatsapp} target="_blank" rel="noreferrer" className="floating-contact">TEM UM PROJETO? <b>{externalArrow}</b></a>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto light-phase section-shell">
      <div className="index-label" data-reveal>01 — MANIFESTO</div>
      <div className="manifesto-grid">
        <p className="manifesto-aside" data-reveal>Não queremos ser mais uma agência na sua aba do navegador.</p>
        <div className="manifesto-copy" data-reveal>
          <p>Sua marca não precisa de <em>mais um post.</em></p>
          <p>Precisa ser percebida.</p>
          <p>Entendida.</p>
          <p>Lembrada.</p>
          <p className="manifesto-accent">E continuar existindo quando a tela desliga.</p>
        </div>
      </div>
      <div className="contact-strip" aria-label="Pontos de contato de marca">
        {[...touchpoints, ...touchpoints].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✦</i></span>)}
      </div>
    </section>
  )
}

function ProjectVisual({ project, compact = false, clientList = clients }) {
  const client = clientList.find(c => c.id === project.clientId || c.name === project.client)
  const brandPreview = client?.publicCover || client?.brandPoster || ''
  const [cover, setCover] = useState(project.cover || '')
  const [brandImage, setBrandImage] = useState(brandPreview)

  useEffect(() => {
    setCover(project.cover || '')
    setBrandImage(brandPreview)
  }, [project.cover, brandPreview])

  return (
    <div className={`project-visual visual-${project.theme} ${compact ? 'compact' : ''}`}>
      {cover && <img className="real-project-cover" src={cover} alt={`Prévia pública de ${project.client}`} onError={() => setCover('')}/>}
      <div className="visual-grid-lines"/>
      <div className="visual-noise"/>
      {project.theme === 'orange' && <>
        <div className="mock-browser">
          <div className="browser-top"><i/><i/><i/><span>sindpetshop.org.br</span></div>
          <div className="browser-content"><b>QUEM CUIDA<br/>TAMBÉM PRECISA<br/>SER CUIDADO.</b><span>ECOSSISTEMA DIGITAL</span></div>
        </div>
        <div className="mock-phone"><div className="phone-island"/><div className="phone-card">CCT<br/><b>NA PRÁTICA</b></div><div className="phone-dots">•••</div></div>
      </>}
      {project.theme === 'wine' && <>
        <div className="food-disc"><span>V</span></div><div className="food-copy">VENÂNCIO<small>PIZZA / SOCIAL</small></div>
      </>}
      {project.theme === 'acid' && <><div className="acid-type">SEON</div><div className="acid-pill">MOVE DIFFERENT</div><div className="acid-ring"/></>}
      {project.theme === 'violet' && <><div className="club-light club-a"/><div className="club-light club-b"/><div className="club-type">EAZY<small>NIGHT / MOTION</small></div></>}
      {project.theme === 'steel' && <><div className="drill-circle"/><div className="industrial-type">CZK<span>DRILLS</span></div><div className="industrial-meta">PRECISION / CONTENT / B2B</div></>}
      {project.theme === 'sky' && <><div className="pet-face"><span>•</span><span>•</span><b>⌣</b></div><div className="pet-type">MIBIS<br/>DOG</div></>}
      {project.theme === 'event' && <><div className="event-truss"><i/><i/><i/><i/></div><div className="event-beam beam-a"/><div className="event-beam beam-b"/><div className="event-type">PUBLI<small>STRUCTURE / EXPERIENCE</small></div><div className="event-stage">20+<span>CIDADES / PUBLIC CONTEXT</span></div></>}
      {project.theme === 'music' && <><div className="music-disc"><i/></div><div className="music-wave">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--wave': `${28 + ((i * 37) % 72)}%` }}/>)}</div><div className="music-type">{project.client.toUpperCase()}<small>MUSIC / MOTION</small></div></>}
      {project.theme === 'food' && <><div className="food-menu-card"><span>HOJE / DELIVERY</span><strong>SABOR<br/>QUE<br/>CHAMA.</strong><i>→ PEDIR</i></div><div className="food-plate"><b>+</b></div><div className="food-price">PRODUCT / CONVERSION</div></>}
      {!cover && brandImage && <div className="project-brand-preview"><img src={brandImage} alt={`Marca ${project.client}`} onError={() => setBrandImage(current => current === (client?.brandPoster || '') ? '' : (client?.brandPoster || ''))}/><span>{client?.handle || 'PUBLIC PRESENCE'}</span></div>}
      <div className="visual-corner">SEEVEN / {project.client}</div>
    </div>
  )
}

function BeforeAfterStory({ study }) {
  const [position, setPosition] = useState(56)
  if (!study?.before || !study?.after) return null
  return (
    <div className="ba-story">
      <div className="ba-stage" style={{ '--ba-position': `${position}%`, '--case-accent': study.accent }}>
        <div className="ba-layer ba-before"><span>{study.before.title}</span><strong>PEÇAS<br/>SOLTAS</strong><p>{study.before.text}</p></div>
        <div className="ba-layer ba-after"><span>{study.after.title}</span><strong>SISTEMA<br/>CONECTADO</strong><p>{study.after.text}</p></div>
        <div className="ba-divider"><i>↔</i></div>
        <input aria-label="Comparar antes e depois" type="range" min="10" max="90" value={position} onChange={e => setPosition(Number(e.target.value))}/>
      </div>
      <div className="ba-caption"><span>ANTES / DEPOIS</span><p>Arraste para comparar a lógica anterior com o sistema que o projeto passou a construir.</p></div>
    </div>
  )
}

function CaseDrawer({ study, project, onClose, onNext, onPrevious, clientList = clients }) {
  const drawerRef = useRef(null)
  const [copied, setCopied] = useState(false)
  useBodyLock(Boolean(study))
  useEffect(() => { drawerRef.current?.scrollTo({ top: 0, behavior: 'auto' }); setCopied(false) }, [study?.id])
  useEffect(() => {
    if (!study) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNext?.()
      if (event.key === 'ArrowLeft') onPrevious?.()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [study, onClose, onNext, onPrevious])
  if (!study) return null
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      track('case_share', { case: study.id })
      setTimeout(() => setCopied(false), 1600)
    } catch (_) {}
  }
  return (
    <div className="case-drawer-backdrop" role="presentation" onMouseDown={onClose}>
      <article ref={drawerRef} className="case-drawer" role="dialog" aria-modal="true" aria-label={`Case ${study.client}`} onMouseDown={e => e.stopPropagation()} style={{ '--case-accent': study.accent }}>
        <div className="case-drawer-top"><span>SEE7VEN / CASE FILE</span><div><button onClick={copyLink}>{copied ? 'COPIADO ✓' : 'COPIAR LINK'}</button><button onClick={onPrevious}>←</button><button onClick={onNext}>→</button><button onClick={onClose}>FECHAR ×</button></div></div>
        <div className="case-drawer-hero">
          <div className="case-drawer-copy"><span>{study.eyebrow}</span><h3>{study.headline}</h3><p>{study.intro}</p><div className="case-drawer-proof">{study.proof?.map(item => <b key={item}>{item}</b>)}</div></div>
          {project && <ProjectVisual project={project} compact clientList={clientList}/>}
        </div>
        <div className="case-story-grid">
          <div><span>01 / DESAFIO</span><p>{study.challenge}</p></div>
          <div><span>02 / ESTRATÉGIA</span><p>{study.strategy}</p></div>
          <div className="case-story-execution"><span>03 / EXECUÇÃO</span><div>{study.execution?.map(item => <b key={item}>{item}</b>)}</div></div>
          <div><span>04 / RESULTADO</span><p>{study.result}</p></div>
        </div>
        <CaseIntelligencePanel caseId={study.id} intelligence={project?.intelligence}/>
        <BeforeAfterStory study={study}/>
        <div className="case-drawer-footer"><div><span>UMA MARCA.</span><strong>UM SISTEMA DE PRESENÇA.</strong></div>{study.source && <a href={study.source} target="_blank" rel="noreferrer" onClick={() => track('case_source_open', { case: study.id })}>Ver presença pública {externalArrow}</a>}</div>
      </article>
    </div>
  )
}

function caseIdFromLocation() {
  const pathMatch = window.location.pathname.match(/^\/work\/([^/]+)\/?$/i)
  if (pathMatch) return decodeURIComponent(pathMatch[1])
  return new URLSearchParams(window.location.search).get('case')
}

function Work({ projects = featuredProjects, clientList = clients }) {
  const initialCase = caseIdFromLocation()
  const [filter, setFilter] = useState('all')
  const returnScrollRef = useRef(null)
  const [activeCaseId, setActiveCaseId] = useState(initialCase || null)
  const activeProject = projects.find(item => item.id === activeCaseId) || featuredProjects.find(item => item.id === activeCaseId)
  const activeStudy = activeCaseId ? (activeProject?.caseStudy || caseStudies[activeCaseId]) : null
  const studyFor = (project) => project?.caseStudy || caseStudies[project?.id]

  const filtered = useMemo(() => {
    const option = portfolioFilterOptions.find(item => item.id === filter)
    if (!option?.match?.length) return projects
    return projects.filter(project => {
      const haystack = [project.label, project.title, project.summary, ...(project.tags || [])].join(' ').toLowerCase()
      return option.match.some(term => haystack.includes(term.toLowerCase()))
    })
  }, [projects, filter])

  const openCase = (project) => {
    returnScrollRef.current = window.scrollY
    if (!studyFor(project)) {
      if (project.href) window.open(project.href, '_blank', 'noopener,noreferrer')
      return
    }
    setActiveCaseId(project.id)
    const search = new URLSearchParams(window.location.search)
    search.delete('case')
    const suffix = search.toString() ? `?${search.toString()}` : ''
    history.pushState({ case: project.id }, '', `/work/${encodeURIComponent(project.id)}${suffix}`)
    track('case_open', { case: project.id, client: project.client })
  }
  const closeCase = () => {
    setActiveCaseId(null)
    const search = new URLSearchParams(window.location.search)
    search.delete('case')
    const suffix = search.toString() ? `?${search.toString()}` : ''
    history.pushState({}, '', `/${suffix}#work`)
    requestAnimationFrame(() => {
      if (Number.isFinite(returnScrollRef.current)) window.scrollTo({ top: returnScrollRef.current, behavior: 'auto' })
      else document.getElementById('work')?.scrollIntoView({ block: 'start' })
    })
  }
  const moveCase = (direction) => {
    const eligible = projects.filter(item => studyFor(item))
    if (!eligible.length) return
    const current = Math.max(0, eligible.findIndex(item => item.id === activeCaseId))
    const next = eligible[(current + direction + eligible.length) % eligible.length]
    setActiveCaseId(next.id)
    const search = new URLSearchParams(window.location.search); search.delete('case')
    const suffix = search.toString() ? `?${search.toString()}` : ''
    history.replaceState({ case: next.id }, '', `/work/${encodeURIComponent(next.id)}${suffix}`)
    track('case_navigate', { case: next.id })
  }

  useEffect(() => {
    const onPop = () => {
      const id = caseIdFromLocation()
      setActiveCaseId(id || null)
    }
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  return (
    <section id="work" className="work-section transition-phase section-shell">
      <div className="work-heading">
        <div className="index-label" data-reveal>02 — SELECTED WORK</div>
        <h2 data-reveal>OLHE PRIMEIRO.<br/><span>LEIA DEPOIS.</span></h2>
        <p data-reveal>Uma marca não deveria precisar de uma legenda para parecer boa.</p>
      </div>

      <div className="work-filter" data-reveal>{portfolioFilterOptions.map(option => <button key={option.id} className={filter === option.id ? 'active' : ''} onClick={() => { setFilter(option.id); track('work_filter', { filter: option.id }) }}>{option.label}<span>{option.id === 'all' ? projects.length : ''}</span></button>)}</div>

      <div className="project-grid">
        {filtered.map((project, index) => (
          <button key={project.id} type="button" className={`project-card project-${project.size}`} data-reveal style={{ '--delay': `${index * 35}ms` }} onClick={() => openCase(project)} aria-label={`Abrir case ${project.client}`}>
            <ProjectVisual project={project} clientList={clientList}/>
            <div className="project-meta">
              <div><span>{project.label}</span><strong>{project.client}</strong></div>
              <p>{project.title}</p>
              <i>{studyFor(project) ? 'ABRIR CASE ↗' : externalArrow}</i>
            </div>
          </button>
        ))}
        {!filtered.length && <div className="work-empty"><span>NENHUM CASE NESTE FILTRO.</span><button onClick={() => setFilter('all')}>VER TODOS →</button></div>}
      </div>

      <div className="work-principle" data-reveal>
        <span>PORTFÓLIO NÃO É UMA LISTA.</span>
        <strong>É PROVA.</strong>
      </div>
      <CaseDrawer study={activeStudy} project={activeProject} clientList={clientList} onClose={closeCase} onNext={() => moveCase(1)} onPrevious={() => moveCase(-1)}/>
    </section>
  )
}


function CaseIntelligencePanel({ caseId, intelligence }) {
  const profile = intelligence || projectIntelligence.find(item => item.id === caseId)
  if (!profile) return null
  return (
    <div className="case-intelligence" style={{ '--case-accent': profile.accent }}>
      <div className="case-intelligence-head">
        <div><span>PROJECT INTELLIGENCE</span><strong>POR QUE ESTE PROJETO TOMOU ESTA FORMA?</strong></div>
        <small>CONTEXTO → INSIGHT → DECISÃO</small>
      </div>
      <div className="case-intelligence-grid">
        <article><span>OBJETIVO</span><p>{profile.objective}</p></article>
        <article><span>RESTRIÇÃO</span><p>{profile.constraint}</p></article>
        <article><span>INSIGHT</span><p>{profile.insight}</p></article>
        <article><span>DECISÃO</span><p>{profile.decision}</p></article>
      </div>
      <div className="case-intelligence-flow">
        {(profile.channels || []).map((item, index, list) => <React.Fragment key={item}><b>{item}</b>{index < list.length - 1 && <i>→</i>}</React.Fragment>)}
      </div>
    </div>
  )
}

function StrategyOS({ projects = featuredProjects }) {
  const profiles = useMemo(() => {
    const clean = (value = {}) => Object.fromEntries(Object.entries(value).filter(([, item]) => Array.isArray(item) ? item.length : item !== '' && item !== null && item !== undefined))
    const cmsMap = new Map(projects.filter(item => item.intelligence).map(item => [item.id, clean(item.intelligence)]))
    const merged = projectIntelligence.map(base => ({ ...base, ...(cmsMap.get(base.id) || {}) }))
    const known = new Set(merged.map(item => item.id))
    projects.filter(item => item.intelligence && !known.has(item.id)).forEach(item => merged.push(clean(item.intelligence)))
    return merged
  }, [projects])
  const [activeId, setActiveId] = useState(profiles[0]?.id)
  const [activeStage, setActiveStage] = useState(strategyStages[0]?.id || 'context')
  const profile = profiles.find(item => item.id === activeId) || profiles[0]
  const stage = strategyStages.find(item => item.id === activeStage) || strategyStages[0]
  const stageText = profile?.[stage.id] || ''

  useEffect(() => setActiveStage('context'), [activeId])
  useEffect(() => { if (profiles.length && !profiles.some(item => item.id === activeId)) setActiveId(profiles[0].id) }, [profiles, activeId])
  if (!profile) return null

  return (
    <section id="strategy" className="strategy-section dark-phase section-shell">
      <div className="strategy-heading">
        <div className="index-label" data-reveal>03 — PROJECT INTELLIGENCE</div>
        <h2 data-reveal>ANTES DA ESTÉTICA,<br/><span>EXISTE UMA DECISÃO.</span></h2>
        <p data-reveal>O resultado visual é só a camada visível. Aqui mostramos o raciocínio que organiza contexto, público, insight, sistema e execução.</p>
      </div>

      <div className="strategy-console" data-reveal style={{ '--strategy-accent': profile.accent }}>
        <div className="strategy-topbar">
          <div><span className="strategy-dot"/><b>SEE7VEN / PROJECT OS</b><small>CASE STUDY MODE</small></div>
          <div><span>RESEARCH</span><span>STRATEGY</span><span>SYSTEM</span><i>ONLINE</i></div>
        </div>

        <div className="strategy-layout">
          <aside className="strategy-sidebar">
            <div className="strategy-sidebar-title"><span>PROJECTS</span><b>{String(profiles.length).padStart(2,'0')}</b></div>
            {profiles.map((item, index) => <button key={item.id} className={item.id === activeId ? 'active' : ''} onClick={() => { setActiveId(item.id); track('strategy_project', { project: item.id }) }}>
              <span>{String(index + 1).padStart(2,'0')}</span><div><strong>{item.client}</strong><small>{item.category}</small></div><i style={{ background: item.accent }}/>
            </button>)}
            <div className="strategy-sidebar-foot"><span>MODE</span><b>DECISION TRACE</b><small>V7.2</small></div>
          </aside>

          <div className="strategy-main">
            <div className="strategy-project-head">
              <div><span>{profile.category}</span><h3>{profile.client}</h3></div>
              <div className="strategy-focus">{(profile.focus || []).map(item => <b key={item}>{item}</b>)}</div>
            </div>

            <div className="strategy-summary-grid">
              <article><span>OBJECTIVE / 01</span><strong>{profile.objective}</strong></article>
              <article><span>CONSTRAINT / 02</span><strong>{profile.constraint}</strong></article>
            </div>

            <div className="strategy-stage-tabs" role="tablist" aria-label="Etapas do raciocínio do projeto">
              {strategyStages.map(item => <button role="tab" aria-selected={item.id === activeStage} className={item.id === activeStage ? 'active' : ''} key={item.id} onClick={() => { setActiveStage(item.id); track('strategy_stage', { project: profile.id, stage: item.id }) }}><span>{item.index}</span><b>{item.label}</b></button>)}
            </div>

            <div className="strategy-stage-content">
              <div className="strategy-stage-copy"><span>{stage.index} / {stage.label.toUpperCase()}</span><p>{stageText}</p></div>
              <div className="strategy-signal-panel">
                <div className="signal-head"><span>PROJECT SIGNAL</span><b>MAPA VISUAL / NÃO É KPI</b></div>
                <div className="signal-bars">
                  {(profile.signal?.length ? profile.signal : [70,78,82,74,80,76]).map((value, index) => <div key={index}><span>{String(index+1).padStart(2,'0')}</span><i><b style={{ height: `${value}%` }}/></i><small>{value}</small></div>)}
                </div>
              </div>
            </div>

            <div className="strategy-channel-row">
              <span>TOUCHPOINTS</span><div>{(profile.channels || []).map(item => <b key={item}>{item}</b>)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="strategy-principle" data-reveal>
        <span>CASE STUDY NÃO É ENFEITE DE PORTFÓLIO.</span>
        <strong>É A PROVA DA DECISÃO.</strong>
      </div>
    </section>
  )
}

function instagramEmbedUrl(url = '') {
  if (!/instagram\.com\/(reel|p|tv)\//i.test(url)) return ''
  const clean = url.split('?')[0].replace(/\/+$/, '')
  return `${clean}/embed/`
}

function ReelPoster({ reel, index, large = false, clientList = clients }) {
  const client = clientList.find(c => c.id === reel.clientId)
  const specificPoster = reel.poster || ''
  const brandMedia = client?.publicCover || client?.brandPoster || ''
  const [src, setSrc] = useState(specificPoster)
  const [brandAsset, setBrandAsset] = useState(brandMedia)
  const sourceType = specificPoster ? 'CAPA DO REEL' : 'CAPA EDITORIAL / MARCA'
  const mediaFit = client?.publicCoverFit || 'cover'
  const variant = (index % 6) + 1
  const posterX = 25 + ((index * 29) % 55)
  const posterY = 22 + ((index * 17) % 48)

  useEffect(() => setSrc(reel.poster || ''), [reel.poster])
  useEffect(() => setBrandAsset(brandMedia), [brandMedia])

  return <div className={`reel-frame ${large ? 'is-large' : ''} fallback-variant-${variant}`} style={{ '--fallback-accent': reel.accent || client?.accent, '--poster-x': `${posterX}%`, '--poster-y': `${posterY}%` }}>
    {src ? <img className="reel-poster" src={src} alt={`Capa do Reel de ${reel.client}`} loading="lazy" onError={() => setSrc('')}/> : <div className="editorial-reel-fallback" aria-label={`Capa editorial de ${reel.client}`}>
      <div className="fallback-grid"/><div className="fallback-orbit"/><div className="fallback-signal"/>
      {brandAsset && <div className="fallback-brand-asset"><img src={brandAsset} alt={`Referência visual pública de ${reel.client}`} loading="lazy" style={{ objectFit: mediaFit }} onError={() => setBrandAsset('')}/></div>}
      <span className="fallback-code">{String(index + 1).padStart(2, '0')} / {client?.category?.toUpperCase()}</span>
      <strong>{reel.client}</strong>
      <small>{client?.handle}</small>
      <b>{reel.title}</b>
      <em>POSTER PENDENTE / MEDIA VAULT</em>
    </div>}
    <div className="reel-poster-shade"/>
    <div className="reel-source-badge">{sourceType}</div>
    <div className="reel-index">{String(index + 1).padStart(2, '0')}</div>
    <div className="reel-brand-label"><strong>{reel.client}</strong><span>{client?.handle}</span></div>
    <div className="reel-play">▶</div>
  </div>
}

function ReelCard({ reel, index, onOpen, clientList = clients }) {
  const client = clientList.find(c => c.id === reel.clientId)
  const videoRef = useRef(null)
  const previewTracked = useRef(false)
  const previewable = Boolean(reel.video && /\.(mp4|webm)(\?|$)/i.test(reel.video))
  const startPreview = () => {
    if (!previewable || matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
      if (!previewTracked.current) { previewTracked.current = true; track('reel_preview', { client: reel.client, reel: reel.id }) }
    }
  }
  const stopPreview = () => {
    const video = videoRef.current
    if (video) { video.pause(); video.currentTime = 0 }
  }
  return (
    <button className={`reel-card reel-${reel.clientId}`} onMouseEnter={startPreview} onMouseLeave={stopPreview} onFocus={startPreview} onBlur={stopPreview} onClick={() => { track('reel_open', { client: reel.client, reel: reel.id }); onOpen(reel) }} data-reveal style={{ '--reel-accent': reel.accent, '--delay': `${(index % 8) * 24}ms` }}>
      <ReelPoster reel={reel} index={index} clientList={clientList}/>
      {previewable && <video ref={videoRef} className="reel-hover-video" src={reel.video} muted loop playsInline preload="none"/>}
      <div className="reel-meta"><strong>{reel.client}</strong><span>{reel.title} · {client?.category}</span></div>
    </button>
  )
}

function Reels({ items = reels, clientList = clients }) {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const [showreelIndex, setShowreelIndex] = useState(null)
  const showreelItems = useMemo(() => items.filter(item => item.video || instagramEmbedUrl(item.url)), [items])
  useBodyLock(Boolean(active) || showreelIndex !== null)
  useEffect(() => {
    if (!active && showreelIndex === null) return
    const onKey = (event) => {
      if (event.key === 'Escape') { setActive(null); setShowreelIndex(null) }
      if (showreelIndex !== null && showreelItems.length && event.key === 'ArrowRight') setShowreelIndex(i => (i + 1) % showreelItems.length)
      if (showreelIndex !== null && showreelItems.length && event.key === 'ArrowLeft') setShowreelIndex(i => (i - 1 + showreelItems.length) % showreelItems.length)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [active, showreelIndex, showreelItems.length])
  const filters = ['all', ...new Set(items.map(r => r.clientId))]
  const visible = filter === 'all' ? items : items.filter(r => r.clientId === filter)
  const explicitFeatured = items.filter(item => item.featured)
  const fallbackFeatured = Array.from(new Map(items.map(item => [item.clientId, item])).values()).slice(0, 6)
  const featured = (explicitFeatured.length ? explicitFeatured : fallbackFeatured).slice(0, 6)
  const activeClient = active ? clientList.find(c => c.id === active.clientId) : null
  const embed = active ? instagramEmbedUrl(active.url) : ''
  const activePoster = active?.poster || activeClient?.publicCover || activeClient?.brandPoster || ''
  const showreelItem = showreelIndex === null ? null : showreelItems[showreelIndex]
  const showreelClient = showreelItem ? clientList.find(c => c.id === showreelItem.clientId) : null
  const showreelEmbed = showreelItem ? instagramEmbedUrl(showreelItem.url) : ''
  const showreelPoster = showreelItem?.poster || showreelClient?.publicCover || showreelClient?.brandPoster || ''

  const changeFilter = (id) => {
    setFilter(id)
    track('portfolio_filter', { filter: id })
  }

  return (
    <section id="reels" className="reels-section dark-phase section-shell">
      <div className="reel-heading">
        <div><div className="index-label" data-reveal>04 — MOTION ARCHIVE</div><h2 data-reveal>32 REELS.<br/><span>11 LINGUAGENS.</span></h2></div>
        <div className="reel-heading-side" data-reveal><p>O mesmo formato. Marcas completamente diferentes. A linguagem deve servir ao projeto — nunca o contrário.</p><button className="showreel-trigger" disabled={!showreelItems.length} onClick={() => { if (!showreelItems.length) return; setShowreelIndex(0); track('showreel_start', { count: showreelItems.length }) }}>{showreelItems.length ? `▶ ASSISTIR SHOWREEL / ${showreelItems.length}` : 'SHOWREEL / AGUARDA MÍDIA REAL'}</button></div>
      </div>

      {featured.length > 0 && <div className="motion-highlights" data-reveal>
        <div className="motion-highlights-top"><span>DESTAQUES / CAPAS VISÍVEIS</span><p>Poster real quando cadastrado. Se ainda faltar o asset, a marca permanece identificável por uma capa editorial consistente — sem quadrados vazios.</p></div>
        <div className="motion-highlights-grid">
          {featured.map((reel, index) => <button key={reel.id} className="motion-highlight-card" onClick={() => { track('reel_featured_open', { client: reel.client }); setActive(reel) }} style={{ '--reel-accent': reel.accent }}>
            <ReelPoster reel={reel} index={index} large clientList={clientList}/>
            <div className="motion-highlight-copy"><span>{clientList.find(c => c.id === reel.clientId)?.category}</span><strong>{reel.client}</strong><p>{reel.publicContext || 'Direção visual adaptada à linguagem e ao público da marca.'}</p></div>
          </button>)}
        </div>
      </div>}

      <div className="filter-row" data-reveal>
        {filters.map(id => {
          const client = clientList.find(c => c.id === id)
          return <button key={id} className={filter === id ? 'active' : ''} onClick={() => changeFilter(id)}>{id === 'all' ? `Todos / ${items.length}` : (client?.name || items.find(r => r.clientId === id)?.client || id)}</button>
        })}
      </div>

      <div className="reel-grid">
        {visible.map((reel, index) => <ReelCard key={reel.id} reel={reel} index={index} clientList={clientList} onOpen={setActive}/>) }
      </div>
      <p className="asset-note" data-reveal><span>MEDIA VAULT</span> Prioridade: <code>poster do Reel</code> → <code>frame/vídeo próprio</code> → <code>identidade da marca</code>. URLs de terceiros passam a ser apoio, não dependência estrutural.</p>

      {active && <div className="reel-modal" onMouseDown={() => setActive(null)}>
        <div className="reel-modal-card" onMouseDown={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActive(null)}>FECHAR ×</button>
          <div className="modal-media">
            {active.video ? <video src={active.video} controls autoPlay playsInline poster={activePoster} onPlay={() => track('reel_play', { client: active.client, reel: active.id })} onEnded={() => track('reel_complete', { client: active.client, reel: active.id })}/> : embed ? <iframe className="instagram-embed-frame" src={embed} title={`${active.client} — ${active.title}`} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" loading="lazy"/> : <div className="modal-cover-preview" style={{ '--reel-accent': active.accent }}>
              {activePoster && <img src={activePoster} alt={`Capa de ${active.client}`} style={{ objectFit: active?.poster ? 'cover' : (activeClient?.publicCoverFit || 'cover'), background: activeClient?.publicCoverFit === 'contain' ? '#f4f2ee' : undefined }}/>}<div className="modal-cover-overlay"><b>{active.client}</b><span>{activeClient?.handle}</span><p>Cadastre a URL exata do Reel ou um arquivo de vídeo no Admin para transformar este destaque em mídia reproduzível.</p></div>
            </div>}
          </div>
          <div className="modal-bottom"><div><span>REEL / {String(active.id).toUpperCase()}</span><strong>{active.client}</strong></div><a href={active.url || activeClient?.url} target="_blank" rel="noreferrer">Abrir fonte pública {externalArrow}</a></div>
        </div>
      </div>}

      {showreelItem && <div className="showreel-modal" role="dialog" aria-modal="true">
        <div className="showreel-top"><span>SEE7VEN / SHOWREEL <b>{String(showreelIndex + 1).padStart(2,'0')}</b> / {String(showreelItems.length).padStart(2,'0')}</span><button onClick={() => setShowreelIndex(null)}>FECHAR ×</button></div>
        <div className="showreel-stage">
          {showreelItem.video ? <video key={showreelItem.id} src={showreelItem.video} autoPlay controls playsInline poster={showreelPoster} onPlay={() => track('showreel_play', { reel: showreelItem.id })} onEnded={() => { track('showreel_complete', { reel: showreelItem.id }); setShowreelIndex(i => (i + 1) % showreelItems.length) }}/> : showreelEmbed ? <iframe key={showreelItem.id} src={showreelEmbed} title={showreelItem.title} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"/> : <div className="showreel-fallback" style={{ '--reel-accent': showreelItem.accent }}>{showreelPoster && <img src={showreelPoster} alt=""/>}<div><span>{showreelClient?.category}</span><strong>{showreelItem.client}</strong><p>{showreelItem.publicContext || 'Motion / direção / conteúdo.'}</p></div></div>}
        </div>
        <div className="showreel-bottom"><button onClick={() => { setShowreelIndex(i => (i - 1 + showreelItems.length) % showreelItems.length); track('showreel_previous') }}>← ANTERIOR</button><div><span>{showreelClient?.handle}</span><strong>{showreelItem.title}</strong></div><button onClick={() => { setShowreelIndex(i => (i + 1) % showreelItems.length); track('showreel_next') }}>PRÓXIMO →</button></div>
      </div>}
    </section>
  )
}

function CaseSindpetshop() {
  return (
    <section id="case-sindpetshop" className="case-section dark-phase section-shell">
      <div className="case-intro" data-reveal>
        <div className="index-label">05 — CASE STUDY / SINDPETSHOP-SP</div>
        <span className="case-super">UM CASE<br/>DIFÍCIL.</span>
        <h2>COMUNICAÇÃO SINDICAL<br/><em>NÃO É FÁCIL.</em></h2>
        <p>Quando a informação é complexa, o design não pode decorar. Ele precisa organizar, traduzir e conduzir.</p>
      </div>

      <div className="case-journey" data-reveal>
        {['Estratégia','Identidade','Conteúdo','Site','Campanhas','Performance','Presença'].map((item, i) => <div key={item}><span>0{i+1}</span><strong>{item}</strong></div>)}
      </div>

      <div className="case-narrative">
        <article data-reveal><span>01 / O DESAFIO</span><h3>INFORMAÇÃO QUE NÃO PODE SER TRATADA COMO DECORAÇÃO.</h3><p>Direitos, CCTs, negociações, benefícios, notícias e orientações precisam ser entendidos rápido por trabalhadores com contextos diferentes. O projeto exige clareza sem perder impacto.</p></article>
        <article data-reveal><span>02 / A ESTRATÉGIA</span><h3>CRIAR UMA LINGUAGEM QUE ORGANIZA ASSUNTOS DIFERENTES.</h3><p>Hierarquia editorial, sistema visual reconhecível e jornadas digitais conectadas permitem mudar o tema sem fazer a marca parecer outra a cada publicação.</p></article>
        <article data-reveal><span>03 / A EXECUÇÃO</span><h3>SOCIAL, SITE, LANDINGS, VÍDEO E FÍSICO COMO PARTES DO MESMO SISTEMA.</h3><p>A lógica não termina no feed. O usuário pode chegar por uma publicação, aprofundar no site, preencher uma jornada, conversar no WhatsApp ou receber um material físico.</p></article>
      </div>

      <div className="case-scale" data-reveal>
        <div className="case-scale-copy">
          <span>CONTEXTO PÚBLICO DO CLIENTE</span>
          <strong>COMUNICAÇÃO PARA UMA OPERAÇÃO DE ESCALA ESTADUAL.</strong>
          <p>Esses números são dados institucionais públicos do próprio Sindpetshop-SP. Eles contextualizam a complexidade do projeto e não são apresentados como resultado de campanha da Seeven.</p>
        </div>
        <div className="case-scale-grid">
          {sindpetshopScale.map(item => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}
        </div>
      </div>

      <div className="case-showcase">
        <div className="case-browser-wrap" data-reveal>
          <div className="large-browser">
            <div className="browser-chrome"><span/><span/><span/><b>sindpetshop.org.br</b></div>
            <div className="case-site-ui">
              <div className="case-site-nav"><b>SINDPETSHOP-SP</b><span>Notícias &nbsp; CCT &nbsp; Benefícios &nbsp; Associe-se</span></div>
              <div className="case-site-hero"><small>TRABALHADOR DO SETOR PET</small><strong>Informação que chega<br/>antes do problema.</strong><i>ACESSAR DIREITOS →</i></div>
              <div className="case-site-cards"><span/><span/><span/></div>
            </div>
          </div>
          <div className="browser-caption"><span>WEBSITE / ECOSSISTEMA</span><p>Notícias, acordos coletivos, benefícios, assistência, associação, parceiros e diferentes jornadas digitais no mesmo sistema.</p></div>
        </div>

        <div className="case-social-wall" data-reveal>
          {['CCT','PLR','FGTS','DIREITOS','FERIADO','CLT'].map((word, i) => <div key={word} className={`social-tile tile-${i+1}`}><span>SINDPETSHOP</span><strong>{word}</strong><i>0{i+1}</i></div>)}
          <div className="social-caption">SOCIAL / SISTEMA VISUAL</div>
        </div>
      </div>

      <div className="stats-grid">
        {sindpetshopStats.map((stat, i) => <div className="stat-card" key={stat.label} data-reveal style={{ '--delay': `${i * 55}ms` }}><span>{stat.delta}</span><strong>{stat.value}</strong><p>{stat.label}</p></div>)}
      </div>
      <p className="stat-source" data-reveal>Recortes de agosto de 2026. Métricas apresentadas separadamente conforme os períodos de origem. <a href="https://sindpetshop.org.br/" target="_blank" rel="noreferrer">Contexto institucional público ↗</a></p>

      <div className="case-closing" data-reveal>
        <span>O resultado não é “um feed bonito”.</span>
        <strong>É UM SISTEMA DE COMUNICAÇÃO.</strong>
      </div>
    </section>
  )
}

function PixelPaper() {
  const sectionRef = useRef(null)
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const travel = Math.max(rect.height - innerHeight, 1)
        const p = Math.min(1, Math.max(0, -rect.top / travel))
        setProgress(Number(p.toFixed(3)))
      })
    }
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update()
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); cancelAnimationFrame(raf) }
  }, [])
  const phase = progress < .34 ? 0 : progress < .68 ? 1 : 2
  return (
    <section id="pixel-paper" ref={sectionRef} className="pixel-paper dark-phase section-shell" style={{ '--pp': progress, '--pp-shift': `${(progress - .5) * 120}px`, '--pp-shift-neg': `${(progress - .5) * -54}px`, '--pp-shift-badge': `${(progress - .5) * 36}px`, '--pp-shift-phone': `${(progress - .5) * -78}px`, '--pp-rotate': `${(progress - .5) * 10}deg` }}>
      <div className="pixel-heading"><div className="index-label" data-reveal>06 — PHYSICAL / DIGITAL</div><h2 data-reveal>DO PIXEL<br/><span>AO PAPEL.</span></h2><p data-reveal>Uma marca não vive em um único lugar. Por isso, pensamos o sistema antes da peça.</p></div>
      <div className="pixel-storyline" data-reveal>{['NASCE NA IDEIA', 'GANHA A TELA', 'CONTINUA NO MUNDO'].map((item, index) => <span key={item} className={phase === index ? 'active' : ''}><i>0{index+1}</i>{item}</span>)}</div>
      <div className="art-direction-table" data-reveal>
        <div className="table-grid"/>
        <div className="paper poster-piece"><span>CAMPAIGN</span><strong>MAKE<br/>IT<br/>STOP.</strong><i>SEE7VEN</i></div>
        <div className="paper card-piece"><span>SEEVEN / 07</span><b>Presence<br/>systems.</b><i>→</i></div>
        <div className="badge-piece"><div>7</div><span>CREATIVE<br/>DIRECTION</span></div>
        <div className="phone-piece"><div className="phone-island"/><small>SEE7VEN</small><strong>YOUR BRAND<br/>COULD BE<br/>HERE.</strong><span>SWIPE ↑</span></div>
        <div className="fold-piece"><span>01</span><strong>DIGITAL</strong><i>×</i><strong>PHYSICAL</strong><b>ONE BRAND.</b></div>
        <div className="table-note note-a">BRAND SYSTEM / 01</div><div className="table-note note-b">MATERIAL STUDY / 07</div>
      </div>
      <div className="pixel-closing" data-reveal><span>O DISPOSITIVO É SÓ UM PONTO DE CONTATO.</span><strong>A TELA TERMINA.<br/>A MARCA NÃO.</strong></div>
    </section>
  )
}

function Ecosystem() {
  const [active, setActive] = useState(touchpoints[0])
  const detail = ecosystemDetails[active]
  return (
    <section className="ecosystem dark-phase section-shell">
      <div className="ecosystem-copy" data-reveal><div className="index-label">07 — BRAND ECOSYSTEM</div><h2>UMA MARCA.<br/><span>VÁRIOS PONTOS<br/>DE CONTATO.</span></h2><p>O cliente não diferencia “social”, “site”, “impresso” ou “Google”. Ele só percebe se tudo parece fazer parte da mesma marca.</p></div>
      <div className="ecosystem-interface" data-reveal>
        <div className="ecosystem-orbit">
          <div className="ecosystem-core"><span>SEE7VEN</span><strong>MARCA</strong><i>∞</i></div>
          {touchpoints.map((item, index) => <button className={`touchpoint touch-${index+1} ${active === item ? 'is-active' : ''}`} key={item} onMouseEnter={() => setActive(item)} onFocus={() => setActive(item)} onClick={() => { setActive(item); track('ecosystem_touchpoint', { touchpoint: item }) }}>{item}</button>)}
          <div className="ecosystem-ring ring-inner"/><div className="ecosystem-ring ring-outer"/>
        </div>
        <div className="ecosystem-detail" style={{ '--ecosystem-index': touchpoints.indexOf(active) }}>
          <span>POINT / {String(touchpoints.indexOf(active)+1).padStart(2,'0')}</span>
          <strong>{detail?.title}</strong>
          <p>{detail?.copy}</p>
          <div className="ecosystem-mini-ui"><i/><i/><i/><b>{active}</b></div>
        </div>
      </div>
    </section>
  )
}

function Toolchain() {
  const [activeGroup, setActiveGroup] = useState(knowledgeGroups[0].id)
  const [activeTool, setActiveTool] = useState(knowledgeGroups[0].tools[0])
  const group = knowledgeGroups.find(item => item.id === activeGroup) || knowledgeGroups[0]
  const activeEvidence = toolEvidenceLinks[activeTool?.name]

  useEffect(() => setActiveTool(group.tools[0]), [activeGroup])

  return (
    <section id="toolchain" className="toolchain-section dark-phase section-shell">
      <div className="toolchain-heading" data-reveal>
        <div><div className="index-label">08 — KNOWLEDGE / TOOLCHAIN</div><h2>IDEIA BOA<br/><span>PRECISA VIRAR COISA.</span></h2></div>
        <p>Não mostramos porcentagem de “domínio”. Mostramos o ecossistema que usamos para transformar estratégia em design, vídeo, 3D, código e produção.</p>
      </div>

      <div className="toolchain-console" data-reveal style={{ '--tool-accent': group.accent }}>
        <div className="toolchain-nav">
          <div className="console-brand"><span>7</span><b>CAPABILITY OS</b><small>V7.0</small></div>
          <div className="tool-group-tabs">{knowledgeGroups.map(item => <button key={item.id} className={item.id === activeGroup ? 'active' : ''} onClick={() => { setActiveGroup(item.id); track('toolchain_group', { group: item.id }) }}><i style={{ background: item.accent }}/>{item.label}</button>)}</div>
          <div className="console-status"><span className="status-dot"/> SYSTEM ONLINE</div>
        </div>

        <div className="toolchain-main">
          <div className="tool-list-panel">
            <div className="panel-kicker"><span>{group.label}</span><b>{String(group.tools.length).padStart(2,'0')} TOOLS</b></div>
            <div className="tool-grid">{group.tools.map((tool, index) => <button key={`${group.id}-${tool.name}`} className={activeTool?.name === tool.name ? 'active' : ''} onMouseEnter={() => setActiveTool(tool)} onFocus={() => setActiveTool(tool)} onClick={() => { setActiveTool(tool); track('toolchain_tool', { tool: tool.name }) }}>
              <span className="tool-short">{tool.short}</span><div><strong>{tool.name}</strong><small>0{index+1} / {group.id.toUpperCase()}</small></div><i>↗</i>
            </button>)}</div>
          </div>
          <div className="tool-focus-panel">
            <div className="focus-visual"><div className="focus-grid"/><span>{activeTool?.short}</span><i>SEE7VEN / WORKFLOW</i></div>
            <div className="focus-copy"><small>EM USO / {group.label}</small><strong>{activeTool?.name}</strong><p>{activeTool?.use}</p>{activeEvidence ? <a className="tool-evidence is-public" href={activeEvidence.url} target="_blank" rel="noreferrer" onClick={() => track('tool_evidence_open', { tool: activeTool?.name })}><i/>{activeEvidence.label}<b>↗</b></a> : <div className="tool-evidence"><i/>CAPACIDADE / WORKFLOW INFORMADO</div>}</div>
          </div>
        </div>

        <div className="pipeline-strip">
          {capabilityPipelines.map((pipeline, index) => <div className="pipeline-card" key={pipeline.title}><span>0{index+1} / {pipeline.title}</span><div>{pipeline.flow.map((step, i) => <React.Fragment key={step}><b>{step}</b>{i < pipeline.flow.length-1 && <i>→</i>}</React.Fragment>)}</div></div>)}
        </div>
      </div>
      <p className="toolchain-note" data-reveal>Ferramenta não é posicionamento. O valor está em saber quando combinar direção, edição, 3D, código, IA e produção para transformar uma decisão em presença real.</p>
    </section>
  )
}

function Solutions() {
  const [active, setActive] = useState(0)
  return (
    <section id="solutions" className="solutions-section dark-phase section-shell">
      <div className="solutions-heading"><div className="index-label" data-reveal>09 — SOLUTIONS</div><h2 data-reveal>QUAL PROBLEMA<br/><span>VOCÊ PRECISA RESOLVER?</span></h2></div>
      <div className="solution-layout">
        <div className="solution-list">
          {solutions.map((item, index) => <button key={item.problem} className={active === index ? 'active' : ''} onMouseEnter={() => setActive(index)} onClick={() => setActive(index)} data-reveal>
            <span>0{index+1}</span><strong>{item.problem}</strong><i>↘</i>
          </button>)}
        </div>
        <div className="solution-answer" data-reveal>
          <span>RESPOSTA / 0{active+1}</span>
          <p>{solutions[active].answer}</p>
          <div>{solutions[active].stack.map(item => <b key={item}>{item}</b>)}</div>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="process-section dark-phase section-shell">
      <div className="process-title"><div className="index-label" data-reveal>10 — PROCESS</div><h2 data-reveal>PROJETO NÃO<br/><span>É SÓ IMAGEM.</span></h2></div>
      <div className="process-track">
        {process.map(([n, title, text]) => <div className="process-step" key={n} data-reveal><span>{n}</span><strong>{title}</strong><p>{text}</p></div>)}
      </div>
    </section>
  )
}

function BehanceWall() {
  return (
    <section className="archive-section dark-phase section-shell">
      <div className="archive-heading"><div className="index-label" data-reveal>11 — VISUAL ARCHIVE</div><h2 data-reveal>PROJETOS QUE<br/><span>PEDEM TELA CHEIA.</span></h2><p data-reveal>Arquivo real do perfil público da Seeven no Behance. Capas e links foram conectados diretamente aos projetos publicados.</p></div>
      <div className="archive-wall">
        {behanceProjects.map((project, index) => <a href={project.url} target="_blank" rel="noreferrer" className={`archive-tile archive-${project.theme} ${project.cover ? 'has-cover' : ''}`} key={project.id} data-reveal style={{ '--delay': `${index * 30}ms` }} onClick={() => track('behance_project_open', { project: project.title })}>
          <div className="archive-art">
            {project.cover && <img src={project.cover} alt={`Capa de ${project.title}`} loading="lazy" onError={e => { e.currentTarget.style.display = 'none' }}/>} 
            <div className="archive-overlay"/>
            <span>{String(project.id).padStart(2,'0')}</span><b>{project.title.split(' ').slice(0,3).join(' ')}</b><i>SEEVEN / BEHANCE</i>
          </div>
          <div className="archive-meta"><div><strong>{project.title}</strong><span>{project.client}</span></div><div className="archive-tools">{project.tools?.slice(0,3).map(tool => <small key={tool}>{tool}</small>)}</div><span>{externalArrow}</span></div>
        </a>)}
      </div>
    </section>
  )
}

function Lab() {
  return (
    <section id="lab" className="lab-section dark-phase section-shell">
      <div className="lab-stage" data-reveal>
        <div className="lab-grid"/><div className="lab-sphere sphere-a"/><div className="lab-sphere sphere-b"/><div className="lab-prism"><span>7</span></div>
        <div className="lab-label label-a">MOTION / 3D</div><div className="lab-label label-b">CREATIVE CODE / UI</div>
      </div>
      <div className="lab-copy"><div className="index-label" data-reveal>12 — SEE7VEN LAB</div><h2 data-reveal>TAMBÉM CRIAMOS<br/><span>O QUE AINDA NÃO EXISTE.</span></h2><p data-reveal>3D, motion, interfaces, protótipos, conceitos e experimentos que expandem o repertório antes de virarem solução comercial.</p><div className="lab-tags" data-reveal>{['3D','MOTION','INTERFACE','EXPERIMENT','PROTOTYPE'].map(t => <span key={t}>{t}</span>)}</div></div>
    </section>
  )
}

function People() {
  return (
    <section className="people-section dark-phase section-shell">
      <div className="people-heading"><div className="index-label" data-reveal>13 — PEOPLE</div><h2 data-reveal>POR TRÁS DA SEE7VEN,<br/><span>TEM GENTE.</span></h2></div>
      <div className="people-grid">
        <article data-reveal><span className="person-index">K / 01</span><div className="person-portrait portrait-k"><b>K</b></div><div><strong>KAREN</strong><p>Relacionamento, operação e projetos.</p></div></article>
        <article data-reveal><span className="person-index">G / 02</span><div className="person-portrait portrait-g"><b>G</b></div><div><strong>GUSTAVO</strong><p>Estratégia, direção e desenvolvimento.</p></div></article>
      </div>
    </section>
  )
}

function LeadBrief({ open, onClose, whatsappNumber }) {
  const [step, setStep] = useState(0)
  useBodyLock(open)
  const [answers, setAnswers] = useState({ problem: '', scope: '', timing: '' })
  const steps = [
    { key: 'problem', title: 'O que precisa mudar?', options: ['Quero vender mais', 'Minha marca parece pequena', 'Ninguém entende o que faço', 'Preciso chamar atenção', 'Quero lançar algo novo'] },
    { key: 'scope', title: 'Onde isso precisa acontecer?', options: ['Marca / identidade', 'Social / conteúdo', 'Site / landing page', 'Vídeo / motion', 'Campanha completa', 'Ainda não sei'] },
    { key: 'timing', title: 'Quando você quer começar?', options: ['Agora', 'Nas próximas semanas', 'Neste trimestre', 'Estou pesquisando'] }
  ]
  useEffect(() => { if (!open) { setStep(0); setAnswers({ problem:'', scope:'', timing:'' }) } }, [open])
  if (!open) return null
  const current = steps[step]
  const choose = (value) => {
    const next = { ...answers, [current.key]: value }
    setAnswers(next)
    track('brief_answer', { step: current.key, value })
    if (step < steps.length - 1) setStep(step + 1)
    else setStep(steps.length)
  }
  const message = encodeURIComponent(`Olá! Vim pelo site da Seeven e respondi ao brief rápido.\n\nProblema: ${answers.problem}\nEscopo: ${answers.scope}\nPrazo: ${answers.timing}\n\nQuero conversar sobre o projeto.`)
  return <div className="brief-backdrop" onMouseDown={onClose}>
    <div className="brief-modal" onMouseDown={e => e.stopPropagation()}>
      <div className="brief-top"><span>SEE7VEN / 60 SECOND BRIEF</span><button onClick={onClose}>FECHAR ×</button></div>
      <div className="brief-progress"><i style={{ width: `${Math.min((step+1)/steps.length,1)*100}%` }}/></div>
      {step < steps.length ? <div className="brief-step"><span>0{step+1} / 0{steps.length}</span><h3>{current.title}</h3><div className="brief-options">{current.options.map(option => <button key={option} onClick={() => choose(option)}>{option}<i>↗</i></button>)}</div></div> : <div className="brief-result"><span>BRIEF / PRONTO</span><h3>Já temos um ponto de partida.</h3><div className="brief-summary"><p><b>Problema</b>{answers.problem}</p><p><b>Escopo</b>{answers.scope}</p><p><b>Prazo</b>{answers.timing}</p></div><a href={`https://wa.me/${whatsappNumber}?text=${message}`} target="_blank" rel="noreferrer" onClick={() => track('brief_completed', answers)}>Enviar no WhatsApp {externalArrow}</a></div>}
    </div>
  </div>
}

function Contact({ karenWhatsapp, gustavoWhatsapp, onBrief }) {
  return (
    <section id="contact" className="contact-section final-phase section-shell">
      <div className="contact-glow"/>
      <div className="index-label" data-reveal>14 — NEXT PROJECT</div>
      <h2 data-reveal>SEU PROJETO<br/><span>PODERIA ESTAR AQUI.</span></h2>
      <p data-reveal>Vamos descobrir o que sua marca poderia ser — e construir uma presença que prove isso.</p>
      <div className="contact-actions" data-reveal>
        <button className="brief-cta" onClick={onBrief}><span>BRIEF / 60 SEGUNDOS</span><strong>Descobrir por onde começar →</strong></button>
        <a href={karenWhatsapp} target="_blank" rel="noreferrer"><span>KAREN / NOVOS PROJETOS</span><strong>WhatsApp {externalArrow}</strong></a>
        <a href={gustavoWhatsapp || karenWhatsapp} target="_blank" rel="noreferrer"><span>GUSTAVO / DIREÇÃO</span><strong>Conversar {externalArrow}</strong></a>
      </div>
      <div className="contact-signature" aria-hidden="true">SEE7VEN</div>
    </section>
  )
}

function Footer() {
  return <footer className="site-footer"><div><span className="brand-mark">7</span><b>SEE7VEN</b></div><span>© {new Date().getFullYear()} — PRESENCE, FROM PIXEL TO PAPER.</span><a href="#top">VOLTAR AO TOPO ↑</a></footer>
}

export default function App() {
  const cms = useCmsContent()
  const { menuOpen, setMenuOpen, paletteOpen, setPaletteOpen } = useExperience()
  const [briefOpen, setBriefOpen] = useState(false)
  const params = useMemo(() => new URLSearchParams(window.location.search), [])
  const pitch = (params.get('for') || '').toLowerCase()
  const prospect = params.get('prospect') || ''
  const karenNumber = import.meta.env.VITE_KAREN_WHATSAPP || '5511971493985'
  const gustavoNumber = import.meta.env.VITE_GUSTAVO_WHATSAPP || ''
  const message = encodeURIComponent('Olá! Conheci a Seeven e quero conversar sobre um projeto.')
  const karenWhatsapp = `https://wa.me/${karenNumber}?text=${message}`
  const gustavoWhatsapp = gustavoNumber ? `https://wa.me/${gustavoNumber}?text=${message}` : karenWhatsapp

  const pitchProjects = useMemo(() => {
    const preferred = pitchPresets[pitch]
    if (!preferred?.length) return cms.projects
    const rank = new Map(preferred.map((id, index) => [id, index]))
    return [...cms.projects].sort((a,b) => (rank.has(a.id) ? rank.get(a.id) : 99) - (rank.has(b.id) ? rank.get(b.id) : 99))
  }, [cms.projects, pitch])

  useEffect(() => {
    track('page_view', { pitch: pitch || 'default', prospect: prospect || undefined, source: cms.source })
  }, [pitch, prospect, cms.source])

  return (
    <div className="app-shell">
      <div className="global-noise" aria-hidden="true"/>
      <div className="cursor-glow" aria-hidden="true"/>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} setPaletteOpen={setPaletteOpen} whatsapp={karenWhatsapp}/>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} whatsapp={karenWhatsapp} projects={pitchProjects}/>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} whatsappNumber={karenNumber}/>
      <main>
        <Hero whatsapp={karenWhatsapp} pitch={pitch} prospect={prospect}/>
        <Manifesto/>
        <Work projects={pitchProjects} clientList={cms.clients}/>
        <StrategyOS projects={pitchProjects}/>
        <Reels items={cms.reels} clientList={cms.clients}/>
        <CaseSindpetshop/>
        <PixelPaper/>
        <Ecosystem/>
        <Toolchain/>
        <Solutions/>
        <Process/>
        <BehanceWall/>
        <Lab/>
        <People/>
        <Contact karenWhatsapp={karenWhatsapp} gustavoWhatsapp={gustavoWhatsapp} onBrief={() => { track('brief_started'); setBriefOpen(true) }}/>
      </main>
      <Footer/>
    </div>
  )
}
