import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCmsContent } from './useCmsContent'
import { caseStudies, projectIntelligence } from './data'

const WA_KAREN = '5511971493985'
const WA_GUSTAVO = '5511920626850'
const arrow = '↗'

const capabilityGroups = [
  {
    id: 'brand', label: 'Estratégia & Marca', accent: '#c9ff32',
    lead: 'A ideia que organiza tudo antes da primeira peça.',
    items: ['Posicionamento', 'Naming', 'Identidade visual', 'Brandbook', 'Direção criativa', 'Copy & campanha']
  },
  {
    id: 'digital', label: 'Digital & Produto', accent: '#7b61ff',
    lead: 'Experiências digitais que explicam, vendem e funcionam.',
    items: ['Sites institucionais', 'Landing pages', 'E-commerce', 'UI/UX', 'Sistemas', 'Analytics']
  },
  {
    id: 'growth', label: 'Conteúdo & Performance', accent: '#ff7a1a',
    lead: 'Presença recorrente com mensagem, distribuição e leitura de resultado.',
    items: ['Planejamento', 'Social media', 'Criativos', 'Tráfego pago', 'SEO', 'Campanhas']
  },
  {
    id: 'motion', label: 'Motion & Audiovisual', accent: '#73cfff',
    lead: 'Quando a ideia precisa ganhar ritmo, som e tempo.',
    items: ['Reels', 'Vídeo institucional', 'Captação', 'Edição', 'Motion 2D/3D', 'Comerciais']
  },
  {
    id: 'physical', label: 'Físico & Experiência', accent: '#f4c63d',
    lead: 'A marca continua existindo quando a tela termina.',
    items: ['Impressos', 'PDV', 'Embalagens', 'Sinalização', 'Eventos', 'Cenografia & brindes']
  },
  {
    id: 'tech', label: 'Tecnologia & Automação', accent: '#58f5d0',
    lead: 'Integrações e inteligência para a operação não depender de improviso.',
    items: ['Dashboards', 'Automações', 'Integrações', 'Formulários', 'CRM & jornadas', 'IA aplicada']
  }
]

function track(event, detail = {}) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...detail })
  } catch (_) {}
}

function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)) }

function useScrollDirector(ref, scale = 1, onProgress) {
  const callbackRef = useRef(onProgress)
  callbackRef.current = onProgress
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const raw = clamp((-rect.top) / travel)
      el.style.setProperty('--p', String(clamp(raw * scale)))
      callbackRef.current?.(raw)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref, scale])
}

function usePointerMotion(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return undefined
    let raf = 0
    let lastEvent = null
    const paint = () => {
      raf = 0
      if (!lastEvent) return
      const x = ((lastEvent.clientX / window.innerWidth) - .5) * 18
      const y = ((lastEvent.clientY / window.innerHeight) - .5) * 14
      el.style.setProperty('--mx', `${x.toFixed(2)}px`)
      el.style.setProperty('--my', `${y.toFixed(2)}px`)
      el.style.setProperty('--mx-bg', `${(-x * .35).toFixed(2)}px`)
      el.style.setProperty('--my-bg', `${(-y * .35).toFixed(2)}px`)
    }
    const move = event => { lastEvent = event; if (!raf) raf = requestAnimationFrame(paint) }
    const reset = () => { el.style.setProperty('--mx', '0px'); el.style.setProperty('--my', '0px'); el.style.setProperty('--mx-bg', '0px'); el.style.setProperty('--my-bg', '0px') }
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('mouseleave', reset)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('mouseleave', reset) }
  }, [ref])
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [locked])
}

function safeLink(value = '') {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch (_) { return '' }
}

function setMeta(name, content, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let node = document.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(property ? 'property' : 'name', name)
    document.head.appendChild(node)
  }
  node.setAttribute('content', content)
}

function setCanonical(url) {
  let node = document.querySelector('link[rel="canonical"]')
  if (!node) {
    node = document.createElement('link')
    node.rel = 'canonical'
    document.head.appendChild(node)
  }
  node.href = url
}

function SmartImage({ src, alt = '', ...props }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src || failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} decoding="async" {...props}/>
}

function LogoMark() {
  return <span className="v10-logo" aria-label="Seeven"><i>7</i><b>SEE7VEN</b></span>
}

function normalizeText(value = '') { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ') }

function isFallbackPoster(value = '') { return /\/assets\/posters\/reel-\d+\.jpg/i.test(String(value || '')) }
function hueFrom(value = '') { return [...String(value)].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) % 360, 210) }

function pickVisual(project, clients, behance) {
  if (!project) return ''
  if (project.cover) return project.cover
  const client = clients.find(c => c.id === project.clientId) || {}
  const needle = normalizeText(project.client || client.name)
  const related = behance.find(item => {
    const hay = normalizeText(`${item.client || ''} ${item.title || ''}`)
    return needle && (hay.includes(needle) || needle.split(' ').some(word => word.length > 4 && hay.includes(word)))
  })
  return related?.cover || client.publicCover || client.brandPoster || ''
}

