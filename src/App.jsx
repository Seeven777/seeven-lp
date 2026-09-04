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
  touchpoints
} from './data'
import { useCmsContent } from './useCmsContent'

const externalArrow = '↗'
const downArrow = '↓'

function useExperience() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    let raf = 0
    const root = document.documentElement
    const updateScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1)
        const p = Math.min(1, Math.max(0, scrollY / max))
        root.style.setProperty('--scroll-progress', p.toFixed(4))
        root.style.setProperty('--scroll-pct', `${(p * 100).toFixed(2)}%`)
      })
    }

    const updatePointer = (event) => {
      root.style.setProperty('--pointer-x', `${event.clientX}px`)
      root.style.setProperty('--pointer-y', `${event.clientY}px`)
    }

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible')
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' })

    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el))
    addEventListener('scroll', updateScroll, { passive: true })
    addEventListener('pointermove', updatePointer, { passive: true })
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
      removeEventListener('scroll', updateScroll)
      removeEventListener('pointermove', updatePointer)
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
        <a href="#case-sindpetshop" onClick={() => setMenuOpen(false)}>Case</a>
        <a href="#solutions" onClick={() => setMenuOpen(false)}>O que resolvemos</a>
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

function CommandPalette({ open, onClose, whatsapp }) {
  const items = [
    ['01', 'Trabalhos selecionados', '#work'],
    ['02', '32 Reels', '#reels'],
    ['03', 'Case Sindpetshop-SP', '#case-sindpetshop'],
    ['04', 'Do pixel ao papel', '#pixel-paper'],
    ['05', 'Problemas que resolvemos', '#solutions'],
    ['06', 'Seeven Lab', '#lab'],
    ['07', 'Iniciar projeto', whatsapp]
  ]
  if (!open) return null
  return (
    <div className="palette-backdrop" onMouseDown={onClose} role="presentation">
      <div className="command-palette" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Navegação rápida">
        <div className="palette-top"><span>SEEVEN / INDEX</span><button onClick={onClose}>ESC</button></div>
        {items.map(([n, label, href]) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={onClose}>
            <span>{n}</span><strong>{label}</strong><i>↘</i>
          </a>
        ))}
      </div>
    </div>
  )
}

