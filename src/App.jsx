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

function externalClientLink(client = {}) {
  return safeLink(client.website || client.url || '')
}

function jumpTo(target) {
  requestAnimationFrame(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function ExperienceGate({ projects = [], clients = [], behance = [] }) {
  const shouldShow = (() => { try { return typeof window !== 'undefined' && !/^\/work\//.test(window.location.pathname) && !window.sessionStorage.getItem('seeven:v10.5:intro') } catch (_) { return true } })()
  const [visible, setVisible] = useState(shouldShow)
  useBodyLock(visible)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)

  const preview = useMemo(() => projects.slice(0, 8).map(project => ({
    id: project.id,
    client: project.client,
    src: pickVisual(project, clients, behance)
  })).filter(item => item.src), [projects, clients, behance])

  useEffect(() => {
    if (!visible) return undefined
    let raf = 0
    const started = performance.now()
    const duration = 1050
    const tick = now => {
      const elapsed = now - started
      const value = Math.min(96, Math.round((elapsed / duration) * 100))
      setProgress(value)
      if (elapsed < duration) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const finish = async () => {
      const fontReady = (async () => { try { await document.fonts?.ready } catch (_) {} })()
      await Promise.all([fontReady, new Promise(resolve => setTimeout(resolve, duration))])
      cancelAnimationFrame(raf)
      setProgress(100)
      setTimeout(() => setReady(true), 160)
    }
    finish()
    return () => cancelAnimationFrame(raf)
  }, [visible])

  if (!visible) return null
  const enter = target => {
    if (leaving) return
    setLeaving(true)
    window.sessionStorage.setItem('seeven:v10.5:intro', '1')
    setTimeout(() => {
      setVisible(false)
      if (target) jumpTo(target)
    }, 430)
  }

  const panels = [
    { id:'about', label:'Quem somos', note:'Estratégia, criação e execução conectadas.', target:'#capabilities', samples: preview.slice(0,3) },
    { id:'projects', label:'Projetos', note:'Cases, sistemas e presença em contextos diferentes.', target:'#work', samples: preview.slice(2,6) },
    { id:'network', label:'Empresas & rede', note:'Marcas, parceiros e conexões que ampliam cada entrega.', target:'#brands', samples: preview.slice(5,8) }
  ]

  return <div className={`v105-gate ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`} aria-label="Introdução Seeven">
    <div className="v105-loader" aria-hidden={ready}>
      <LogoMark/>
      <div className="v105-loader-number">{String(progress).padStart(3,'0')}<span>%</span></div>
      <div className="v105-loader-line"><i style={{ width:`${progress}%` }}/></div>
      <small>{progress < 35 ? 'ORGANIZANDO PRESENÇA' : progress < 70 ? 'CONECTANDO PROJETOS' : 'PREPARANDO EXPERIÊNCIA'}</small>
    </div>
    <div className="v105-gateway" aria-hidden={!ready}>
      <header><LogoMark/><span>ESCOLHA UM ATALHO OU VEJA TUDO</span></header>
      <div className="v105-gateway-grid">
        {panels.map((panel,index) => <button key={panel.id} className={`v105-gateway-panel p${index+1}`} onClick={() => enter(panel.target)}>
          <small>0{index+1}</small><h2>{panel.label}</h2><p>{panel.note}</p><b>EXPLORAR ↗</b>
          <div className="v105-gateway-samples">{panel.samples.map((item,i)=><span key={item.id} style={{'--i':i}}><SmartImage src={item.src} alt=""/></span>)}</div>
        </button>)}
      </div>
      <button className="v105-gateway-all" onClick={() => enter('#top')}><span>VER TUDO</span><i>↓</i></button>
    </div>
  </div>
}

function Header({ onBrief }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  useBodyLock(open)
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      if (window.innerWidth > 900 || open) { setHidden(false); last = window.scrollY; return }
      const now = window.scrollY
      const delta = now - last
      if (Math.abs(delta) > 8) setHidden(now > 110 && delta > 0)
      last = now
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive:true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [open])
  return <>
    <header className={`v10-header ${hidden && !open ? 'is-hidden' : ''}`}>
      <a href="#top" className="v10-brand"><LogoMark/></a>
      <nav className="v10-nav" aria-label="Principal">
        <a href="#work">Projetos</a>
        <a href="#brands">Empresas</a>
        <a href="#capabilities">O que fazemos</a>
        <a href="#partners">Rede</a>
        <a href="#contact">Contato</a>
      </nav>
      <button className="v10-start" onClick={() => onBrief()}>Começar projeto <span>{arrow}</span></button>
      <button className="v10-menu-btn" aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen(v => !v)}>{open ? 'FECHAR' : 'MENU'}</button>
    </header>
    <div className={`v10-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="v10-menu-inner">
        <span className="v10-kicker">NAVEGAÇÃO</span>
        {[['01','Projetos','#work'],['02','Empresas','#brands'],['03','O que fazemos','#capabilities'],['04','Como conectamos','#system'],['05','Motion','#motion'],['06','Parceiros','#partners'],['07','Contato','#contact']].map(([n,l,h]) => <a key={h} href={h} onClick={() => setOpen(false)}><small>{n}</small><strong>{l}</strong><span>↘</span></a>)}
        <button onClick={() => { setOpen(false); onBrief() }}>Tenho um projeto em mente <span>{arrow}</span></button>
      </div>
    </div>
  </>
}

function Hero({ projects, clients, behance, onOpen }) {
  const ref = useRef(null)
  const [mapActive,setMapActive] = useState(false)
  useScrollDirector(ref, 1.06, progress => setMapActive(current => current === (progress > .43) ? current : progress > .43))
  usePointerMotion(ref)
  const priority = ['sindpetshop','eventos','czk','venancio','eazy','seon','mibis','pufinho']
  const featuredClients = useMemo(() => {
    const byId = new Map(clients.map(client => [client.id, client]))
    const ordered = priority.map(id => byId.get(id)).filter(Boolean)
    clients.forEach(client => { if (!ordered.some(row => row.id === client.id)) ordered.push(client) })
    return ordered.slice(0, 8)
  }, [clients])
  const positions = [[20,28],[49,15],[80,26],[14,60],[42,48],[72,52],[32,80],[68,82]]
  const openClient = client => {
    const project = projects.find(row => row.clientId === client.id)
    if (project) return onOpen?.(project)
    const href = externalClientLink(client)
    if (href) window.open(href, '_blank', 'noopener,noreferrer')
  }
  return <section className="v10-hero" id="top" ref={ref} style={{ '--p': 0, '--mx': '0px', '--my': '0px', '--mx-bg': '0px', '--my-bg': '0px' }}>
    <div className="v10-hero-sticky">
      <div className="v10-ambient"/>
      <div className="v10-hero-meta"><span>CREATIVE PRESENCE STUDIO</span><span>SÃO PAULO · BRASIL</span><span>ESTRATÉGIA → ENTREGA</span></div>
      <div className="v10-hero-copy">
        <span className="v10-kicker">ESTRATÉGIA · CRIAÇÃO · PRODUÇÃO · TECNOLOGIA</span>
        <h1><span>TUDO QUE</span><span>UMA MARCA</span><em>PRECISA.</em></h1>
        <p>Do nome ao site. Do conteúdo ao evento. Do anúncio ao impresso. Você traz o objetivo; a Seeven conecta o resto.</p>
        <div className="v10-hero-tags"><span>Branding</span><span>Web</span><span>Social</span><span>Motion</span><span>Performance</span><span>Físico</span><span>Tecnologia</span></div>
        <div className="v10-hero-actions"><a href="#work">Ver projetos <b>↓</b></a><a href="#capabilities">Ver tudo que fazemos <b>↘</b></a></div>
      </div>
      <div className="v105-brand-story">
        <span className="v10-kicker">MARCAS / CONTEXTOS / PRESENÇAS</span>
        <h2>Empresas que<br/><em>passaram por aqui.</em></h2>
        <p>Mercados diferentes pedem respostas diferentes. O que permanece é a capacidade de entender o contexto e construir a direção certa.</p>
      </div>
      <div className={`v105-brand-map ${mapActive ? 'is-active' : ''}`} aria-label="Empresas que já passaram pela Seeven">
        <div className="v105-brand-rings" aria-hidden="true"><i/><i/><i/></div>
        <div className="v105-brand-core"><LogoMark/><small>DIFERENTES MERCADOS<br/>UMA DIREÇÃO CRIATIVA</small></div>
        {featuredClients.map((client, i) => {
          const [x,y] = positions[i] || [50,50]
          const project = projects.find(row => row.clientId === client.id)
          const visual = client.publicCover || client.brandPoster || pickVisual(project, clients, behance)
          const start = .46 + (i % 4) * .055 + Math.floor(i/4) * .035
          return <button type="button" onClick={() => openClient(client)} className={`v105-brand-node l${(i%3)+1}`} key={client.id} style={{'--x':`${x}%`,'--y':`${y}%`,'--accent':client.accent || '#c9ff32','--start':start}}>
            <span>{visual ? <SmartImage src={visual} alt="" loading="lazy"/> : <i/>}</span>
            <div><small>{client.category || 'PROJETO'}</small><strong>{client.name}</strong></div><b>↗</b>
          </button>
        })}
        <div className="v105-brand-map-caption"><span>INSTITUCIONAL</span><span>FOOD</span><span>INDÚSTRIA</span><span>EVENTOS</span><span>MÚSICA</span><span>LIFESTYLE</span></div>
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
      <span className="v10-kicker">01 / ENTREGAS</span>
      <h2>Do digital ao físico.<br/><em>Sem trocar de direção.</em></h2>
      <p>Se a ideia precisa existir, a gente define o formato e executa: marca, produto digital, conteúdo, audiovisual, experiência física ou automação.</p>
    </div>
    <div className="v10-universe-shell">
      <div className="v10-universe-tabs" role="tablist" aria-label="Áreas de atuação">
        {capabilityGroups.map((item, i) => <button key={item.id} role="tab" aria-selected={active === i} className={active === i ? 'is-active' : ''} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)}>
          <small>0{i+1}</small><strong>{item.label}</strong><span>↗</span>
        </button>)}
      </div>
      <div className="v10-universe-detail" role="tabpanel" aria-live="polite">
        <div className="v10-universe-number">0{active+1}</div>
        <div className="v105-universe-content" key={group.id}>
          <div className="v105-universe-top"><span className="v10-kicker">{group.label}</span><small>0{active+1} / 06</small></div>
          <h3>{group.lead}</h3>
          <div className="v10-universe-items">{group.items.map(item => <span key={item}>{item}</span>)}</div>
          <div className="v10-universe-flow"><span>BRIEF</span><i>→</i><span>{group.label}</span><i>→</i><strong>ENTREGA</strong></div>
          <button onClick={() => onBrief(group.label)}>Preciso disso {arrow}</button>
        </div>
      </div>
    </div>
    <div className="v10-universe-foot"><span>PLANEJAR.</span><span>CRIAR.</span><strong>FAZER ACONTECER.</strong></div>
  </section>
}

const systemNodes = [
  { title:'Estratégia', desc:'Direção antes da execução', tag:'Estratégia', why:'Antes de escolher formato, precisamos saber o que a marca precisa mudar.', how:'O briefing vira prioridade, posicionamento e critérios para decidir o resto.' },
  { title:'Branding', desc:'Identidade reconhecível', tag:'Branding', why:'Uma boa entrega perde força quando cada ponto de contato parece vir de uma empresa diferente.', how:'Criamos linguagem, regras e direção visual para a marca continuar sendo a mesma em qualquer formato.' },
  { title:'Conteúdo', desc:'Consistência que se move', tag:'Social', why:'A marca precisa continuar presente depois do lançamento e da primeira campanha.', how:'Transformamos a direção em pautas, peças, formatos e cadência que mantêm reconhecimento.' },
  { title:'Web', desc:'Experiências que convertem', tag:'Web', why:'Interesse sem caminho claro vira abandono.', how:'Organizamos informação, experiência e ação para o digital explicar, provar e converter.' },
  { title:'Motion', desc:'Ideias com ritmo', tag:'Vídeo', why:'Algumas mensagens precisam de tempo, som e movimento para realmente prender atenção.', how:'Roteiro, captação, edição e motion entram como parte da mesma direção criativa.' },
  { title:'Físico', desc:'Presença fora da tela', tag:'Eventos', why:'Nem toda experiência termina no celular.', how:'A linguagem vira impresso, uniforme, embalagem, evento, cenografia ou material de ponto de venda.' }
]

function PresenceSystem({ projects, clients, behance, onOpen }) {
  const ref = useRef(null)
  const [scrollActive, setScrollActive] = useState(0)
  useScrollDirector(ref, 1, progress => {
    if (window.matchMedia?.('(max-width: 900px)').matches) return
    const next = Math.min(systemNodes.length - 1, Math.floor(clamp(progress * 1.01) * systemNodes.length))
    setScrollActive(current => current === next ? current : next)
  })
  const [manual, setManual] = useState(null)
  const active = manual ?? scrollActive
  const node = systemNodes[active]
  const related = projects.find(project => (project.tags || []).some(t => normalizeText(t).includes(normalizeText(node.tag)))) || projects[active] || projects[0]
  const visual = pickVisual(related, clients, behance)
  const relatedClient = clients.find(client => client.id === related?.clientId) || {}
  return <section className="v10-system" id="system" ref={ref} style={{ '--p': 0, '--system-accent': relatedClient.accent || '#7b61ff' }}>
    <div className="v10-system-sticky">
      <div className="v10-section-head">
        <span className="v10-kicker">02 / COMO CONECTAMOS</span>
        <h2>Um briefing.<br/><em>Uma direção.</em></h2>
        <p>Você não coordena seis fornecedores. A Seeven organiza as frentes e mantém a mesma lógica da estratégia até a entrega.</p>
        <div className="v10-system-promise"><span>1</span><strong>briefing</strong><i>→</i><span>1</span><strong>direção</strong><i>→</i><span>6+</span><strong>frentes</strong></div>
      </div>
      <div className="v10-system-mobile">
        <div className="v10-system-mobile-tabs" role="tablist" aria-label="Frentes conectadas">
          {systemNodes.map((item, i) => <button key={item.title} role="tab" aria-selected={i===active} className={i===active?'is-active':''} onClick={() => setManual(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button>)}
        </div>
        <div className="v105-system-mobile-context" key={node.title}><small>POR QUE ENTRA</small><strong>{node.why}</strong><small>COMO FUNCIONA</small><p>{node.how}</p></div>
        <button className="v10-system-mobile-card" onClick={() => related && onOpen?.(related)} aria-label={related ? `Abrir projeto ${related.client}` : 'Ver projeto relacionado'}>
          <div className="v10-system-mobile-media">{visual ? <SmartImage src={visual} alt="" loading="lazy"/> : null}<i/></div>
          <div className="v10-system-mobile-copy"><small>EXEMPLO REAL / {String(active+1).padStart(2,'0')}</small><h3>{node.title}</h3><p>{node.desc}</p><span>{relatedClient.name || related?.client || 'Projeto Seeven'} · {related?.title || 'Exemplo real'}</span><b>Ver exemplo {arrow}</b></div>
        </button>
      </div>
      <div className="v10-network" aria-label="Mapa de capacidades">
        <button className="v10-network-preview" onClick={() => related && onOpen?.(related)} aria-label={related ? `Abrir projeto ${related.client}` : 'Ver projetos'}>{visual ? <SmartImage src={visual} alt="" loading="lazy"/> : null}<div><small>EXEMPLO REAL / {String(active+1).padStart(2,'0')}</small><strong>{relatedClient.name || related?.client || node.title}</strong><span>{related?.title || node.desc}</span><b>VER RACIOCÍNIO ↗</b></div></button>
        <div className="v105-network-context" key={node.title}><small>0{active+1} / 06 · {node.title}</small><strong>{node.why}</strong><span>{node.how}</span></div>
        {systemNodes.map((item, i) => <button key={item.title} aria-pressed={i===active} onMouseEnter={() => setManual(i)} onMouseLeave={() => setManual(null)} onFocus={() => setManual(i)} onBlur={() => setManual(null)} onClick={() => setManual(i)} className={`v10-service-node n${i+1} ${i === active ? 'is-active' : ''}`}><span>{String(i+1).padStart(2,'0')}</span><b>{item.title}</b><small>{item.desc}</small></button>)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 50 L18 20 M50 50 L50 13 M50 50 L82 22 M50 50 L17 76 M50 50 L50 88 M50 50 L84 76"/></svg>
        <small className="v10-network-hint">ROLE / PASSE / TOQUE PARA ENTENDER CADA FRENTE</small>
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

function PhysicalLab({ behance = [] }) {
  const [mode,setMode] = useState('wear')
  const stage = useRef(null)
  const model = behance.find(item => /modelagem|3d/i.test(`${item.title || ''} ${(item.tools || []).join(' ')}`)) || behance[0]
  const modes = [
    ['wear','Vestuário','Uniforme, merch e peças que fazem a marca circular fora da tela.'],
    ['print','Impresso','Cartão, embalagem, flyer, sinalização e materiais de ponto de contato.'],
    ['3d','3D / protótipo','Modelagem e pré-visualização para testar forma, cena e aplicação antes de produzir.']
  ]
  useEffect(() => {
    const el = stage.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return undefined
    const move = e => { const rect = el.getBoundingClientRect(); el.style.setProperty('--rx', `${((e.clientY-rect.top)/rect.height-.5)*-12}deg`); el.style.setProperty('--ry', `${((e.clientX-rect.left)/rect.width-.5)*18}deg`) }
    const reset = () => { el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg') }
    el.addEventListener('pointermove', move); el.addEventListener('pointerleave', reset)
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', reset) }
  }, [])
  const current = modes.find(item => item[0] === mode) || modes[0]
  return <div className="v105-physical-lab">
    <div className="v105-physical-copy"><span className="v10-kicker">PRESENÇA TAMBÉM É MATÉRIA</span><h3>Da tela para<br/><em>o mundo real.</em></h3><p>{current[2]}</p><div>{modes.map(item => <button className={mode===item[0]?'is-active':''} key={item[0]} onClick={() => setMode(item[0])}>{item[1]}</button>)}</div></div>
    <div className={`v105-physical-stage is-${mode}`} ref={stage}>
      {mode==='wear' && <div className="v105-shirt" aria-label="Mockup interativo de camiseta"><svg viewBox="0 0 420 460" role="img" aria-label="Camiseta Seeven"><path d="M126 55 49 94 83 178 123 158 123 409 297 409 297 158 337 178 371 94 294 55 257 35c-13 29-30 43-47 43s-34-14-47-43z"/><circle cx="210" cy="205" r="50"/><text x="210" y="219" textAnchor="middle">7</text></svg><small>ARRASTE O MOUSE · OBJETO DEMONSTRATIVO</small></div>}
      {mode==='print' && <div className="v105-print-stack"><i/><i/><i/><div><b>SEE7VEN</b><span>PIXEL → PAPEL</span></div></div>}
      {mode==='3d' && <a className="v105-model-card" href={safeLink(model?.url) || 'https://app.spline.design/community/file/f93e3ebb-604c-4065-b6ff-88e0fa2359e6'} target="_blank" rel="noreferrer">{model?.cover ? <SmartImage src={model.cover} alt="Estudo de modelagem 3D" loading="lazy"/> : null}<span><small>BLENDER / 3D / PROTOTYPING</small><strong>Modelar antes de produzir.</strong><b>Explorar estudo 3D ↗</b></span></a>}
    </div>
  </div>
}

function SelectedWork({ projects, clients, behance, onOpen }) {
  const top = projects.slice(0, 6)
  return <section className="v10-work" id="work"><div className="v10-work-intro"><span className="v10-kicker">03 / SELECTED WORK</span><h2>Não mostramos<br/>só <em>peças.</em></h2><p>Uma marca pode virar site, campanha, vídeo, uniforme, embalagem, evento, sistema ou objeto. O formato vem depois da ideia.</p></div><PhysicalLab behance={behance}/><div className="v105-work-label"><span>PROJETOS SELECIONADOS</span><small>ARRASTE / ROLE PARA EXPLORAR</small></div><div className="v10-work-list">
      {top.map((project, i) => { const client = clients.find(c => c.id === project.clientId) || {}; const visual = pickVisual(project, clients, behance); return <article className="v10-project" key={project.id} style={{ '--accent': client.accent || '#b7ff35' }}><button className="v10-project-hit" onClick={() => onOpen(project)} aria-label={`Abrir case ${project.client}`}/><div className="v10-project-index"><span>{String(i+1).padStart(2,'0')}</span><small>{project.label || 'PROJECT'}</small></div><ProjectMedia project={project} client={client} visual={visual}/><div className="v10-project-copy"><h3>{project.client}</h3><p>{project.title}</p><div>{(project.tags || []).slice(0,4).map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => onOpen(project)}>Ver raciocínio {arrow}</button></div></article> })}
    </div></section>
}

function WorkArchive({ clients, projects, onOpen }) {
  const visible = clients.slice(0, 12)
  const actionsFor = client => [client.website ? ['Site', safeLink(client.website)] : null, client.url ? ['Instagram', safeLink(client.url)] : null].filter(item => item?.[1])
  return <section className="v10-archive" id="brands" aria-labelledby="archive-title">
    <div className="v105-archive-intro"><span className="v10-kicker">ARQUIVO / PRESENÇAS</span><h2 id="archive-title">Mais marcas.<br/><em>Mais contextos.</em></h2><p>Não é uma coleção de logos. São empresas reais, de mercados diferentes, que pediram respostas diferentes. Explore os cases, sites e presenças públicas.</p><a href="#brand-directory">CONHECER EMPRESAS ↓</a></div>
    <div className="v10-archive-grid" id="brand-directory">{visible.map((client, index) => { const project = projects.find(row => row.clientId === client.id); const media = client.publicCover || client.brandPoster; const actions = actionsFor(client); return <article className="v10-archive-card" key={client.id} style={{'--accent': client.accent || '#7b61ff','--i':index}}><div className="v10-archive-media">{media ? <SmartImage src={media} alt="" loading="lazy"/> : null}<i/></div><div className="v10-archive-copy"><small>{String(index+1).padStart(2,'0')} / {client.category || 'PROJECT'}</small><strong>{client.name}</strong><span>{client.handle || 'SEE7VEN / PRESENCE'}</span><div className="v105-archive-actions">{project ? <button onClick={() => onOpen(project)}>CASE ↗</button> : null}{actions.map(([label,href])=><a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></div></article> })}</div>
    <div className="v10-archive-mobile" aria-label="Empresas e presenças públicas">{visible.map((client,index) => { const project = projects.find(row => row.clientId === client.id); const media = client.publicCover || client.brandPoster; const actions = actionsFor(client); return <article key={client.id} style={{'--accent':client.accent || '#7b61ff'}}><div className="v105-archive-mobile-media">{media ? <SmartImage src={media} alt="" loading="lazy"/> : null}</div><small>{String(index+1).padStart(2,'0')} · {client.category || 'Projeto'}</small><strong>{client.name}</strong><span>{client.handle}</span><div>{project ? <button onClick={() => onOpen(project)}>Case ↗</button> : null}{actions.slice(0,2).map(([label,href])=><a key={label} href={href} target="_blank" rel="noreferrer">{label} ↗</a>)}</div></article> })}</div>
  </section>
}

function ThinkingBento({ behance }) {
  const model = behance.find(item => /modelagem|3d/i.test(`${item.title || ''} ${(item.tools || []).join(' ')}`))
  const visual = model?.cover || behance[4]?.cover || behance[0]?.cover || ''
  return <section className="v10-thinking"><div className="v10-thinking-head"><span className="v10-kicker">05 / COMO PENSAMOS</span><div><h2>Antes de criar,<br/><em>a gente organiza.</em></h2><p className="v105-thinking-intro">Estratégia organiza a mensagem. Wireframes organizam a experiência. E quando a entrega pede volume, ambiente ou produto, 3D e Blender ajudam a validar antes da produção.</p></div></div><div className="v10-thinking-bento"><div className="v10-thinking-left">{[["01","Informação demais","Muita coisa para dizer e pouca hierarquia para decidir o que vem primeiro."],["02","Jornada confusa","Site, social, anúncio, atendimento e material físico parecem marcas diferentes."],["03","Execução sem sistema","A produção cresce, mas a percepção da marca não cresce junto."]].map(([n,t,d]) => <article key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></article>)}<div className="v10-thinking-chart"><strong>Challenge</strong><svg viewBox="0 0 260 100" aria-hidden="true"><path d="M8 84 L48 64 L88 72 L128 40 L168 51 L208 18 L252 30"/><line x1="8" y1="84" x2="252" y2="84"/></svg><small>RUÍDO → CLAREZA</small></div></div><div className="v10-thinking-visual">{visual ? <SmartImage src={visual} alt="Estudo de processo Seeven" loading="lazy"/> : <div className="v10-thinking-silhouette"/>}<div className="v10-thinking-overlay"><LogoMark/><span>{model ? 'BLENDER / 3D / PROCESS' : 'FOCUSED ACTIONS'}</span><strong>{model ? 'Testar antes de produzir.' : <>Menos ruído.<br/>Mais presença.</>}</strong>{model?.url ? <a href={safeLink(model.url)} target="_blank" rel="noreferrer">Ver estudo 3D ↗</a> : null}</div></div><div className="v10-thinking-right"><div className="v10-thinking-decision"><span>DESIGN DECISION</span><strong>Uma lógica antes<br/>de muitos formatos.</strong><i>7</i></div><div className="v10-thinking-decisions"><p>Estratégia antes de produzir.</p><p>Prototipar quando a forma precisa ser validada.</p><p>Uma linguagem que funciona do digital ao físico.</p></div></div></div></section>
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
    <div className="v10-cap-title"><span className="v10-kicker">09 / COMECE PELO PROBLEMA</span><h2>Não sabe o nome<br/>do serviço? <em>Melhor ainda.</em></h2></div>
    <div className="v10-cap-grid">
      <div className="v10-cap-menu">{items.map((row,i) => <button key={`${row.problem}-${i}`} className={safeActive===i?'is-active':''} onClick={() => setActive(i)}><small>0{i+1}</small><strong>{row.problem}</strong><span>+</span></button>)}</div>
      <div className="v10-cap-detail"><span className="v10-kicker">RESPOSTA / {String(safeActive+1).padStart(2,'0')}</span><p className="v10-cap-answer">{item.answer}</p><div>{(item.stack || []).map(x => <span key={x}>{x}</span>)}</div><button onClick={() => onBrief(item.problem)}>Vamos resolver isso {arrow}</button></div>
    </div>
  </section>
}

function Motion({ reels, clients, behance }) {
  const items = useMemo(() => {
    const used = new Set(); const output = []
    for (const reel of reels) {
      const client = clients.find(c=>c.id===reel.clientId)||{}
      const needle = normalizeText(reel.client || client.name).split(' ').filter(word => word.length > 3)
      const related = behance.find(item => needle.some(word => normalizeText(`${item.client || ''} ${item.title || ''}`).includes(word)))
      const ownPoster = reel.poster && !isFallbackPoster(reel.poster) ? reel.poster : ''
      const poster = ownPoster || related?.cover || client.publicCover || client.brandPoster || reel.poster
      const key = poster || `${reel.clientId}-${reel.title}`
      if (!poster || used.has(key)) continue
      used.add(key); output.push({ reel, client, related, poster }); if (output.length >= 7) break
    }
    for (const related of behance) { if (output.length >= 7) break; if (!related.cover || used.has(related.cover)) continue; used.add(related.cover); output.push({ reel:{id:`behance-${related.id}`,title:related.title,client:related.client}, client:{}, related, poster:related.cover }) }
    return output
  }, [reels, clients, behance])
  return <section className="v10-motion" id="motion"><div className="v10-motion-head"><span className="v10-kicker">06 / MOTION & CONTENT</span><h2>Algumas ideias<br/><em>precisam se mover.</em></h2><p>Uma curadoria, não uma repetição de capas. Vídeo, campanha e conteúdo entram quando tempo e ritmo ajudam a mensagem a ficar.</p></div><div className="v105-motion-guide"><span>VÍDEO</span><span>MOTION</span><span>CAMPAIGN</span><span>SOCIAL</span><small>ARRASTE / ROLE →</small></div><div className="v10-motion-stage">{items.map((item,i) => { const {reel,client,related,poster}=item; const direct=safeLink(reel.permalink || reel.video); const href=direct || safeLink(related?.url || reel.url || client.url); const rawTitle=reel.title || related?.title || 'Motion / conteúdo'; const title=/^reel\s*\d+/i.test(rawTitle) ? (related?.title || `${reel.client || client.name || 'Seeven'} em movimento`) : rawTitle; return <a key={`${reel.id}-${i}`} href={href||'#work'} target={href?'_blank':undefined} rel="noreferrer" className={`v10-motion-card ${i===0?'is-featured':''}`} style={{'--accent':reel.accent||client.accent||'#765bff'}}><div><SmartImage src={poster} alt="" loading="lazy"/><i>{direct ? '▶' : '↗'}</i><em>{String(i+1).padStart(2,'0')}</em><b className="v10-motion-type">{direct ? 'ASSISTIR' : 'ARQUIVO VISUAL'}</b></div><small>{reel.client || client.name || related?.client || 'SEE7VEN'}</small><strong>{title}</strong></a> })}</div></section>
}

function Proof({ behance }) {
  const references = { tela: behance.find(item => /web|sistema|site/i.test(item.title || ''))?.cover || behance[0]?.cover, rua: behance.find(item => /cajamar|evento/i.test(`${item.title || ''} ${item.client || ''}`))?.cover || behance[3]?.cover, palco: behance.find(item => /evento|publi/i.test(`${item.title || ''} ${item.client || ''}`))?.cover || behance[1]?.cover, papel: behance.find(item => /post|campanha|identidade/i.test(item.title || ''))?.cover || behance[2]?.cover, objeto: behance.find(item => /3d|modelagem/i.test(item.title || ''))?.cover || behance[4]?.cover }
  const formats = [['TELA','Sites, sistemas, landing pages e interfaces.',references.tela,'01'],['RUA','Campanhas, mídia exterior, sinalização e experiência.',references.rua,'02'],['PALCO','Evento, cenografia, conteúdo ao vivo e ambientação.',references.palco,'03'],['PAPEL','Editorial, impresso, embalagem e material de apoio.',references.papel,'04'],['OBJETO','Uniforme, merch, mockup e visualização 3D.',references.objeto,'05']]
  return <section className="v10-proof"><div className="v10-proof-copy"><span className="v10-kicker">07 / FORMATO NÃO É LIMITE</span><h2>Tela, rua,<br/><em>palco, papel.</em></h2><p>Aqui o assunto não é qual cliente. É até onde uma mesma ideia pode chegar quando o formato deixa de ser limite.</p></div><div className="v105-format-grid">{formats.map(([title,desc,cover,n]) => <article key={title}><div>{cover ? <SmartImage src={cover} alt="" loading="lazy"/> : null}<span>{n}</span></div><small>FORMATO</small><strong>{title}</strong><p>{desc}</p></article>)}</div><div className="v105-format-line"><span>DIGITAL</span><i>→</i><span>FÍSICO</span><i>→</i><strong>PRESENÇA</strong></div></section>
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
  const rowA = [...items, ...items]; const reversed = items.slice().reverse(); const rowB = [...reversed, ...reversed]
  const link = partner => safeLink(partner.url) || '#contact'
  return <section className="v10-partners" id="partners"><div className="v105-partners-intro"><span className="v10-kicker">08 / CREATIVE NETWORK</span><h2>Mais projeto.<br/><em>Mais rede.</em></h2><p>Além das empresas mostradas acima, existe uma rede de influenciadores, criadores e empresas parceiras que amplia alcance, produção e possibilidades quando o projeto pede.</p><small>{items.length || 25} CONEXÕES · 1 DIREÇÃO · A GESTÃO CONTINUA CENTRALIZADA</small></div><div className="v105-partner-rail r1"><div>{rowA.map((partner,index)=><a href={link(partner)} target={link(partner)==='#contact'?undefined:'_blank'} rel="noreferrer" key={`a-${partner.id || partner.handle}-${index}`}><span>{partner.handle || partner.name}</span><i>↗</i></a>)}</div></div><div className="v105-partner-rail r2"><div>{rowB.map((partner,index)=><a href={link(partner)} target={link(partner)==='#contact'?undefined:'_blank'} rel="noreferrer" key={`b-${partner.id || partner.handle}-${index}`}><span>{partner.handle || partner.name}</span><i>↗</i></a>)}</div></div><p className="v10-partner-note">Toque ou clique em um nome para conhecer a presença pública do parceiro.</p></section>
}

function Contact({ onBrief }) {
  const text = encodeURIComponent('Olá! Conheci a Seeven pelo site e quero conversar sobre um projeto.')
  return <section className="v10-contact" id="contact">
    <span className="v10-kicker">10 / START SOMETHING</span>
    <h2>Tem uma ideia?<br/><em>Coloca na mesa.</em></h2>
    <p>Não precisa montar o escopo antes de falar com a gente. Conte o objetivo, o problema ou o que você quer colocar no mundo.</p>
    <div className="v10-contact-actions"><button className="v10-contact-main" onClick={() => onBrief()}>Brief rápido · 60s <span>{arrow}</span></button><a href={`https://wa.me/${WA_KAREN}?text=${text}`} target="_blank" rel="noreferrer">Conversar agora <span>{arrow}</span></a></div>
    <div className="v10-contact-people">
      <a href={`https://wa.me/${WA_GUSTAVO}?text=${text}`} target="_blank" rel="noreferrer"><small>DIREÇÃO</small><strong>Gustavo</strong><span>+55 11 92062-6850 {arrow}</span></a>
      <a href={`https://wa.me/${WA_KAREN}?text=${text}`} target="_blank" rel="noreferrer"><small>NOVOS PROJETOS</small><strong>Karen</strong><span>+55 11 97149-3985 {arrow}</span></a>
    </div>
  </section>
}

function Brief({ open, onClose, initial = '' }) {
  const [step,setStep] = useState(0)
  const [form,setForm] = useState({ need: initial, company:'', timing:'', name:'' })
  const timerRef = useRef(0)
  useBodyLock(open)
  useEffect(() => { if (open) { setStep(initial ? 1 : 0); setForm(v => ({...v, need: initial || ''})) } return () => clearTimeout(timerRef.current) }, [open, initial])
  if (!open) return null
  const choices = ['Projeto 360° / várias frentes','Marca / identidade','Site / landing / sistema','Conteúdo / social','Campanha / mídia','Vídeo / motion','Impresso / evento','Tecnologia / automação','Ainda não sei']
  const send = () => { const message = `Olá! Quero conversar sobre um projeto com a Seeven.\n\nPreciso de: ${form.need || '-'}\nMarca/empresa: ${form.company || '-'}\nPrazo: ${form.timing || '-'}\nMeu nome: ${form.name || '-'}`; track('brief_completed', { need: form.need }); window.open(`https://wa.me/${WA_KAREN}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer'); onClose() }
  const choose = (field,value,nextStep) => { setForm(current => ({...current,[field]:value})); clearTimeout(timerRef.current); timerRef.current = setTimeout(() => setStep(nextStep), 260) }
  const handleEnter = next => e => { if (e.key === 'Enter' && e.currentTarget.value.trim()) next() }
  return <div className="v10-brief" role="dialog" aria-modal="true" aria-label="Brief rápido"><header><LogoMark/><button onClick={onClose}>Fechar ×</button></header><div className="v10-brief-progress"><i style={{width:`${((step+1)/4)*100}%`}}/></div><div className="v10-brief-card"><span className="v10-kicker">BRIEF RÁPIDO · 0{step+1}/04</span>{step===0 && <><h2>O que precisamos<br/>construir?</h2><p className="v105-brief-hint">Toque em uma opção. A próxima pergunta abre automaticamente.</p><div className="v10-choice-grid">{choices.map(x=><button className={form.need===x?'is-active':''} key={x} onClick={()=>choose('need',x,1)}>{x}<span>{form.need===x?'✓':'+'}</span></button>)}</div></>}{step===1 && <><h2>Para qual marca<br/>ou empresa?</h2><input autoFocus value={form.company} onChange={e=>setForm({...form,company:e.target.value})} onKeyDown={handleEnter(()=>setStep(2))} placeholder="Nome da marca / empresa"/></>}{step===2 && <><h2>Quando isso precisa<br/>estar no mundo?</h2><p className="v105-brief-hint">Escolha uma faixa. Você pode detalhar depois no WhatsApp.</p><div className="v10-choice-grid">{['O quanto antes','30–60 dias','2–4 meses','Sem prazo definido'].map(x=><button className={form.timing===x?'is-active':''} key={x} onClick={()=>choose('timing',x,3)}>{x}<span>{form.timing===x?'✓':'+'}</span></button>)}</div></>}{step===3 && <><h2>Como podemos<br/>chamar você?</h2><input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onKeyDown={handleEnter(send)} placeholder="Seu nome"/></>}<a className="v10-brief-direct" href={`https://wa.me/${WA_KAREN}?text=${encodeURIComponent('Olá! Vim pelo site da Seeven e prefiro conversar direto sobre meu projeto.')}`} target="_blank" rel="noreferrer">Prefiro conversar direto no WhatsApp ↗</a><div className="v10-brief-actions"><button onClick={()=> step>0 ? setStep(step-1) : onClose()}>← Voltar</button>{step===1 ? <button disabled={!form.company.trim()} onClick={()=>setStep(2)}>Continuar →</button> : step===3 ? <button disabled={!form.name.trim()} onClick={send}>Enviar no WhatsApp ↗</button> : <span className="v105-auto-step">AVANÇO AUTOMÁTICO</span>}</div></div></div>
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

  useEffect(() => { track('page_view',{source:cms.source,version:'v10.5'}) }, [cms.source])

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
    <ExperienceGate projects={cms.projects} clients={cms.clients} behance={cms.behance}/>
    <Header onBrief={openBrief}/>
    <main>
      <Hero projects={cms.projects} clients={cms.clients} behance={cms.behance} onOpen={p=>openCase(p,'brand_map')}/>
      <CapabilityUniverse onBrief={openBrief}/>
      <PresenceSystem projects={cms.projects} clients={cms.clients} behance={cms.behance} onOpen={p=>openCase(p,'presence_system')}/>
      <SelectedWork projects={cms.projects} clients={cms.clients} behance={cms.behance} onOpen={p=>openCase(p,'selected_work')}/>
      <WorkArchive clients={cms.clients} projects={cms.projects} onOpen={p=>openCase(p,'archive')}/>
      <ThinkingBento behance={cms.behance}/>
      <Motion reels={cms.reels} clients={cms.clients} behance={cms.behance}/>
      <Proof behance={cms.behance}/>
      <Partners partners={cms.partners}/>
      <Capabilities services={cms.services} onBrief={openBrief}/>
      <Contact onBrief={openBrief}/>
    </main>
    <Footer/>
    {caseProject ? <BentoCase project={caseProject} clients={cms.clients} behance={cms.behance} onClose={()=>closeCase()} onBrief={openBrief}/> : null}
    <Brief open={brief} onClose={()=>setBrief(false)} initial={briefPreset}/>
  </div>
}