function Header({ onBrief }) {
  const [open, setOpen] = useState(false)
  useBodyLock(open)
  return <>
    <header className="v10-header">
      <a href="#top" className="v10-brand"><LogoMark/></a>
      <nav className="v10-nav" aria-label="Principal">
        <a href="#work">Projetos</a>
        <a href="#capabilities">O que fazemos</a>
        <a href="#system">Sistema</a>
        <a href="#partners">Rede</a>
        <a href="#contact">Contato</a>
      </nav>
      <button className="v10-start" onClick={() => onBrief()}>Começar projeto <span>{arrow}</span></button>
      <button className="v10-menu-btn" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'FECHAR' : 'MENU'}</button>
    </header>
    <div className={`v10-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="v10-menu-inner">
        <span className="v10-kicker">NAVEGAÇÃO</span>
        {[['01','Projetos','#work'],['02','O que fazemos','#capabilities'],['03','Como pensamos','#system'],['04','Motion','#motion'],['05','Parceiros','#partners'],['06','Contato','#contact']].map(([n,l,h]) => <a key={h} href={h} onClick={() => setOpen(false)}><small>{n}</small><strong>{l}</strong><span>↘</span></a>)}
        <button onClick={() => { setOpen(false); onBrief() }}>Tenho um projeto em mente <span>{arrow}</span></button>
      </div>
    </div>
  </>
}

function Hero({ projects, clients, behance }) {
  const ref = useRef(null)
  useScrollDirector(ref, 1.28)
  usePointerMotion(ref)
  const featured = useMemo(() => {
    const seen = new Set()
    return projects.filter(project => {
      const client = clients.find(c => c.id === project.clientId)
      if (!client || seen.has(client.id)) return false
      seen.add(client.id)
      return true
    }).slice(0, 5)
  }, [projects, clients])
  return <section className="v10-hero" id="top" ref={ref} style={{ '--p': 0, '--mx': '0px', '--my': '0px', '--mx-bg': '0px', '--my-bg': '0px' }}>
    <div className="v10-hero-sticky">
      <div className="v10-ambient"/>
      <div className="v10-hero-meta"><span>CREATIVE PRESENCE STUDIO</span><span>SÃO PAULO · BRASIL</span><span>ESTRATÉGIA → ENTREGA</span></div>
      <div className="v10-hero-copy">
        <span className="v10-kicker">ESTRATÉGIA · DESIGN · CONTEÚDO · TECNOLOGIA · PRODUÇÃO</span>
        <h1><span>TUDO QUE</span><span>UMA MARCA</span><em>PRECISA.</em></h1>
        <p>Uma única direção para transformar ideia em marca, site, conteúdo, campanha, vídeo, tecnologia, impresso, evento e presença real.</p>
        <div className="v10-hero-tags"><span>Branding</span><span>Web</span><span>Social</span><span>Motion</span><span>Performance</span><span>Físico</span><span>Tecnologia</span></div>
        <div className="v10-hero-actions"><a href="#work">Ver projetos <b>↓</b></a><a href="#capabilities">Ver tudo que fazemos <b>↘</b></a></div>
      </div>
      <div className="v10-orbit" aria-label="Projetos conectados pela Seeven">
        {featured.map((project, i) => {
          const client = clients.find(c => c.id === project.clientId) || {}
          const visual = pickVisual(project, clients, behance)
          const angle = (i / Math.max(featured.length, 1)) * Math.PI * 2
          const x = 50 + Math.cos(angle) * 37
          const y = 50 + Math.sin(angle) * 31
          return <a href="#work" className="v10-orbit-node" key={project.id} style={{ '--x': `${x}%`, '--y': `${y}%`, '--delay': i, '--accent': client.accent || '#c9ff32' }}>
            {visual ? <SmartImage src={visual} alt="" loading="lazy"/> : <i/>}
            <span>{client.name || project.client || 'Projeto'}</span>
          </a>
        })}
        <div className="v10-orbit-core"><LogoMark/><small>UM BRIEF<br/>MUITAS ENTREGAS</small></div>
        <div className="v10-orbit-caption"><span>ESTRATÉGIA</span><i>→</i><span>EXECUÇÃO</span><i>→</i><strong>PRESENÇA</strong></div>
      </div>
      <a href="#capabilities" className="v10-scroll-cue"><i/><span>Role para explorar</span></a>
    </div>
  </section>
}

function CapabilityUniverse({ onBrief }) {
  const [active, setActive] = useState(0)
  const group = capabilityGroups[active]
  return <section className="v10-universe" id="capabilities" style={{ '--accent': group.accent }}>
    <div className="v10-universe-head">
      <span className="v10-kicker">01 / O QUE FAZEMOS</span>
      <h2>Do pixel ao papel.<br/><em>E tudo entre eles.</em></h2>
      <p>Você não precisa chegar sabendo qual serviço contratar. Pode chegar com uma meta, um problema ou uma ideia. A gente monta o conjunto certo.</p>
    </div>
    <div className="v10-universe-shell">
      <div className="v10-universe-tabs" role="group" aria-label="Áreas de atuação">
        {capabilityGroups.map((item, i) => <button key={item.id} className={active === i ? 'is-active' : ''} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
          <small>0{i+1}</small><strong>{item.label}</strong><span>↗</span>
        </button>)}
      </div>
      <div className="v10-universe-detail">
        <div className="v10-universe-number">0{active+1}</div>
        <span className="v10-kicker">{group.label}</span>
        <h3>{group.lead}</h3>
        <div className="v10-universe-items">{group.items.map(item => <span key={item}>{item}</span>)}</div>
        <div className="v10-universe-flow"><span>BRIEF</span><i>→</i><span>{group.label}</span><i>→</i><strong>ENTREGA</strong></div>
        <button onClick={() => onBrief(group.label)}>Preciso disso {arrow}</button>
      </div>
    </div>
    <div className="v10-universe-foot"><span>UMA AGÊNCIA.</span><span>VÁRIAS DISCIPLINAS.</span><strong>UM SISTEMA.</strong></div>
  </section>
}

const systemNodes = [
  ['Estratégia','Direção antes da execução','Estratégia'],
  ['Branding','Identidade reconhecível','Branding'],
  ['Conteúdo','Consistência que se move','Social'],
  ['Web','Experiências que convertem','Web'],
  ['Motion','Ideias com ritmo','Vídeo'],
  ['Físico','Presença fora da tela','Eventos']
]

function PresenceSystem({ projects, clients, behance, onOpen }) {
  const ref = useRef(null)
  const [scrollActive, setScrollActive] = useState(0)
  useScrollDirector(ref, 1, progress => {
    const next = Math.min(systemNodes.length - 1, Math.floor(clamp(progress * 1.01) * systemNodes.length))
    setScrollActive(current => current === next ? current : next)
  })
  const [manual, setManual] = useState(null)
  const active = manual ?? scrollActive
  const [title, desc, tag] = systemNodes[active]
  const related = projects.find(project => (project.tags || []).some(t => normalizeText(t).includes(normalizeText(tag)))) || projects[active] || projects[0]
  const visual = pickVisual(related, clients, behance)
  const relatedClient = clients.find(client => client.id === related?.clientId) || {}
  return <section className="v10-system" id="system" ref={ref} style={{ '--p': 0, '--system-accent': relatedClient.accent || '#7b61ff' }}>
    <div className="v10-system-sticky">
      <div className="v10-section-head">
        <span className="v10-kicker">02 / PRESENCE SYSTEM</span>
        <h2>Uma marca.<br/><em>Muitos pontos de contato.</em></h2>
        <p>O cliente não deveria sentir que contratou seis fornecedores. Estratégia, conteúdo, web, motion e físico precisam parecer uma única decisão.</p>
        <div className="v10-system-promise"><span>1</span><strong>direção</strong><i>→</i><span>6+</span><strong>frentes</strong><i>→</i><span>1</span><strong>marca</strong></div>
      </div>
      <div className="v10-network" aria-label="Mapa de capacidades">
        <button className="v10-network-preview" onClick={() => related && onOpen?.(related)} aria-label={related ? `Abrir projeto ${related.client}` : 'Ver projetos'}>
          {visual ? <SmartImage src={visual} alt="" loading="lazy"/> : null}
          <div><small>EXEMPLO REAL / {String(active+1).padStart(2,'0')}</small><strong>{relatedClient.name || related?.client || title}</strong><span>{related?.title || desc}</span><b>VER RACIOCÍNIO ↗</b></div>
        </button>
        <div className="v10-network-core"><b>SEE7VEN</b><small>ONE<br/>CONNECTED<br/>SYSTEM</small></div>
        {systemNodes.map(([nodeTitle,nodeDesc], i) => <button key={nodeTitle} onMouseEnter={() => setManual(i)} onMouseLeave={() => setManual(null)} onFocus={() => setManual(i)} onBlur={() => setManual(null)} onClick={() => setManual(i)} className={`v10-service-node n${i+1} ${i === active ? 'is-active' : ''}`}><span>{String(i+1).padStart(2,'0')}</span><b>{nodeTitle}</b><small>{nodeDesc}</small></button>)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 50 L18 20 M50 50 L50 13 M50 50 L82 22 M50 50 L17 76 M50 50 L50 88 M50 50 L84 76"/></svg>
        <small className="v10-network-hint">PASSE / TOQUE PARA EXPLORAR</small>
      </div>
      <div className="v10-system-count"><strong>0{active+1}</strong><span>/ 06</span></div>
    </div>
  </section>
}

function ProjectMedia({ project, client, visual }) {
  const cover = visual || project.cover || client?.publicCover || client?.brandPoster
  return <div className="v10-project-media" style={{ '--accent': client?.accent || project.accent || '#b7ff35' }}>
    {cover ? <SmartImage src={cover} alt="" loading="lazy"/> : null}
    <div className="v10-project-shape"><span>{project.client?.slice(0,1) || '7'}</span></div>
    <div className="v10-project-grid"/>
  </div>
}

function SelectedWork({ projects, clients, behance, onOpen }) {
  const top = projects.slice(0, 6)
  return <section className="v10-work" id="work">
    <div className="v10-work-intro">
      <span className="v10-kicker">03 / SELECTED WORK</span>
      <h2>Não mostramos<br/>só <em>peças.</em></h2>
      <p>Mostramos problemas, decisões e sistemas. Porque o visual é consequência do que a marca precisava resolver.</p>
    </div>
    <div className="v10-work-list">
      {top.map((project, i) => {
        const client = clients.find(c => c.id === project.clientId) || {}
        const visual = pickVisual(project, clients, behance)
        return <article className="v10-project" key={project.id} style={{ '--accent': client.accent || '#b7ff35' }}>
          <button className="v10-project-hit" onClick={() => onOpen(project)} aria-label={`Abrir case ${project.client}`}/>
          <div className="v10-project-index"><span>{String(i+1).padStart(2,'0')}</span><small>{project.label || 'PROJECT'}</small></div>
          <ProjectMedia project={project} client={client} visual={visual}/>
          <div className="v10-project-copy"><h3>{project.client}</h3><p>{project.title}</p><div>{(project.tags || []).slice(0,4).map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => onOpen(project)}>Ver raciocínio {arrow}</button></div>
        </article>
      })}
    </div>
  </section>
}

function WorkArchive({ clients, projects, onOpen }) {
  const visible = clients.slice(0, 12)
  return <section className="v10-archive" aria-labelledby="archive-title">
    <div className="v10-archive-head"><span className="v10-kicker">ARQUIVO / PRESENÇAS</span><h2 id="archive-title">Marcas diferentes.<br/><em>Problemas diferentes.</em></h2><p>Do institucional ao entretenimento, do food ao B2B. A direção muda com o contexto — não com uma fórmula pronta.</p></div>
    <div className="v10-archive-grid">
      {visible.map((client, index) => {
        const project = projects.find(row => row.clientId === client.id)
        const media = client.publicCover || client.brandPoster
        const clickable = Boolean(project)
        return <article className="v10-archive-card" key={client.id} style={{'--accent': client.accent || '#7b61ff','--i':index}}>
          <button disabled={!clickable} onClick={() => clickable && onOpen(project)} aria-label={clickable ? `Abrir projeto ${client.name}` : client.name}/>
          <div className="v10-archive-media">{media ? <SmartImage src={media} alt="" loading="lazy"/> : null}<i/></div>
          <div className="v10-archive-copy"><small>{String(index+1).padStart(2,'0')} / {client.category || 'PROJECT'}</small><strong>{client.name}</strong><span>{client.handle || 'SEE7VEN / PRESENCE'}</span><b>{clickable ? 'VER CASE ↗' : 'PRESENÇA SEE7VEN'}</b></div>
        </article>
      })}
    </div>
  </section>
}

function ThinkingBento({ behance }) {
  const visual = behance[4]?.cover || behance[0]?.cover || ''
  return <section className="v10-thinking">
    <div className="v10-thinking-head"><span className="v10-kicker">04 / COMO PENSAMOS</span><h2>Você chega com um problema.<br/><em>A gente conecta o resto.</em></h2></div>
    <div className="v10-thinking-bento">
      <div className="v10-thinking-left">
        {[['01','Informação demais','Muita coisa para dizer e pouca hierarquia para decidir o que vem primeiro.'],['02','Jornada confusa','Site, social, anúncio, atendimento e material físico parecem marcas diferentes.'],['03','Execução sem sistema','A produção cresce, mas a percepção da marca não cresce junto.']].map(([n,t,d]) => <article key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></article>)}
        <div className="v10-thinking-chart"><strong>Challenge</strong><svg viewBox="0 0 260 100" aria-hidden="true"><path d="M8 84 L48 64 L88 72 L128 40 L168 51 L208 18 L252 30"/><line x1="8" y1="84" x2="252" y2="84"/></svg><small>RUÍDO → CLAREZA</small></div>
      </div>
      <div className="v10-thinking-visual">
        {visual ? <SmartImage src={visual} alt="Projeto Seeven" loading="lazy"/> : <div className="v10-thinking-silhouette"/>}
        <div className="v10-thinking-overlay"><LogoMark/><span>FOCUSED ACTIONS</span><strong>Menos ruído.<br/>Mais presença.</strong></div>
      </div>
      <div className="v10-thinking-right">
        <div className="v10-thinking-decision"><span>DESIGN DECISION</span><strong>Uma lógica antes<br/>de muitos formatos.</strong><i>7</i></div>
        <div className="v10-thinking-decisions">
          <p>Estratégia antes de produzir.</p>
          <p>Uma linguagem que funciona em todos os canais.</p>
          <p>Execução do digital ao físico sem perder consistência.</p>
        </div>
      </div>
    </div>
  </section>
}

function Capabilities({ services, onBrief }) {
  const [active, setActive] = useState(0)
  const fallback = [
    { problem: 'Quero vender mais.', answer: 'Estratégia, mídia, conteúdo e uma jornada digital que leve interesse até ação.', stack: ['Performance','Conteúdo','Landing page'] },
    { problem: 'Minha marca parece pequena.', answer: 'Posicionamento e consistência para a percepção acompanhar a qualidade do que você entrega.', stack: ['Branding','Direção','Sistema'] },
    { problem: 'Ninguém entende o que fazemos.', answer: 'Mensagem, hierarquia e experiência para tornar o complexo simples de comprar.', stack: ['Estratégia','Copy','Web'] }
  ]
  const items = (services?.length ? services : fallback).slice(0, 6)
  const safeActive = Math.min(active, Math.max(items.length - 1, 0))
  const item = items[safeActive] || fallback[0]
  return <section className="v10-capabilities">
    <div className="v10-cap-title"><span className="v10-kicker">05 / COMECE PELO PROBLEMA</span><h2>Não sabe o nome<br/>do serviço? <em>Melhor ainda.</em></h2></div>
    <div className="v10-cap-grid">
      <div className="v10-cap-menu">{items.map((row,i) => <button key={`${row.problem}-${i}`} className={safeActive===i?'is-active':''} onClick={() => setActive(i)}><small>0{i+1}</small><strong>{row.problem}</strong><span>+</span></button>)}</div>
      <div className="v10-cap-detail"><span className="v10-kicker">RESPOSTA / {String(safeActive+1).padStart(2,'0')}</span><h3>{item.problem}</h3><p>{item.answer}</p><div>{(item.stack || []).map(x => <span key={x}>{x}</span>)}</div><button onClick={() => onBrief(item.problem)}>Vamos resolver isso {arrow}</button></div>
    </div>
  </section>
}

function Motion({ reels, clients, behance }) {
  const items = reels.slice(0, 10)
  return <section className="v10-motion" id="motion">
    <div className="v10-motion-head"><span className="v10-kicker">06 / MOTION & CONTENT</span><h2>Algumas ideias<br/><em>precisam se mover.</em></h2><p>Campanha, conteúdo e vídeo entram quando ritmo é a melhor forma de transformar atenção em lembrança.</p></div>
    <div className="v10-motion-stage">
      {items.map((reel,i) => {
        const client = clients.find(c=>c.id===reel.clientId)||{}
        const related = behance.find(item => {
          const hay = normalizeText(`${item.client || ''} ${item.title || ''}`)
          const needle = normalizeText(reel.client || client.name).split(' ').filter(word => word.length > 3)
          return needle.some(word => hay.includes(word))
        }) || behance[i % Math.max(behance.length, 1)]
        const ownPoster = reel.poster && !isFallbackPoster(reel.poster) ? reel.poster : ''
        const poster = ownPoster || related?.cover || client.publicCover || client.brandPoster || reel.poster
        const direct = safeLink(reel.permalink || reel.video)
        const href = direct || safeLink(related?.url || reel.url || client.url)
        return <a key={reel.id} href={href||'#work'} target={href?'_blank':undefined} rel="noreferrer" className={`v10-motion-card ${i===0?'is-featured':''}`} style={{'--accent':reel.accent||client.accent||'#765bff'}}>
          <div>{poster ? <SmartImage src={poster} alt="" loading="lazy"/> : <span className="v10-motion-seven">7</span>}<i>{direct ? '▶' : '↗'}</i><em>{String(i+1).padStart(2,'0')}</em><b className="v10-motion-type">{direct ? 'WATCH' : 'VISUAL ARCHIVE'}</b></div>
          <small>{reel.client || client.name || related?.client}</small><strong>{reel.title || related?.title || 'Destaque da marca'}</strong>
        </a>
      })}
    </div>
  </section>
}

function Proof({ behance, clients }) {
  const visualItems = behance.slice(0, 7)
  return <section className="v10-proof">
    <div className="v10-proof-copy"><span className="v10-kicker">07 / DO DIGITAL AO FÍSICO</span><h2>Uma ideia.<br/><em>Vários formatos.</em></h2><p>Site, campanha, feed, vídeo, apresentação, impresso, evento, sinalização. O formato muda. A lógica da marca continua.</p></div>
    <div className="v10-proof-wall">
      {visualItems.map((item,i) => <a key={item.id || i} href={safeLink(item.url)||'#work'} target={safeLink(item.url)?'_blank':undefined} rel="noreferrer" className={`v10-proof-tile t${i+1}`}><SmartImage src={item.cover} alt={item.title || item.client || 'Projeto Seeven'} loading="lazy"/><span><small>{item.client}</small><strong>{item.title}</strong></span></a>)}
      <div className="v10-proof-tile v10-proof-cap"><strong>PIXEL</strong><span>↔</span><strong>PAPEL</strong><small>e tudo entre eles</small></div>
    </div>
    <div className="v10-proof-logos">{clients.slice(0,8).map(client => <span key={client.id}>{client.name}</span>)}</div>
  </section>
}

function CaseBentoStory({ project, study, intelligence, visual }) {
  const focus = intelligence?.focus || ['Clareza','Sistema','Escala']
  const signal = intelligence?.signal || [64,72,82,70,91,86]
  return <section className="v10-case-story">
    <div className="v10-case-story-head"><span className="v10-kicker">RACIOCÍNIO / CASE</span><h2>O visual é a última parte<br/>de uma <em>boa decisão.</em></h2></div>
    <div className="v10-case-story-grid">
      <div className="v10-case-story-left">
        {[
          ['01','Contexto', intelligence?.context || study.challenge],
          ['02','Insight', intelligence?.insight || 'Encontrar a ideia que simplifica decisões e organiza prioridades.'],
          ['03','Restrição', intelligence?.constraint || 'Resolver o problema sem criar ruído novo.']
        ].map(([n,t,d]) => <article key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></article>)}
        <div className="v10-case-signal"><span>CHALLENGE</span><div>{signal.map((value,i)=><i key={i} style={{height:`${Math.max(18,value)}%`}}/> )}</div><small>{focus.join(' · ')}</small></div>
      </div>
      <div className="v10-case-story-visual">
        {visual ? <SmartImage src={visual} alt="" loading="lazy"/> : null}
        <div><LogoMark/><small>{project.client}</small><strong>{intelligence?.objective || study.headline || project.title}</strong></div>
      </div>
      <div className="v10-case-story-right">
        <div className="v10-case-decision-hero"><span>DESIGN DECISION</span><strong>{intelligence?.decision || study.strategy}</strong><i>7</i></div>
        <div className="v10-case-decision-list">
          <p>{intelligence?.system || (study.execution || []).join(' → ')}</p>
          <p>{intelligence?.result || study.result}</p>
          <p>{(intelligence?.channels || study.execution || []).join(' · ')}</p>
        </div>
      </div>
    </div>
  </section>
}

function BentoCase({ project, clients, behance, onClose, onBrief }) {
  const client = clients.find(c => c.id === project.clientId) || {}
  const study = project.caseStudy || caseStudies[project.id] || {}
  const intelligence = projectIntelligence.find(item => item.id === project.id)
  const source = safeLink(study.source || project.href || client.website || client.url)
  const accent = study.accent || intelligence?.accent || client.accent || '#b7ff35'
  const visual = pickVisual(project, clients, behance)
  const gallery = behance.filter(item => {
    const a = normalizeText(item.client)
    const b = normalizeText(project.client)
    return b && (a.includes(b) || b.split(' ').some(word => word.length > 4 && a.includes(word)))
  }).slice(0,4)
  useBodyLock(Boolean(project))
  useEffect(() => {
    const close = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [onClose])
  return <div className="v10-case" role="dialog" aria-modal="true" aria-label={`Case ${project.client}`} style={{ '--accent': accent }}>
    <header><LogoMark/><button onClick={onClose}>Fechar <span>×</span></button></header>
    <main>
      <section className="v10-case-hero">
        <div><span className="v10-kicker">{study.eyebrow || project.label || 'CASE STUDY'}</span><h1>{study.headline || project.title}</h1><p>{study.intro || project.summary}</p><div className="v10-case-tags">{(study.execution || project.tags || []).map(item => <span key={item}>{item}</span>)}</div></div>
        <ProjectMedia project={project} client={client} visual={visual}/>
      </section>
      <CaseBentoStory project={project} study={study} intelligence={intelligence} visual={visual}/>
      {gallery.length ? <section className="v10-case-gallery"><div><span className="v10-kicker">PRESENÇA EM ESCALA</span><h2>Uma ideia não termina<br/>no primeiro formato.</h2></div><div>{gallery.map(item => <a key={item.id} href={safeLink(item.url)} target="_blank" rel="noreferrer"><SmartImage src={item.cover} alt={item.title} loading="lazy"/><span>{item.title}</span></a>)}</div></section> : null}
      <section className="v10-case-end"><div className="v10-case-end-top"><span>DO PIXEL AO PAPEL.</span><div className="v10-case-end-tags">{(study.execution || project.tags || []).slice(0,6).map(item=><span key={item}>{item}</span>)}</div></div><h2>Uma ideia só ganha força<br/>quando <em>vira presença.</em></h2><p>O case termina aqui. A lógica não: a mesma direção pode continuar em novos canais, formatos e pontos de contato.</p><div className="v10-case-end-actions">{source ? <a href={source} target="_blank" rel="noreferrer">Ver presença pública {arrow}</a> : null}<button onClick={() => { onClose(); onBrief(`Projeto parecido com ${project.client}`) }}>Quero construir algo assim {arrow}</button></div></section>
    </main>
  </div>
}

function PartnerAvatar({ partner }) {
  const label = String(partner.handle || partner.name || '7').replace(/^@/, '')
  const initials = label.split(/[._-]+/).filter(Boolean).slice(0,2).map(part => part[0]?.toUpperCase()).join('') || '7'
  return <span className="v10-partner-avatar" style={{'--h':hueFrom(label)}}>{partner.cover ? <SmartImage src={partner.cover} alt="" loading="lazy"/> : <b>{initials}</b>}</span>
}

function Partners({ partners = [] }) {
  const items = partners.filter(item => item.active !== false)
  const marquee = [...items, ...items]
  return <section className="v10-partners" id="partners">
    <div className="v10-partners-head">
      <div><span className="v10-kicker">08 / CREATIVE NETWORK</span><h2>O projeto cresce.<br/><em>A rede cresce junto.</em></h2></div>
      <div><p>Um contato, uma direção. Quando a entrega pede novos braços, conectamos parceiros à ideia sem transformar o projeto em um quebra-cabeça de fornecedores.</p><div className="v10-partner-stats"><span><strong>{items.length || 25}</strong> parceiros</span><span><strong>1</strong> direção</span><span><strong>∞</strong> combinações</span></div></div>
    </div>
    <div className="v10-partner-featured">
      {items.slice(0,6).map((partner,index)=><a href={safeLink(partner.url)||'#contact'} target={safeLink(partner.url)?'_blank':undefined} rel="noreferrer" key={partner.id || partner.handle} style={{'--i':index}}><PartnerAvatar partner={partner}/><div><small>PARTNER / NETWORK</small><strong>{partner.handle || partner.name}</strong><span>{partner.role || 'Parceiro Seeven'}</span></div><i>↗</i></a>)}
    </div>
    <div className="v10-partner-marquee" aria-label="Rede de parceiros Seeven"><div>{marquee.map((partner,index)=><a href={safeLink(partner.url)||'#contact'} target={safeLink(partner.url)?'_blank':undefined} rel="noreferrer" key={`${partner.id || partner.handle}-${index}`}><span>{partner.handle || partner.name}</span><i>↗</i></a>)}</div></div>
    <p className="v10-partner-note">A rede é modular: entra quando o projeto precisa. A direção criativa continua centralizada na Seeven.</p>
  </section>
}

function Contact({ onBrief }) {
  const text = encodeURIComponent('Olá! Conheci a Seeven pelo site e quero conversar sobre um projeto.')
  const quick = ['Projeto 360° / várias frentes','Marca / identidade','Site / landing / sistema','Campanha / mídia','Conteúdo / social','Vídeo / motion','Impresso / evento','Ainda não sei']
  return <section className="v10-contact" id="contact">
    <span className="v10-kicker">09 / START SOMETHING</span>
    <h2>O que a sua marca<br/><em>precisa agora?</em></h2>
    <p>Escolha um ponto de partida ou simplesmente conte o problema. A gente organiza o resto.</p>
    <div className="v10-contact-quick">{quick.map(item => <button key={item} onClick={() => onBrief(item)}>{item}<span>+</span></button>)}</div>
    <button className="v10-contact-main" onClick={() => onBrief()}>Começar um projeto <span>{arrow}</span></button>
    <div className="v10-contact-people">
      <a href={`https://wa.me/${WA_GUSTAVO}?text=${text}`} target="_blank" rel="noreferrer"><small>DIREÇÃO</small><strong>Gustavo</strong><span>+55 11 92062-6850 {arrow}</span></a>
      <a href={`https://wa.me/${WA_KAREN}?text=${text}`} target="_blank" rel="noreferrer"><small>NOVOS PROJETOS</small><strong>Karen</strong><span>+55 11 97149-3985 {arrow}</span></a>
    </div>
  </section>
}