function Hero({ whatsapp }) {
  return (
    <section id="top" className="hero light-phase">
      <div className="hero-micro hero-micro-left"><span>EST. 20—</span><span>SÃO PAULO / BR</span></div>
      <div className="hero-micro hero-micro-right"><span>STRATEGY × DESIGN × TECH</span><span>SCROLL TO ENTER</span></div>

      <div className="hero-copy" data-reveal>
        <div className="eyebrow"><span className="status-dot"/> PRESENÇA, NÃO BARULHO.</div>
        <h1>
          <span>FAZEMOS</span>
          <span className="hero-outline">MARCAS</span>
          <span>PARAREM.</span>
        </h1>
        <div className="hero-bottomline">
          <p>Estratégia, design, conteúdo e tecnologia para construir marcas que continuam existindo quando a tela desliga.</p>
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

function ProjectVisual({ project, compact = false }) {
  const client = clients.find(c => c.id === project.clientId || c.name === project.client)
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
      {!cover && brandImage && <div className="project-brand-preview"><img src={brandImage} alt={`Marca ${project.client}`} onError={() => setBrandImage(client?.brandPoster || '')}/><span>{client?.handle || 'PUBLIC PRESENCE'}</span></div>}
      <div className="visual-corner">SEEVEN / {project.client}</div>
    </div>
  )
}

function Work({ projects = featuredProjects }) {
  return (
    <section id="work" className="work-section transition-phase section-shell">
      <div className="work-heading">
        <div className="index-label" data-reveal>02 — SELECTED WORK</div>
        <h2 data-reveal>OLHE PRIMEIRO.<br/><span>LEIA DEPOIS.</span></h2>
        <p data-reveal>Uma marca não deveria precisar de uma legenda para parecer boa.</p>
      </div>

      <div className="project-grid">
        {projects.map((project, index) => (
          <a key={project.id} href={project.href} target={project.href?.startsWith('http') ? '_blank' : undefined} rel={project.href?.startsWith('http') ? 'noreferrer' : undefined} className={`project-card project-${project.size}`} data-reveal style={{ '--delay': `${index * 35}ms` }}>
            <ProjectVisual project={project}/>
            <div className="project-meta">
              <div><span>{project.label}</span><strong>{project.client}</strong></div>
              <p>{project.title}</p>
              <i>{externalArrow}</i>
            </div>
          </a>
        ))}
      </div>

      <div className="work-principle" data-reveal>
        <span>PORTFÓLIO NÃO É UMA LISTA.</span>
        <strong>É PROVA.</strong>
      </div>
    </section>
  )
}

function instagramEmbedUrl(url = '') {
  if (!/instagram\.com\/(reel|p|tv)\//i.test(url)) return ''
  const clean = url.split('?')[0].replace(/\/+$/, '')
  return `${clean}/embed/`
}

function ReelPoster({ reel, index, large = false }) {
  const client = clients.find(c => c.id === reel.clientId)
  const initial = reel.poster || client?.publicCover || client?.brandPoster || ''
  const [src, setSrc] = useState(initial)
  const fallback = client?.brandPoster || ''
  const sourceType = reel.poster ? 'CAPA DO REEL' : client?.publicCover ? 'MÍDIA PÚBLICA' : 'IDENTIDADE DA MARCA'
  const mediaFit = reel.poster ? 'cover' : (client?.publicCoverFit || 'cover')

  useEffect(() => setSrc(reel.poster || client?.publicCover || client?.brandPoster || ''), [reel.poster, client?.publicCover, client?.brandPoster])

  return <div className={`reel-frame ${large ? 'is-large' : ''}`}>
    {src ? <img className="reel-poster" src={src} alt={`Capa de ${reel.client}`} loading="lazy" style={{ objectFit: mediaFit, background: mediaFit === 'contain' ? '#f4f2ee' : undefined }} onError={() => src !== fallback ? setSrc(fallback) : setSrc('')}/> : <div className="reel-background"/>}
    <div className="reel-poster-shade"/>
    <div className="reel-source-badge">{sourceType}</div>
    <div className="reel-index">{String(index + 1).padStart(2, '0')}</div>
    <div className="reel-brand-label"><strong>{reel.client}</strong><span>{client?.handle}</span></div>
    <div className="reel-play">▶</div>
  </div>
}

function ReelCard({ reel, index, onOpen }) {
  const client = clients.find(c => c.id === reel.clientId)
  return (
    <button className={`reel-card reel-${reel.clientId}`} onClick={() => onOpen(reel)} data-reveal style={{ '--reel-accent': reel.accent, '--delay': `${(index % 8) * 24}ms` }}>
      <ReelPoster reel={reel} index={index}/>
      <div className="reel-meta"><strong>{reel.client}</strong><span>{reel.title} · {client?.category}</span></div>
    </button>
  )
}

function Reels({ items = reels }) {
  const [filter, setFilter] = useState('all')
  const [active, setActive] = useState(null)
  const filters = ['all', ...new Set(items.map(r => r.clientId))]
  const visible = filter === 'all' ? items : items.filter(r => r.clientId === filter)
  const explicitFeatured = items.filter(item => item.featured)
  const fallbackFeatured = Array.from(new Map(items.map(item => [item.clientId, item])).values()).slice(0, 5)
  const featured = (explicitFeatured.length ? explicitFeatured : fallbackFeatured).slice(0, 5)
  const activeClient = active ? clients.find(c => c.id === active.clientId) : null
  const embed = active ? instagramEmbedUrl(active.url) : ''
  const activePoster = active?.poster || activeClient?.publicCover || activeClient?.brandPoster || ''

  return (
    <section id="reels" className="reels-section dark-phase section-shell">
      <div className="reel-heading">
        <div><div className="index-label" data-reveal>03 — MOTION ARCHIVE</div><h2 data-reveal>32 REELS.<br/><span>11 LINGUAGENS.</span></h2></div>
        <p data-reveal>O mesmo formato. Marcas completamente diferentes. A linguagem deve servir ao projeto — nunca o contrário.</p>
      </div>

      {featured.length > 0 && <div className="motion-highlights" data-reveal>
        <div className="motion-highlights-top"><span>DESTAQUES / CAPAS VISÍVEIS</span><p>Os destaques usam a capa real cadastrada; quando ela ainda não existe, exibem mídia pública da marca ou um fallback editorial identificado.</p></div>
        <div className="motion-highlights-grid">
          {featured.map((reel, index) => <button key={reel.id} className="motion-highlight-card" onClick={() => setActive(reel)} style={{ '--reel-accent': reel.accent }}>
            <ReelPoster reel={reel} index={index} large/>
            <div className="motion-highlight-copy"><span>{clients.find(c => c.id === reel.clientId)?.category}</span><strong>{reel.client}</strong><p>{reel.publicContext || 'Direção visual adaptada à linguagem e ao público da marca.'}</p></div>
          </button>)}
        </div>
      </div>}

      <div className="filter-row" data-reveal>
        {filters.map(id => {
          const client = clients.find(c => c.id === id)
          return <button key={id} className={filter === id ? 'active' : ''} onClick={() => setFilter(id)}>{id === 'all' ? `Todos / ${items.length}` : (client?.name || visible.find(r => r.clientId === id)?.client || id)}</button>
        })}
      </div>

      <div className="reel-grid">
        {visible.map((reel, index) => <ReelCard key={reel.id} reel={reel} index={index} onOpen={setActive}/>) }
      </div>
      <p className="asset-note" data-reveal><span>MÍDIA EM CAMADAS</span> A ordem agora é: <code>poster do Reel</code> → <code>mídia pública da marca</code> → <code>capa editorial local</code>. Se a URL cadastrada for de um Reel/post público do Instagram, o modal tenta carregar o embed automaticamente.</p>

      {active && <div className="reel-modal" onMouseDown={() => setActive(null)}>
        <div className="reel-modal-card" onMouseDown={e => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setActive(null)}>FECHAR ×</button>
          <div className="modal-media">
            {active.video ? <video src={active.video} controls autoPlay playsInline poster={activePoster}/> : embed ? <iframe className="instagram-embed-frame" src={embed} title={`${active.client} — ${active.title}`} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture" loading="lazy"/> : <div className="modal-cover-preview" style={{ '--reel-accent': active.accent }}>
              {activePoster && <img src={activePoster} alt={`Capa de ${active.client}`} style={{ objectFit: active?.poster ? 'cover' : (activeClient?.publicCoverFit || 'cover'), background: activeClient?.publicCoverFit === 'contain' ? '#f4f2ee' : undefined }}/>}<div className="modal-cover-overlay"><b>{active.client}</b><span>{activeClient?.handle}</span><p>Este item ainda aponta para o perfil da marca. Ao cadastrar a URL exata de um Reel público ou um arquivo de vídeo, ele passa a abrir aqui.</p></div>
            </div>}
          </div>
          <div className="modal-bottom"><div><span>REEL / {String(active.id).toUpperCase()}</span><strong>{active.client}</strong></div><a href={active.url || activeClient?.url} target="_blank" rel="noreferrer">Abrir fonte pública {externalArrow}</a></div>
        </div>
      </div>}
    </section>
  )
}

function CaseSindpetshop() {
  return (
    <section id="case-sindpetshop" className="case-section dark-phase section-shell">
      <div className="case-intro" data-reveal>
        <div className="index-label">04 — CASE STUDY / SINDPETSHOP-SP</div>
        <span className="case-super">UM CASE<br/>DIFÍCIL.</span>
        <h2>COMUNICAÇÃO SINDICAL<br/><em>NÃO É FÁCIL.</em></h2>
        <p>Quando a informação é complexa, o design não pode decorar. Ele precisa organizar, traduzir e conduzir.</p>
      </div>

      <div className="case-journey" data-reveal>
        {['Estratégia','Identidade','Conteúdo','Site','Campanhas','Performance','Presença'].map((item, i) => <div key={item}><span>0{i+1}</span><strong>{item}</strong></div>)}
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
      <p className="stat-source" data-reveal>Recortes de agosto de 2026. Métricas apresentadas separadamente conforme os períodos de origem.</p>

      <div className="case-closing" data-reveal>
        <span>O resultado não é “um feed bonito”.</span>
        <strong>É UM SISTEMA DE COMUNICAÇÃO.</strong>
      </div>
    </section>
  )
}

function PixelPaper() {
  return (
    <section id="pixel-paper" className="pixel-paper dark-phase section-shell">
      <div className="pixel-heading"><div className="index-label" data-reveal>05 — PHYSICAL / DIGITAL</div><h2 data-reveal>DO PIXEL<br/><span>AO PAPEL.</span></h2><p data-reveal>Uma marca não vive em um único lugar. Por isso, pensamos o sistema antes da peça.</p></div>
      <div className="art-direction-table" data-reveal>
        <div className="table-grid"/>
        <div className="paper poster-piece"><span>CAMPAIGN</span><strong>MAKE<br/>IT<br/>STOP.</strong><i>SEE7VEN</i></div>
        <div className="paper card-piece"><span>SEEVEN / 07</span><b>Presence<br/>systems.</b><i>→</i></div>
        <div className="badge-piece"><div>7</div><span>CREATIVE<br/>DIRECTION</span></div>
        <div className="phone-piece"><div className="phone-island"/><small>SEE7VEN</small><strong>YOUR BRAND<br/>COULD BE<br/>HERE.</strong><span>SWIPE ↑</span></div>
        <div className="fold-piece"><span>01</span><strong>DIGITAL</strong><i>×</i><strong>PHYSICAL</strong><b>ONE BRAND.</b></div>
        <div className="table-note note-a">BRAND SYSTEM / 01</div><div className="table-note note-b">MATERIAL STUDY / 07</div>
      </div>
    </section>
  )
}

function Ecosystem() {
  return (
    <section className="ecosystem dark-phase section-shell">
      <div className="ecosystem-copy" data-reveal><div className="index-label">06 — BRAND ECOSYSTEM</div><h2>UMA MARCA.<br/><span>VÁRIOS PONTOS<br/>DE CONTATO.</span></h2><p>O cliente não diferencia “social”, “site”, “impresso” ou “Google”. Ele só percebe se tudo parece fazer parte da mesma marca.</p></div>
      <div className="ecosystem-orbit" data-reveal>
        <div className="ecosystem-core"><span>SEE7VEN</span><strong>MARCA</strong><i>∞</i></div>
        {touchpoints.map((item, index) => <span className={`touchpoint touch-${index+1}`} key={item}>{item}</span>)}
        <div className="ecosystem-ring ring-inner"/><div className="ecosystem-ring ring-outer"/>
      </div>
    </section>
  )
}

function Solutions() {
  const [active, setActive] = useState(0)
  return (
    <section id="solutions" className="solutions-section dark-phase section-shell">
      <div className="solutions-heading"><div className="index-label" data-reveal>07 — SOLUTIONS</div><h2 data-reveal>QUAL PROBLEMA<br/><span>VOCÊ PRECISA RESOLVER?</span></h2></div>
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
      <div className="process-title"><div className="index-label" data-reveal>08 — PROCESS</div><h2 data-reveal>PROJETO NÃO<br/><span>É SÓ IMAGEM.</span></h2></div>
      <div className="process-track">
        {process.map(([n, title, text]) => <div className="process-step" key={n} data-reveal><span>{n}</span><strong>{title}</strong><p>{text}</p></div>)}
      </div>
    </section>
  )
}

function BehanceWall() {
  return (
    <section className="archive-section dark-phase section-shell">
      <div className="archive-heading"><div className="index-label" data-reveal>09 — VISUAL ARCHIVE</div><h2 data-reveal>PROJETOS QUE<br/><span>PEDEM TELA CHEIA.</span></h2></div>
      <div className="archive-wall">
        {behanceProjects.map((project, index) => <a href={project.url} className={`archive-tile archive-${project.theme}`} key={project.id} data-reveal style={{ '--delay': `${index * 30}ms` }}>
          <div className="archive-art"><span>{String(project.id).padStart(2,'0')}</span><b>{project.title.split(' ').slice(0,2).join(' ')}</b><i>SEEVEN ARCHIVE</i></div>
          <div className="archive-meta"><strong>{project.title}</strong><span>{project.client} {externalArrow}</span></div>
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
      <div className="lab-copy"><div className="index-label" data-reveal>10 — SEE7VEN LAB</div><h2 data-reveal>TAMBÉM CRIAMOS<br/><span>O QUE AINDA NÃO EXISTE.</span></h2><p data-reveal>3D, motion, interfaces, protótipos, conceitos e experimentos que expandem o repertório antes de virarem solução comercial.</p><div className="lab-tags" data-reveal>{['3D','MOTION','INTERFACE','EXPERIMENT','PROTOTYPE'].map(t => <span key={t}>{t}</span>)}</div></div>
    </section>
  )
}

function People() {
  return (
    <section className="people-section dark-phase section-shell">
      <div className="people-heading"><div className="index-label" data-reveal>11 — PEOPLE</div><h2 data-reveal>POR TRÁS DA SEE7VEN,<br/><span>TEM GENTE.</span></h2></div>
      <div className="people-grid">
        <article data-reveal><span className="person-index">K / 01</span><div className="person-portrait portrait-k"><b>K</b></div><div><strong>KAREN</strong><p>Relacionamento, operação e projetos.</p></div></article>
        <article data-reveal><span className="person-index">G / 02</span><div className="person-portrait portrait-g"><b>G</b></div><div><strong>GUSTAVO</strong><p>Estratégia, direção e desenvolvimento.</p></div></article>
      </div>
    </section>
  )
}

function Contact({ karenWhatsapp, gustavoWhatsapp }) {
  return (
    <section id="contact" className="contact-section final-phase section-shell">
      <div className="contact-glow"/>
      <div className="index-label" data-reveal>12 — NEXT PROJECT</div>
      <h2 data-reveal>SEU PROJETO<br/><span>PODERIA ESTAR AQUI.</span></h2>
      <p data-reveal>Vamos descobrir o que sua marca poderia ser — e construir uma presença que prove isso.</p>
      <div className="contact-actions" data-reveal>
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
  const karenNumber = import.meta.env.VITE_KAREN_WHATSAPP || '5511971493985'
  const gustavoNumber = import.meta.env.VITE_GUSTAVO_WHATSAPP || ''
  const message = encodeURIComponent('Olá! Conheci a Seeven e quero conversar sobre um projeto.')
  const karenWhatsapp = `https://wa.me/${karenNumber}?text=${message}`
  const gustavoWhatsapp = gustavoNumber ? `https://wa.me/${gustavoNumber}?text=${message}` : karenWhatsapp

  return (
    <div className="app-shell">
      <div className="global-noise" aria-hidden="true"/>
      <div className="cursor-glow" aria-hidden="true"/>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} setPaletteOpen={setPaletteOpen} whatsapp={karenWhatsapp}/>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} whatsapp={karenWhatsapp}/>
      <main>
        <Hero whatsapp={karenWhatsapp}/>
        <Manifesto/>
        <Work projects={cms.projects}/>
        <Reels items={cms.reels}/>
        <CaseSindpetshop/>
        <PixelPaper/>
        <Ecosystem/>
        <Solutions/>
        <Process/>
        <BehanceWall/>
        <Lab/>
        <People/>
        <Contact karenWhatsapp={karenWhatsapp} gustavoWhatsapp={gustavoWhatsapp}/>
      </main>
      <Footer/>
    </div>
  )
}