function Brief({ open, onClose, initial = '' }) {
  const [step,setStep] = useState(0)
  const [form,setForm] = useState({ need: initial, company:'', timing:'', name:'' })
  useBodyLock(open)
  useEffect(() => { if (open) { setStep(0); setForm(v => ({...v, need: initial || v.need})) } }, [open, initial])
  if (!open) return null
  const choices = ['Projeto 360° / várias frentes','Marca / identidade','Site / landing / sistema','Conteúdo / social','Campanha / mídia','Vídeo / motion','Impresso / evento','Tecnologia / automação','Ainda não sei']
  const send = () => {
    const message = `Olá! Quero conversar sobre um projeto com a Seeven.\n\nPreciso de: ${form.need || '-'}\nMarca/empresa: ${form.company || '-'}\nPrazo: ${form.timing || '-'}\nMeu nome: ${form.name || '-'}`
    track('brief_completed', { need: form.need })
    window.open(`https://wa.me/${WA_KAREN}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    onClose()
  }
  return <div className="v10-brief" role="dialog" aria-modal="true" aria-label="Brief rápido">
    <header><LogoMark/><button onClick={onClose}>Fechar ×</button></header>
    <div className="v10-brief-progress"><i style={{width:`${((step+1)/4)*100}%`}}/></div>
    <div className="v10-brief-card">
      <span className="v10-kicker">BRIEF RÁPIDO · 0{step+1}/04</span>
      {step===0 && <><h2>O que precisamos<br/>construir?</h2><div className="v10-choice-grid">{choices.map(x=><button className={form.need===x?'is-active':''} key={x} onClick={()=>setForm({...form,need:x})}>{x}<span>+</span></button>)}</div></>}
      {step===1 && <><h2>Para qual marca<br/>ou empresa?</h2><input autoFocus value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Nome da marca / empresa"/></>}
      {step===2 && <><h2>Quando isso precisa<br/>estar no mundo?</h2><div className="v10-choice-grid">{['O quanto antes','30–60 dias','2–4 meses','Sem prazo definido'].map(x=><button className={form.timing===x?'is-active':''} key={x} onClick={()=>setForm({...form,timing:x})}>{x}<span>+</span></button>)}</div></>}
      {step===3 && <><h2>Como podemos<br/>chamar você?</h2><input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Seu nome"/></>}
      <a className="v10-brief-direct" href={`https://wa.me/${WA_KAREN}?text=${encodeURIComponent('Olá! Vim pelo site da Seeven e prefiro conversar direto sobre meu projeto.')}`} target="_blank" rel="noreferrer">Prefiro conversar direto no WhatsApp ↗</a><div className="v10-brief-actions"><button disabled={step===0&&!form.need} onClick={()=> step>0 ? setStep(step-1) : onClose()}>← Voltar</button><button onClick={()=>step<3?setStep(step+1):send()}>{step<3?'Continuar →':'Enviar no WhatsApp ↗'}</button></div>
    </div>
  </div>
}

function Footer() {
  return <footer className="v10-footer"><LogoMark/><div><a href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">Behance {arrow}</a><a href="#top">Voltar ao topo ↑</a></div><small>© {new Date().getFullYear()} SEE7VEN · PRESENCE FROM PIXEL TO PAPER.</small></footer>
}

export default function App() {
  const cms = useCmsContent()
  const [caseProject,setCaseProject] = useState(null)
  const [brief,setBrief] = useState(false)
  const [briefPreset,setBriefPreset] = useState('')
  const openBrief = (preset='') => { setBriefPreset(preset); setBrief(true); track('brief_started',{preset:preset||undefined}) }
  const openCase = (project, source='site', push=true) => {
    if (!project) return
    setCaseProject(project)
    if (push && window.location.pathname !== `/work/${project.id}`) history.pushState({case:project.id},'',`/work/${encodeURIComponent(project.id)}`)
    track('case_opened',{project:project.id,source})
  }
  const closeCase = (push=true) => {
    setCaseProject(null)
    if (push && /^\/work\//.test(window.location.pathname)) history.pushState({},'',`/${window.location.search || ''}${window.location.hash || ''}`)
  }

  useEffect(() => {
    document.documentElement.classList.add('seeven-v10')
    const meta = document.querySelector('meta[name="theme-color"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name:'theme-color' }))
    meta.content = '#0a0a0a'
    return () => document.documentElement.classList.remove('seeven-v10')
  }, [])

  useEffect(() => { track('page_view',{source:cms.source,version:'v10.3'}) }, [cms.source])

  useEffect(() => {
    const resolvePath = () => {
      const match = decodeURIComponent(window.location.pathname).match(/^\/work\/([^/]+)\/?$/)
      if (!match) { setCaseProject(null); return }
      const project = cms.projects.find(item => item.id === match[1])
      if (project) setCaseProject(project)
    }
    resolvePath()
    window.addEventListener('popstate', resolvePath)
    return () => window.removeEventListener('popstate', resolvePath)
  }, [cms.projects])

  useEffect(() => {
    const defaultTitle = 'SEE7VEN — Creative Presence Studio'
    const defaultDescription = 'Estratégia, branding, web, conteúdo, motion, performance, tecnologia e presença física conectadas em um único sistema.'
    if (caseProject) {
      const description = caseProject.summary || caseProject.title || defaultDescription
      const client = cms.clients.find(item => item.id === caseProject.clientId) || {}
      const visual = pickVisual(caseProject, cms.clients, cms.behance)
      const image = visual ? (visual.startsWith('http') ? visual : `${window.location.origin}${visual.startsWith('/') ? '' : '/'}${visual}`) : `${window.location.origin}/og-see7ven.png`
      const canonical = `${window.location.origin}/work/${encodeURIComponent(caseProject.id)}`
      document.title = `${caseProject.client} — Case SEE7VEN`
      setMeta('description', description)
      setMeta('og:title', document.title, true)
      setMeta('og:description', description, true)
      setMeta('og:url', canonical, true)
      setMeta('og:image', image, true)
      setMeta('twitter:title', document.title)
      setMeta('twitter:description', description)
      setMeta('twitter:image', image)
      setCanonical(canonical)
    } else {
      document.title = defaultTitle
      const canonical = window.location.origin + '/'
      const image = `${window.location.origin}/og-see7ven.png`
      setMeta('description', defaultDescription)
      setMeta('og:title', defaultTitle, true)
      setMeta('og:description', defaultDescription, true)
      setMeta('og:url', canonical, true)
      setMeta('og:image', image, true)
      setMeta('twitter:title', defaultTitle)
      setMeta('twitter:description', defaultDescription)
      setMeta('twitter:image', image)
      setCanonical(canonical)
    }
  }, [caseProject, cms.clients, cms.behance])

  return <div className="v10-shell">
    <Header onBrief={openBrief}/>
    <main>
      <Hero projects={cms.projects} clients={cms.clients} behance={cms.behance}/>
      <CapabilityUniverse onBrief={openBrief}/>
      <PresenceSystem projects={cms.projects} clients={cms.clients} behance={cms.behance} onOpen={p=>openCase(p,'presence_system')}/>
      <SelectedWork projects={cms.projects} clients={cms.clients} behance={cms.behance} onOpen={p=>openCase(p,'selected_work')}/>
      <WorkArchive clients={cms.clients} projects={cms.projects} onOpen={p=>openCase(p,'archive')}/>
      <ThinkingBento behance={cms.behance}/>
      <Capabilities services={cms.services} onBrief={openBrief}/>
      <Motion reels={cms.reels} clients={cms.clients} behance={cms.behance}/>
      <Proof behance={cms.behance} clients={cms.clients}/>
      <Partners partners={cms.partners}/>
      <Contact onBrief={openBrief}/>
    </main>
    <Footer/>
    {caseProject ? <BentoCase project={caseProject} clients={cms.clients} behance={cms.behance} onClose={()=>closeCase()} onBrief={openBrief}/> : null}
    <Brief open={brief} onClose={()=>setBrief(false)} initial={briefPreset}/>
  </div>
}
