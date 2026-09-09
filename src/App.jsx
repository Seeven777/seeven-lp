import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCmsContent } from './useCmsContent'
import { caseStudies, projectIntelligence, pitchPresets, pitchCopy } from './data'

const WA_KAREN = '5511971493985'
const WA_GUSTAVO = '5511920626850'
const arrow = '↗'

const capabilityGroups = [
  {
    id: 'brand', label: 'Estratégia & Marca', short: 'Marca', accent: '#c9ff32',
    lead: 'A ideia que organiza tudo antes da primeira peça.',
    why: 'Para uma marca não depender de improviso a cada nova campanha.',
    items: ['Posicionamento', 'Naming', 'Identidade visual', 'Brandbook', 'Direção criativa', 'Copy & campanha'],
    output: 'Clareza + sistema visual + linguagem reconhecível.'
  },
  {
    id: 'digital', label: 'Digital & Produto', short: 'Digital', accent: '#7b61ff',
    lead: 'Experiências digitais que explicam, vendem e funcionam.',
    why: 'Para transformar interesse em um caminho claro até a ação.',
    items: ['Sites institucionais', 'Landing pages', 'E-commerce', 'UI/UX', 'Sistemas', 'Analytics'],
    output: 'Interface + jornada + conversão + mensuração.'
  },
  {
    id: 'growth', label: 'Conteúdo & Performance', short: 'Conteúdo', accent: '#ff7a1a',
    lead: 'Presença recorrente com mensagem, distribuição e leitura de resultado.',
    why: 'Para a marca continuar presente depois do lançamento e da primeira campanha.',
    items: ['Planejamento', 'Social media', 'Criativos', 'Tráfego pago', 'SEO', 'Campanhas'],
    output: 'Frequência + atenção + distribuição + aprendizado.'
  },
  {
    id: 'motion', label: 'Motion & Audiovisual', short: 'Motion', accent: '#73cfff',
    lead: 'Quando a ideia precisa ganhar ritmo, som e tempo.',
    why: 'Para mensagens que precisam prender atenção antes mesmo de terminar a primeira frase.',
    items: ['Reels', 'Vídeo institucional', 'Captação', 'Edição', 'Motion 2D/3D', 'Comerciais'],
    output: 'Roteiro + imagem + ritmo + movimento.'
  },
  {
    id: 'physical', label: 'Físico & Experiência', short: 'Físico', accent: '#f4c63d',
    lead: 'A marca continua existindo quando a tela termina.',
    why: 'Para a presença continuar em mãos, espaços, eventos, produto e ponto de venda.',
    items: ['Impressos', 'PDV', 'Embalagens', 'Sinalização', 'Eventos', 'Cenografia & brindes'],
    output: 'Material + ambiente + experiência + presença física.'
  },
  {
    id: 'tech', label: 'Tecnologia & Automação', short: 'Tecnologia', accent: '#58f5d0',
    lead: 'Integrações e inteligência para a operação não depender de improviso.',
    why: 'Para reduzir trabalho manual e conectar comunicação, dados e operação.',
    items: ['Dashboards', 'Automações', 'Integrações', 'Formulários', 'CRM & jornadas', 'IA aplicada'],
    output: 'Fluxo + dados + automação + escala.'
  }
]

const workflowStages = [
  {
    id: 'brief', index: '01', label: 'Briefing', accent: '#c9ff32',
    title: 'Primeiro, a gente descobre o que realmente precisa mudar.',
    question: 'Objetivo, contexto, público, restrições e o que não pode continuar igual.',
    answer: 'O pedido deixa de ser “faz uma peça” e vira um problema que pode ser resolvido.',
    output: 'Saída: prioridade clara.'
  },
  {
    id: 'direction', index: '02', label: 'Direção', accent: '#7b61ff',
    title: 'Depois, uma decisão organiza todas as outras.',
    question: 'Qual mensagem, linguagem, sistema e experiência precisam existir?',
    answer: 'Definimos uma direção que continua fazendo sentido quando o formato muda.',
    output: 'Saída: lógica criativa.'
  },
  {
    id: 'production', index: '03', label: 'Produção', accent: '#ff7a1a',
    title: 'A execução entra por frente, sem quebrar a ideia em fornecedores.',
    question: 'Web, conteúdo, vídeo, impresso, evento, 3D ou automação?',
    answer: 'Ativamos só as disciplinas que o projeto pede e mantemos a mesma coordenação.',
    output: 'Saída: entregas conectadas.'
  },
  {
    id: 'presence', index: '04', label: 'Presença', accent: '#58f5d0',
    title: 'No final, tudo parece parte da mesma marca.',
    question: 'Cada ponto de contato reforça ou enfraquece o que veio antes?',
    answer: 'Acompanhamos o conjunto para que tela, rua, palco e operação não contem histórias diferentes.',
    output: 'Saída: presença coerente.'
  }
]


const liveSiteShowcases = [
  {
    id: 'caprichae',
    label: 'FOOD / PEDIDO ONLINE',
    name: 'Caprichaê',
    url: 'https://caprichae-site-pedidos-vercel-corri.vercel.app',
    accent: '#ff7a1a',
    headline: 'Pedido online com checkout simples e finalização no WhatsApp.',
    summary: 'Uma jornada pensada para converter rápido: cardápio, carrinho, cupom, checkout e mensagem pronta para o atendimento.',
    stack: ['UI/UX', 'Pedido online', 'WhatsApp', 'Conversão']
  },
  {
    id: 'starprint',
    label: 'VAREJO / PAPELARIA',
    name: 'Star Pri',
    url: 'https://starprint-psi.vercel.app',
    accent: '#8065ff',
    headline: 'Vitrine digital para papelaria, presentes e cestas.',
    summary: 'Estrutura feita para apresentar catálogo, reforçar a marca e transformar navegação em contato comercial.',
    stack: ['Institucional', 'Catálogo', 'Marca', 'Experiência digital']
  },
  {
    id: 'insights',
    label: 'DASHBOARD / ANALYTICS',
    name: 'Insights SindPetshop-SP',
    url: 'https://dashbord-de-ensigths-49n3.vercel.app/?view=simple&mode=simple&since=2026-08-13&until=2026-09-09',
    accent: '#58f5d0',
    headline: 'Painel para leitura executiva, histórico e inteligência de presença.',
    summary: 'Um dashboard pensado para transformar dados de visualizações, interações, território e público em leitura prática.',
    stack: ['Dashboard', 'Meta API', 'Dados', 'Leitura executiva']
  }
]

const pitchCtaCopy = {
  food: { title:'FAZER DESEJO\nVIRAR PEDIDO.', brief:'Quero melhorar presença e conversão de uma marca de food' },
  eventos: { title:'FAZER CAPACIDADE\nVIRAR PRESENÇA.', brief:'Quero organizar a presença de uma empresa de eventos' },
  b2b: { title:'FAZER COMPLEXIDADE\nVIRAR CLAREZA.', brief:'Quero melhorar a comunicação de uma empresa B2B' },
  institucional: { title:'FAZER INFORMAÇÃO\nVIRAR AÇÃO.', brief:'Quero organizar uma presença institucional' },
  nightlife: { title:'FAZER ATENÇÃO\nVIRAR PRESENÇA.', brief:'Quero construir presença para entretenimento / nightlife' },
  pet: { title:'FAZER CUIDADO\nVIRAR PRESENÇA.', brief:'Quero construir uma presença para o setor pet' },
  web: { title:'FAZER INTERESSE\nVIRAR EXPERIÊNCIA.', brief:'Quero construir ou melhorar um site / produto digital' },
  social: { title:'FAZER CONTEÚDO\nVIRAR PRESENÇA.', brief:'Quero estruturar conteúdo e presença social' }
}

function readPitchContext() {
  if (typeof window === 'undefined') return { active:false, segment:'', prospect:'', ids:[], copy:null, cta:null, pitchId:'' }
  const params = new URLSearchParams(window.location.search)
  const segment = String(params.get('for') || '').trim().toLowerCase()
  const prospect = String(params.get('prospect') || '').trim().slice(0,80)
  const ids = pitchPresets[segment] || []
  const copy = pitchCopy[segment] || null
  const cta = pitchCtaCopy[segment] || null
  const pitchId = String(params.get('pitch') || [segment, prospect].filter(Boolean).join(':')).trim().slice(0,120)
  return { active:Boolean(segment || prospect), segment, prospect, ids, copy, cta, pitchId }
}

function pitchClientIds(projects = [], ids = []) {
  return ids.map(id => projects.find(project => project.id === id)?.clientId).filter(Boolean)
}

function prioritizeRows(rows = [], ids = [], key = row => row.id) {
  if (!ids?.length) return rows
  const rank = new Map(ids.map((id,index)=>[id,index]))
  return [...rows].sort((a,b) => {
    const ar = rank.has(key(a)) ? rank.get(key(a)) : 999
    const br = rank.has(key(b)) ? rank.get(key(b)) : 999
    return ar - br
  })
}

function track(event, detail = {}) {
  try {
    const pitch = readPitchContext()
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event,
      ...(pitch.active ? { pitch_segment:pitch.segment || undefined, pitch_prospect:pitch.prospect || undefined, pitch_id:pitch.pitchId || undefined } : {}),
      ...detail
    })
  } catch (_) {}
}

function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)) }

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return undefined
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  return reduced
}

function useInViewport(ref, threshold = .12) {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    observer.observe(node)
    return () => observer.disconnect()
  }, [ref, threshold])
  return visible
}

function useScrollProgress(ref, onProgress) {
  const callbackRef = useRef(onProgress)
  callbackRef.current = onProgress
  useEffect(() => {
    let raf = 0
    let active = true
    const update = () => {
      raf = 0
      if (!active) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      const p = clamp((-rect.top) / travel)
      el.style.setProperty('--p', p.toFixed(4))
      callbackRef.current?.(p)
    }
    const request = () => { if (active && !raf) raf = requestAnimationFrame(update) }
    const node = ref.current
    let observer
    if (node && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; if (active) request() }, { rootMargin: '160px 0px' })
      observer.observe(node)
    }
    update()
    window.addEventListener('scroll', request, { passive: true })
    window.addEventListener('resize', request)
    return () => {
      cancelAnimationFrame(raf)
      observer?.disconnect()
      window.removeEventListener('scroll', request)
      window.removeEventListener('resize', request)
    }
  }, [ref])
}

function useBodyLock(locked) {
  useEffect(() => {
    if (!locked) return undefined
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbar = Math.max(0, window.innerWidth - document.documentElement.clientWidth)
    document.body.style.overflow = 'hidden'
    if (scrollbar) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
    }
  }, [locked])
}

function usePointerTilt(ref, amount = 12) {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let raf = 0
    let event = null
    const paint = () => {
      raf = 0
      if (!event) return
      const rect = el.getBoundingClientRect()
      const x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1)) - .5
      const y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1)) - .5
      el.style.setProperty('--ry', `${(x * amount).toFixed(2)}deg`)
      el.style.setProperty('--rx', `${(-y * amount * .75).toFixed(2)}deg`)
      el.style.setProperty('--px', `${((x + .5) * 100).toFixed(1)}%`)
      el.style.setProperty('--py', `${((y + .5) * 100).toFixed(1)}%`)
    }
    const move = e => { event = e; if (!raf) raf = requestAnimationFrame(paint) }
    const leave = () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--px', '50%'); el.style.setProperty('--py', '50%') }
    el.addEventListener('pointermove', move, { passive: true })
    el.addEventListener('pointerleave', leave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave) }
  }, [ref, amount])
}

function safeLink(value = '') {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch (_) { return '' }
}

function readableHost(value = '') {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch (_) { return value }
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
  return <span className="v11-logo" aria-label="Seeven"><i>7</i><b>SEE7VEN</b></span>
}

function normalizeText(value = '') { return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ') }
function isFallbackPoster(value = '') { return /\/assets\/posters\/reel-\d+\.jpg/i.test(String(value || '')) }

function findRelatedBehance(project, behance = []) {
  if (!project) return null
  const client = normalizeText(project.client)
  return behance.find(item => {
    const hay = normalizeText(`${item.client || ''} ${item.title || ''}`)
    return client && (hay.includes(client) || client.split(' ').some(word => word.length > 4 && hay.includes(word)))
  }) || null
}

function projectVisual(project, behance = []) {
  if (!project) return ''
  if (project.cover) return project.cover
  return findRelatedBehance(project, behance)?.cover || ''
}

function clientVisual(client = {}) { return client.publicCover || client.brandPoster || '' }
function clientWebsite(client = {}) { return safeLink(client.website || '') }
function clientInstagram(client = {}) {
  const direct = safeLink(client.url || '')
  if (direct) return direct
  const handle = String(client.handle || '').trim().replace(/^@/, '')
  return handle ? `https://www.instagram.com/${encodeURIComponent(handle)}/` : ''
}
function projectForClient(projects = [], client = {}) { return projects.find(project => project.clientId === client.id) }

function jumpTo(target) {
  requestAnimationFrame(() => document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
}

function CursorHalo() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const cursor = ref.current
    if (!cursor) return undefined
    let raf = 0
    let x = -100, y = -100, label = ''
    const paint = () => {
      raf = 0
      cursor.style.transform = `translate3d(${x}px,${y}px,0)`
      cursor.dataset.label = label
      cursor.classList.toggle('is-active', Boolean(label))
    }
    const move = event => {
      x = event.clientX
      y = event.clientY
      label = event.target.closest?.('[data-cursor]')?.getAttribute('data-cursor') || ''
      if (!raf) raf = requestAnimationFrame(paint)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move) }
  }, [])
  return <div ref={ref} className="v11-cursor" aria-hidden="true"><span/></div>
}

function ExperienceGate({ projects = [], behance = [] }) {
  const shouldShow = (() => {
    try {
      return typeof window !== 'undefined' && !/^\/work\//.test(window.location.pathname) && !window.sessionStorage.getItem('seeven:v11:studio-intro:1')
    } catch (_) { return true }
  })()
  const [visible, setVisible] = useState(shouldShow)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  useBodyLock(visible)

  const visuals = useMemo(() => projects.slice(0, 8).map(project => ({ id: project.id, client: project.client, src: projectVisual(project, behance) })).filter(item => item.src), [projects, behance])

  useEffect(() => {
    if (!visible) return undefined
    let raf = 0
    const start = performance.now()
    const duration = 900
    const tick = now => {
      const p = Math.min(1, (now - start) / duration)
      setProgress(Math.min(98, Math.round((1 - Math.pow(1 - p, 3)) * 100)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const finish = async () => {
      try { await document.fonts?.ready } catch (_) {}
      await new Promise(resolve => setTimeout(resolve, duration))
      setProgress(100)
      setTimeout(() => setReady(true), 120)
    }
    finish()
    return () => cancelAnimationFrame(raf)
  }, [visible])

  if (!visible) return null
  const enter = target => {
    if (leaving) return
    setLeaving(true)
    try { window.sessionStorage.setItem('seeven:v11:studio-intro:1', '1') } catch (_) {}
    setTimeout(() => {
      setVisible(false)
      if (target) jumpTo(target)
    }, 420)
  }

  const panels = [
    { n:'01', title:'Quem somos', note:'Uma direção para estratégia, criação, produção e tecnologia.', target:'#capabilities', images:visuals.slice(0,2), accent:'#c9ff32' },
    { n:'02', title:'Projetos', note:'Cases e entregas em contextos muito diferentes.', target:'#work', images:visuals.slice(2,5), accent:'#7b61ff' },
    { n:'03', title:'Empresas & rede', note:'Marcas, parceiros e presença pública para você explorar.', target:'#companies', images:visuals.slice(5,8), accent:'#58f5d0' }
  ]

  return <div className={`v11-gate ${ready ? 'is-ready' : ''} ${leaving ? 'is-leaving' : ''}`}>
    <div className="v11-loader" aria-hidden={ready}>
      <LogoMark/>
      <div className="v11-loader-count">{String(progress).padStart(3,'0')}<small>%</small></div>
      <div className="v11-loader-track"><i style={{width:`${progress}%`}}/></div>
      <span>{progress < 34 ? 'CARREGANDO PRESENÇA' : progress < 68 ? 'CONECTANDO PROJETOS' : 'ABRINDO POSSIBILIDADES'}</span>
    </div>
    <div className="v11-gateway" aria-hidden={!ready}>
      <header><LogoMark/><span>POR ONDE VOCÊ QUER COMEÇAR?</span></header>
      <div className="v11-gateway-grid">
        {panels.map(panel => <button key={panel.n} onClick={() => enter(panel.target)} style={{'--accent':panel.accent}} data-cursor="ABRIR">
          <small>{panel.n}</small><h2>{panel.title}</h2><p>{panel.note}</p><b>EXPLORAR ↗</b>
          <div>{panel.images.map((item,index)=><span key={item.id} style={{'--i':index}}><SmartImage src={item.src} alt=""/></span>)}</div>
        </button>)}
      </div>
      <button className="v11-gateway-all" onClick={() => enter('#top')}><span>VER EXPERIÊNCIA COMPLETA</span><i>↓</i></button>
    </div>
  </div>
}

function Header({ onBrief }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [theme, setTheme] = useState('dark')
  useBodyLock(open)

  useEffect(() => {
    if (!open) return undefined
    const close = event => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const current = window.scrollY
      if (window.innerWidth <= 900 && !open) {
        const delta = current - last
        if (Math.abs(delta) > 8) setHidden(current > 110 && delta > 0)
      } else setHidden(false)
      last = current
    }
    const request = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', request, { passive:true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', request) }
  }, [open])

  useEffect(() => {
    const sections = [...document.querySelectorAll('[data-header-theme]')]
    if (!sections.length || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setTheme(visible.target.getAttribute('data-header-theme') || 'dark')
    }, { rootMargin:'-8% 0px -82% 0px', threshold:[0,.25,.5,.75,1] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <>
    <header className={`v11-header is-${theme} ${hidden && !open ? 'is-hidden' : ''}`}>
      <a href="#top"><LogoMark/></a>
      <nav aria-label="Principal"><a href="#work">Projetos</a><a href="#sites">Sites</a><a href="#companies">Empresas</a><a href="#capabilities">O que fazemos</a><a href="#lab">Lab</a><a href="#partners">Rede</a></nav>
      <button className="v11-header-cta" onClick={() => onBrief()}>COMEÇAR PROJETO <span>↗</span></button>
      <button className="v11-menu-btn" onClick={() => setOpen(v=>!v)} aria-expanded={open} aria-controls="v11-main-menu" aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? 'FECHAR' : 'MENU'}</button>
    </header>
    <div id="v11-main-menu" className={`v11-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div>
        <span>NAVEGAÇÃO</span>
        {[['01','Projetos','#work'],['02','Sites','#sites'],['03','Empresas','#companies'],['04','O que fazemos','#capabilities'],['05','Como trabalhamos','#method'],['06','Creative Lab','#lab'],['07','Rede','#partners'],['08','Contato','#contact']].map(([n,label,href]) => <a key={href} href={href} onClick={()=>setOpen(false)}><small>{n}</small><strong>{label}</strong><i>↘</i></a>)}
        <button onClick={() => {setOpen(false); onBrief()}}>Tenho um projeto em mente <span>↗</span></button>
      </div>
    </div>
  </>
}

function Hero({ onBrief, pitch }) {
  const ref = useRef(null)
  usePointerTilt(ref, 8)
  const reducedMotion = useReducedMotion()
  const inView = useInViewport(ref, .08)
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (reducedMotion || !inView) return undefined
    const timer = setInterval(() => { if (!document.hidden) setActive(current => (current + 1) % capabilityGroups.length) }, 2100)
    return () => clearInterval(timer)
  }, [reducedMotion, inView])
  const group = capabilityGroups[active]
  return <section className="v11-hero" id="top" ref={ref} data-header-theme="dark" style={{'--accent':group.accent,'--rx':'0deg','--ry':'0deg','--px':'50%','--py':'50%'}}>
    <div className="v11-hero-grid"/>
    <div className="v11-hero-meta"><span>CREATIVE PRESENCE STUDIO</span><span>SÃO PAULO · BRASIL</span><span>ESTRATÉGIA → ENTREGA</span></div>
    {pitch?.active ? <div className="v12-pitch-ribbon"><small>{pitch.copy?.kicker || `RECORTE / ${pitch.segment || 'PROSPECÇÃO'}`}</small><strong>{pitch.prospect ? `PARA ${pitch.prospect}` : 'REPERTÓRIO PRIORIZADO'}</strong><span>{pitch.copy?.line || 'Projetos e provas reorganizados para este contexto.'}</span></div> : null}
    <div className="v11-hero-copy">
      <span>UMA DIREÇÃO. TODOS OS FORMATOS.</span>
      <h1>TUDO QUE<br/>UMA MARCA<br/><em>PRECISA.</em></h1>
      <p>Você não precisa chegar sabendo o nome do serviço. Chegue com um objetivo. A Seeven organiza o caminho e coloca a marca no mundo — do pixel ao papel.</p>
      <div><a href="#companies">EXPLORAR ↓</a><button onClick={() => onBrief()}>CONTAR UMA IDEIA ↗</button></div>
    </div>
    <div className="v11-hero-orbit" aria-label="Áreas que a Seeven conecta">
      <div className="v11-hero-core"><LogoMark/><small>UM CONTATO<br/>MUITAS ENTREGAS</small></div>
      {capabilityGroups.map((item,index)=><button key={item.id} onMouseEnter={()=>setActive(index)} onFocus={()=>setActive(index)} className={index===active?'is-active':''} style={{'--i':index,'--accent':item.accent}}><small>0{index+1}</small><strong>{item.short}</strong></button>)}
      <div className="v11-hero-current"><small>AGORA / 0{active+1}</small><strong>{group.label}</strong><span>{group.output}</span></div>
    </div>
    <div className="v11-scroll"><i/><span>ROLE PARA DESCOBRIR</span></div>
  </section>
}

function BrandStory() {
  const chapters = [
    {
      index: '01',
      title: 'ENTENDER',
      text: 'Você chega com um objetivo, um problema ou uma oportunidade. Antes de produzir, a gente entende o que realmente precisa mudar.'
    },
    {
      index: '02',
      title: 'ORGANIZAR',
      text: 'Definimos a ideia, a linguagem, as prioridades e as frentes certas. Sem empilhar entregas só porque cabem em um pacote.'
    },
    {
      index: '03',
      title: 'COLOCAR NO MUNDO',
      text: 'Site, conteúdo, vídeo, campanha, impresso, 3D, evento ou tecnologia saem da mesma lógica. É isso que faz a marca parecer uma só.'
    }
  ]
  return <section className="v12-story" id="about" data-header-theme="light">
    <div className="v12-story-intro">
      <span>00 / POR QUE A SEE7VEN EXISTE</span>
      <h2>BOAS IDEIAS SE PERDEM<br/>QUANDO CADA PONTO DE CONTATO<br/><em>PUXA PARA UM LADO.</em></h2>
      <p>Foi para resolver isso que a Seeven existe. Não somos uma fila de serviços. Somos uma direção criativa que conecta tudo que uma marca precisa colocar no mundo.</p>
    </div>
    <div className="v12-story-chapters">
      {chapters.map(chapter => <article key={chapter.index}>
        <small>{chapter.index}</small>
        <div><strong>{chapter.title}</strong><p>{chapter.text}</p></div>
        <i>↘</i>
      </article>)}
    </div>
    <div className="v12-story-flow" aria-label="Como a Seeven trabalha">
      <span>UM OBJETIVO</span><b>→</b><span>UMA DIREÇÃO</span><b>→</b><span>MUITAS ENTREGAS</span><b>→</b><span>UMA MARCA COERENTE</span>
    </div>
  </section>
}

function CompanyActions({ client, project, onOpen, compact = false }) {
  const website = clientWebsite(client)
  const instagram = clientInstagram(client)
  return <div className={`v11-company-actions ${compact?'is-compact':''}`}>
    {project ? <button onClick={() => { track('company_case_click',{company:client.id}); onOpen?.(project) }}>CASE ↗</button> : null}
    {website ? <a href={website} target="_blank" rel="noreferrer" onClick={()=>track('company_site_click',{company:client.id})}>SITE ↗</a> : null}
    {instagram ? <a href={instagram} target="_blank" rel="noreferrer" onClick={()=>track('company_instagram_click',{company:client.id})}>INSTAGRAM ↗</a> : null}
  </div>
}

function CompaniesAtlas({ clients = [], projects = [], onOpen, priorityClientIds = [] }) {
  const ref = useRef(null)
  const inspectorRef = useRef(null)
  const [selectedId, setSelectedId] = useState('')
  useScrollProgress(ref, p => {
    const el = ref.current
    if (!el || window.matchMedia('(max-width: 900px)').matches) return
    const intro = clamp((p - .02) / .28)
    const map = clamp((p - .18) / .24)
    el.style.setProperty('--introOpacity', String(1 - clamp((p - .12) / .22)))
    el.style.setProperty('--introY', `${Math.round(-52 * intro)}px`)
    el.style.setProperty('--mapOpacity', String(map))
    el.style.setProperty('--mapScale', String(.9 + map * .1))
    el.style.setProperty('--inspectorOpacity', String(clamp((p - .43) / .18)))
    el.querySelectorAll('.v11-atlas-node').forEach((node, index) => {
      const reveal = clamp((p - (.25 + index * .035)) / .13)
      node.style.setProperty('--nodeOpacity', String(reveal))
      node.style.setProperty('--nodeY', `${Math.round((1 - reveal) * 28)}px`)
      node.style.setProperty('--nodeScale', String(.84 + reveal * .16))
    })
  })
  const defaultPriority = ['sindpetshop','eventos','czk','venancio','eazy','seon','mibis','pufinho']
  const priority = [...new Set([...priorityClientIds, ...defaultPriority])]
  const featured = useMemo(() => {
    const map = new Map(clients.map(client => [client.id,client]))
    const rows = priority.map(id=>map.get(id)).filter(Boolean)
    clients.forEach(client => { if (!rows.some(row=>row.id===client.id)) rows.push(client) })
    return rows.slice(0,8)
  }, [clients, priorityClientIds.join('|')])
  const selected = clients.find(client => client.id === selectedId) || featured[0] || {}
  const selectedProject = projectForClient(projects, selected)
  const selectCompany = (id, reveal = false) => {
    setSelectedId(id)
    if (reveal && typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      window.setTimeout(() => inspectorRef.current?.scrollIntoView({ behavior:'smooth', block:'center' }), 120)
    }
  }
  const positions = [[19,25],[49,15],[80,27],[13,62],[32,47],[72,53],[31,80],[68,82]]
  return <section className="v11-companies" id="companies" ref={ref} data-header-theme="dark" style={{'--p':0,'--introOpacity':1,'--introY':'0px','--mapOpacity':0,'--mapScale':.9,'--inspectorOpacity':0}}>
    <div className="v11-companies-sticky">
      <div className="v11-companies-intro">
        <span>01 / EMPRESAS</span>
        <h2>EMPRESAS QUE<br/><em>PASSARAM POR AQUI.</em></h2>
        <p>Mercados diferentes. Problemas diferentes. O trabalho muda de forma — a responsabilidade de organizar e entregar continua a mesma.</p>
      </div>
      <div className="v11-atlas">
        <div className="v11-atlas-rings"><i/><i/><i/></div>
        <div className="v11-atlas-core"><LogoMark/><small>DIFERENTES CONTEXTOS<br/>UMA DIREÇÃO CRIATIVA</small></div>
        {featured.map((client,index)=>{
          const [x,y]=positions[index]
          const image = clientVisual(client)
          return <button key={client.id} className={`v11-atlas-node ${selected.id===client.id?'is-selected':''}`} style={{'--x':`${x}%`,'--y':`${y}%`,'--i':index,'--accent':client.accent||'#c9ff32'}} onMouseEnter={()=>selectCompany(client.id)} onFocus={()=>selectCompany(client.id)} onClick={()=>selectCompany(client.id,true)} data-cursor="EXPLORAR">
            <span>{image?<SmartImage src={image} alt="" loading="lazy"/>:<i/>}</span><div><small>{client.category||'PROJETO'}</small><strong>{client.name}</strong></div><b>↗</b>
          </button>
        })}
        <aside ref={inspectorRef} className="v11-atlas-inspector" style={{'--accent':selected.accent||'#c9ff32'}}>
          <small>PRESENÇA PÚBLICA / {selected.category||'MARCA'}</small><strong>{selected.name||'SEE7VEN'}</strong><p>{selected.publicProof || selected.handle || 'Explore a empresa, o projeto e a presença pública.'}</p>
          <CompanyActions client={selected} project={selectedProject} onOpen={onOpen}/>
        </aside>
        <div className="v11-atlas-legend"><span>INSTITUCIONAL</span><span>FOOD</span><span>INDÚSTRIA</span><span>EVENTOS</span><span>MÚSICA</span><span>LIFESTYLE</span></div>
      </div>
    </div>
  </section>
}

function CapabilityVisual({ group }) {
  return <div className={`v11-cap-visual cap-${group.id}`} aria-hidden="true"><i/><i/><i/><i/><span>{group.short}</span><b>7</b></div>
}

function Capabilities({ onBrief }) {
  const [active, setActive] = useState(0)
  const cardRef = useRef(null)
  const group = capabilityGroups[active]
  const selectCapability = (index, reveal = false) => {
    setActive(index)
    if (reveal && typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      window.setTimeout(() => cardRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 120)
    }
  }
  return <section className="v11-capabilities" id="capabilities" data-header-theme="light" style={{'--accent':group.accent}}>
    <div className="v11-cap-head"><span>02 / O QUE FAZEMOS</span><h2>SE EXISTE UM<br/>PONTO DE CONTATO,<br/><em>A GENTE PENSA NELE.</em></h2><p>Não existe pacote obrigatório. A gente entende o objetivo e combina as disciplinas necessárias para chegar lá.</p></div>
    <div className="v11-cap-shell">
      <div className="v11-cap-tabs" role="tablist" aria-label="Áreas de atuação">
        {capabilityGroups.map((item,index)=><button key={item.id} role="tab" aria-selected={index===active} className={index===active?'is-active':''} onClick={()=>selectCapability(index,true)} onMouseEnter={()=>selectCapability(index)}><small>0{index+1}</small><strong>{item.label}</strong><span>↗</span></button>)}
      </div>
      <div ref={cardRef} className="v11-cap-card" role="tabpanel" key={group.id}>
        <div className="v11-cap-card-top"><span>{group.label}</span><small>0{active+1} / 06</small></div>
        <h3>{group.lead}</h3>
        <div className="v11-cap-card-grid">
          <div><small>POR QUE ENTRA</small><p>{group.why}</p><small>ENTREGAS POSSÍVEIS</small><div className="v11-cap-pills">{group.items.map(item=><span key={item}>{item}</span>)}</div></div>
          <CapabilityVisual group={group}/>
        </div>
        <div className="v11-cap-output"><small>O QUE ISSO ORGANIZA</small><strong>{group.output}</strong></div>
        <button onClick={()=>onBrief(group.label)}>PRECISO DISSO ↗</button>
      </div>
    </div>
  </section>
}

function Method({ onBrief }) {
  const ref = useRef(null)
  const [active, setActive] = useState(0)
  const [manual, setManual] = useState(null)
  useScrollProgress(ref, p => {
    if (window.matchMedia('(max-width: 900px)').matches) return
    const next = Math.min(workflowStages.length-1, Math.floor(clamp(p*.999)*workflowStages.length))
    setActive(current=>current===next?current:next)
  })
  const stageIndex = manual ?? active
  const stage = workflowStages[stageIndex]
  return <section className="v11-method" id="method" ref={ref} data-header-theme="dark" style={{'--p':0,'--accent':stage.accent}}>
    <div className="v11-method-sticky">
      <div className="v11-method-title"><span>03 / COMO FUNCIONA</span><h2>UM BRIEFING.<br/><em>QUATRO MOVIMENTOS.</em></h2><p>Você não coordena seis fornecedores. A Seeven organiza o raciocínio e coordena a execução até tudo parecer parte da mesma decisão.</p></div>
      <div className="v11-method-stage">
        <div className="v11-method-nav">{workflowStages.map((item,index)=><button key={item.id} onMouseEnter={()=>setManual(index)} onMouseLeave={()=>setManual(null)} onFocus={()=>setManual(index)} onBlur={()=>setManual(null)} onClick={()=>setManual(index)} className={stageIndex===index?'is-active':''}><small>{item.index}</small><strong>{item.label}</strong><i/></button>)}</div>
        <article key={stage.id}>
          <div className="v11-method-index">{stage.index}<small>/04</small></div>
          <span>{stage.label.toUpperCase()}</span><h3>{stage.title}</h3>
          <div className="v11-method-columns"><div><small>O QUE ENTRA</small><p>{stage.question}</p></div><div><small>O QUE A GENTE FAZ</small><p>{stage.answer}</p></div></div>
          <b>{stage.output}</b>
          <button onClick={()=>onBrief(stage.label)}>COMEÇAR POR AQUI ↗</button>
        </article>
        <div className={`v11-method-machine s${stageIndex+1}`} aria-hidden="true"><div className="v11-machine-core">7</div><i/><i/><i/><i/><span>BRIEF</span><span>DIREÇÃO</span><span>PRODUÇÃO</span><span>PRESENÇA</span></div>
      </div>
    </div>
  </section>
}

function GeneratedProjectArt({ project, client }) {
  const accent = client?.accent || '#7b61ff'
  return <div className="v11-generated-art" style={{'--accent':accent}}><i/><i/><i/><span>{project.client || client?.name || 'SEE7VEN'}</span><b>7</b></div>
}

function FeaturedWork({ projects = [], clients = [], behance = [], onOpen, priorityIds = [], pitch }) {
  const selected = useMemo(() => {
    const scored = projects.map(project => ({ project, score:(project.caseStudy||caseStudies[project.id]?4:0)+(project.cover?3:0)+(findRelatedBehance(project,behance)?2:0)+(project.tags?.length||0)*.05 }))
      .sort((a,b)=>b.score-a.score)
    const priority = priorityIds.map(id => projects.find(project => project.id === id)).filter(Boolean)
    const candidates = [...priority, ...scored.map(item=>item.project)]
    const rows=[]; const usedProjects=new Set(); const usedClients=new Set()
    for (const project of candidates) {
      if (!project || usedProjects.has(project.id)) continue
      if (project.clientId && usedClients.has(project.clientId)) continue
      rows.push(project); usedProjects.add(project.id); if (project.clientId) usedClients.add(project.clientId)
      if (rows.length===3) break
    }
    return rows
  }, [projects,behance,priorityIds.join('|')])
  return <section className="v11-work" id="work" data-header-theme="light">
    <div className="v11-work-head"><span>04 / SELECTED WORK{pitch?.active ? ` · ${pitch.segment.toUpperCase()}` : ''}</span><h2>PROJETO BOM<br/><em>EXPLICA O QUE A GENTE FAZ.</em></h2><p>{pitch?.active ? `Este recorte começa pelo repertório mais próximo de ${pitch.prospect || `um contexto de ${pitch.segment}`}. O restante da experiência continua disponível logo abaixo.` : 'Três recortes. Três contextos. O ponto não é repetir um estilo — é mostrar como a direção muda quando o problema muda.'}</p></div>
    <div className="v11-work-grid">{selected.map((project,index)=>{
      const client=clients.find(item=>item.id===project.clientId)||{}
      const visual=projectVisual(project,behance)
      return <article key={project.id} className={`v11-work-card w${index+1}`} style={{'--accent':client.accent||'#7b61ff'}} data-cursor="VER CASE" onClick={()=>onOpen?.(project)}>
        <div className="v11-work-media">{visual?<SmartImage src={visual} alt="" loading="lazy"/>:<GeneratedProjectArt project={project} client={client}/>}<span>0{index+1}</span></div>
        <div className="v11-work-copy"><small>{project.label||client.category||'PROJETO'}</small><h3>{project.client}</h3><p>{project.title}</p><div>{(project.tags||[]).slice(0,4).map(tag=><span key={tag}>{tag}</span>)}</div><button onClick={event=>{event.stopPropagation();onOpen?.(project)}}>ABRIR CASE ↗</button></div>
      </article>
    })}</div>
  </section>
}

function LiveSites({ segment = '' }) {
  const sitePriority = { food:['caprichae','starprint','insights'], institucional:['insights','starprint','caprichae'], pet:['insights','caprichae','starprint'], b2b:['starprint','insights','caprichae'], web:['caprichae','starprint','insights'], eventos:['starprint','caprichae','insights'], nightlife:['caprichae','starprint','insights'] }
  const sites = prioritizeRows(liveSiteShowcases, sitePriority[segment] || [], site=>site.id)
  return <section className="v11-sites" id="sites" data-header-theme="light">
    <div className="v11-sites-head"><span>05 / SITES NO AR</span><h2>SITES QUE JÁ<br/><em>COLOCAMOS NO MUNDO.</em></h2><p>Alguns projetos pedem mais que layout bonito: precisam de navegação clara, conversão, dados e operação funcionando em produção.</p></div>
    <div className="v11-sites-grid">
      {sites.map((site, index) => <article key={site.id} className="v11-site-card" style={{'--accent':site.accent}}><div className="v11-site-browser"><div className="v11-site-browser-bar"><i/><i/><i/><span>{readableHost(site.url)}</span><a href={site.url} target="_blank" rel="noreferrer" onClick={()=>track('live_site_opened',{site:site.id})}>ABRIR ↗</a></div><div className="v11-site-browser-stage"><iframe src={site.url} title={`Preview ${site.name}`} loading="lazy" referrerPolicy="no-referrer"/><div className="v11-site-browser-shade"/></div></div><div className="v11-site-copy"><small>0{index+1} / {site.label}</small><h3>{site.name}</h3><strong>{site.headline}</strong><p>{site.summary}</p><div>{site.stack.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}
    </div>
  </section>
}

function CompanyIndex({ clients = [], projects = [], onOpen, priorityClientIds = [] }) {
  const sectionRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const trackRef = useRef(null)
  const cardRefs = useRef([])
  const reducedMotion = useReducedMotion()
  const inView = useInViewport(sectionRef, .08)
  const rows = prioritizeRows(clients.filter(item => item.active !== false), priorityClientIds, client=>client.id)

  useEffect(() => {
    if (paused || reducedMotion || !inView || rows.length < 2) return undefined
    const timer = window.setInterval(() => { if (!document.hidden) setActive(current => (current + 1) % rows.length) }, 4200)
    return () => window.clearInterval(timer)
  }, [paused, reducedMotion, inView, rows.length])

  useEffect(() => {
    const track = trackRef.current
    const node = cardRefs.current[active]
    if (!track || !node) return
    const left = node.offsetLeft - (track.clientWidth - node.clientWidth) / 2
    track.scrollTo({ left: Math.max(0, left), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  const move = direction => setActive(current => (current + direction + rows.length) % rows.length)

  return <section ref={sectionRef} className="v11-company-index" data-header-theme="dark">
    <div className="v11-company-index-head"><span>06 / PRESENÇA PÚBLICA</span><h2>MAIS MARCAS.<br/><em>MAIS CONTEXTOS.</em></h2><p>Não é outra lista de clientes. É um atalho para conhecer marcas reais, abrir seus canais e ver como cada contexto pede uma presença diferente.</p></div>
    <div className="v11-company-carousel-shell" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onTouchStart={()=>setPaused(true)}>
      <div className="v11-company-carousel-toolbar"><span>DESLIZE / EXPLORE</span><div><button onClick={()=>move(-1)} aria-label="Marca anterior">←</button><strong>{String(active+1).padStart(2,'0')} / {String(rows.length).padStart(2,'0')}</strong><button onClick={()=>move(1)} aria-label="Próxima marca">→</button></div></div>
      <div className="v11-company-carousel" ref={trackRef}>
        {rows.map((client,index)=>{
          const project = projectForClient(projects, client)
          const visual = clientVisual(client)
          return <article ref={node => { cardRefs.current[index] = node }} key={client.id} className={`v11-company-card ${index===active?'is-active':''}`} style={{'--accent':client.accent||'#c9ff32'}} onClick={()=>setActive(index)} onFocus={()=>setActive(index)} tabIndex={0} aria-current={index===active?'true':undefined}>
            <div className="v11-company-card-media">{visual?<SmartImage src={visual} alt="" loading="lazy"/>:<GeneratedProjectArt project={project||{client:client.name}} client={client}/>}<span>{String(index+1).padStart(2,'0')} / {client.category||'MARCA'}</span></div>
            <div className="v11-company-card-copy"><small>{client.handle||'PRESENÇA PÚBLICA'}</small><h3>{client.name}</h3><p>{client.publicProof || `Conheça a presença pública de ${client.name}.`}</p><CompanyActions client={client} project={project} onOpen={onOpen}/></div>
          </article>
        })}
      </div>
      <div className="v11-company-progress" aria-hidden="true"><i style={{width:`${rows.length ? ((active+1)/rows.length)*100 : 0}%`}}/></div>
    </div>
  </section>
}

function LabVisualMaterial() {
  return <div className="v11-shirt-scene v11-spline-scene">
    <div className="v11-spline-glow"/>
    <iframe
      src="https://my.spline.design/darkspideycopy-bv4dKMB6imfvzRHpqhD50j0c/"
      title="Spline material study"
      loading="lazy"
      allow="fullscreen"
    />
    <div className="v11-spline-tags">
      <span>UNIFORME</span>
      <span>MERCH</span>
      <span>OBJETO</span>
      <span>IDENTIDADE</span>
    </div>
  </div>
}

function LabVisual3D() {
  return <div className="v11-3d-scene v11-spline-prototype">
    <div className="v11-spline-glow"/>
    <iframe
      src="https://my.spline.design/rocket-rZ67U8pm49bdMrOqI2oyK72d/"
      title="Spline 3D prototype"
      loading="lazy"
      allow="fullscreen"
    />
    <div className="v11-spline-tags"><span>BLENDER</span><span>3D</span><span>PROTÓTIPO</span><span>VALIDAÇÃO</span></div>
  </div>
}

function CreativeLab({ reels = [], behance = [] }) {
  const ref = useRef(null)
  const stageRef = useRef(null)
  usePointerTilt(ref, 16)
  const [mode,setMode]=useState('material')
  const selectLabMode = id => {
    setMode(id)
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches) {
      window.setTimeout(() => stageRef.current?.scrollIntoView({ behavior:'smooth', block:'start' }), 120)
    }
  }
  const motionItems = useMemo(()=>{
    const output=[]; const usedSrc=new Set(); const usedClient=new Set()
    const add=(item, allowSameClient=false)=>{
      const src=item.poster||item.cover||''
      const clientKey=normalizeText(item.client||item.clientId||'seeven')
      if(!src||usedSrc.has(src)||(!allowSameClient&&clientKey&&usedClient.has(clientKey)))return
      usedSrc.add(src); if(clientKey)usedClient.add(clientKey); output.push(item)
    }
    reels.filter(item=>item.active!==false && (item.video || item.permalink || (item.poster && !isFallbackPoster(item.poster)))).forEach(item=>add(item))
    behance.forEach(item=>add({id:`b-${item.id}`,title:item.title,client:item.client,poster:item.cover,url:item.url}))
    if(output.length<4) reels.filter(item=>item.poster).forEach(item=>add(item,true))
    return output.slice(0,4)
  },[reels,behance])
  const modelProject = behance.find(item=>/modelagem|3d|blender/i.test(`${item.title} ${(item.tools||[]).join(' ')}`))
  const copy = {
    material:{kicker:'MATERIAL / PHYSICAL',title:'DA TELA PARA\nO MUNDO REAL.',text:'Uniforme, impresso, embalagem, sinalização e peças que fazem a marca circular fora do navegador.',cta:'A MARCA TAMBÉM É MATÉRIA.'},
    three:{kicker:'3D / PROTOTYPE',title:'TESTAR ANTES\nDE PRODUZIR.',text:'Blender e visualização 3D entram quando forma, volume, luz ou ambiente precisam ser validados antes da execução.',cta:'PROTOTIPAR REDUZ IMPROVISO.'},
    motion:{kicker:'MOTION / AUDIOVISUAL',title:'ALGUMAS IDEIAS\nPRECISAM SE MOVER.',text:'Roteiro, captação, edição e motion para quando tempo, som e ritmo fazem parte da mensagem.',cta:'MOVIMENTO TAMBÉM É IDENTIDADE.'}
  }[mode]
  return <section className="v11-lab" id="lab" ref={ref} data-header-theme="dark" style={{'--rx':'0deg','--ry':'0deg','--px':'50%','--py':'50%'}}>
    <div className="v11-lab-head"><span>07 / CREATIVE LAB</span><h2>{copy.title.split('\n').map((line,index)=><React.Fragment key={line}>{index===1?<em>{line}</em>:line}{index===0?<br/>:null}</React.Fragment>)}</h2><p>{copy.text}</p></div>
    <div className="v11-lab-shell">
      <div className="v11-lab-tabs">{[['material','MATERIAL'],['three','3D / PROTÓTIPO'],['motion','MOTION']].map(([id,label])=><button key={id} className={mode===id?'is-active':''} aria-pressed={mode===id} onClick={()=>selectLabMode(id)}>{label}</button>)}</div>
      <div ref={stageRef} className="v11-lab-stage" key={mode}>
        <div className="v11-lab-caption"><small>{copy.kicker}</small><strong>{copy.cta}</strong>{mode==='three'&&modelProject?<a href={safeLink(modelProject.url)} target="_blank" rel="noreferrer">VER ESTUDO 3D ↗</a>:null}</div>
        {mode==='material'?<LabVisualMaterial/>:mode==='three'?<LabVisual3D/>:<div className="v11-motion-board">{motionItems.map((item,index)=>{const href=safeLink(item.permalink||item.video||item.url||'');return <a key={item.id||index} href={href||undefined} target={href?'_blank':undefined} rel="noreferrer"><div>{item.poster?<SmartImage src={item.poster} alt="" loading="lazy"/>:null}<span>0{index+1}</span><i>{item.video||item.permalink?'▶':'↗'}</i></div><small>{item.client||'SEE7VEN'}</small><strong>{item.title||'Motion study'}</strong></a>})}</div>}
      </div>
      <div className="v11-format-spectrum"><span>TELA</span><i>→</i><span>RUA</span><i>→</i><span>PALCO</span><i>→</i><span>PAPEL</span><i>→</i><span>OBJETO</span></div>
    </div>
  </section>
}

function Thinking() {
  return <section className="v11-thinking" data-header-theme="dark">
    <div className="v11-thinking-head"><span>08 / COMO PENSAMOS</span><h2>ANTES DE CRIAR,<br/><em>A GENTE ORGANIZA.</em></h2><p>A ferramenta muda. A lógica vem antes: entender, testar, construir o sistema e só então produzir em escala.</p></div>
    <div className="v11-thinking-grid">
      <article className="t-context"><small>01 / CONTEXTO</small><h3>Informação demais vira hierarquia.</h3><p>Pesquisa, público, prioridade e mensagem antes da composição.</p><div><i/><i/><i/><i/></div></article>
      <article className="t-prototype"><small>02 / PROTÓTIPO</small><h3>Testar antes de produzir.</h3><p>Wireframe, mockup, Blender e protótipos quando a forma precisa ser validada.</p><div className="v11-mini-wire"><i/><i/><i/><b>7</b></div></article>
      <article className="t-system"><small>03 / SISTEMA</small><h3>Uma regra boa vale por muitas peças.</h3><p>Componentes, linguagem e critérios para o projeto continuar coerente quando cresce.</p><div className="v11-mini-system"><span/><span/><span/><span/><span/></div></article>
      <article className="t-deliver"><small>04 / ENTREGA</small><h3>Publicar também faz parte do design.</h3><p>Produção, deploy, mídia, impressão, mensuração e ajustes até o trabalho existir de verdade.</p><div className="v11-mini-deliver"><b>IDEIA</b><i>→</i><b>MUNDO</b></div></article>
    </div>
  </section>
}

function PartnerNetwork({ partners = [] }) {
  const items = partners.filter(item=>item.active!==false)
  const first = items.filter((_,index)=>index%2===0)
  const second = items.filter((_,index)=>index%2===1)
  const row = (list,reverse=false) => {
    const loop=[...list,...list]
    return <div className={`v11-partner-row ${reverse?'is-reverse':''}`}><div>{loop.map((partner,index)=>{const href=safeLink(partner.url);return <a key={`${partner.id||partner.handle}-${index}`} href={href||'#contact'} target={href?'_blank':undefined} rel="noreferrer" onClick={()=>track('partner_opened',{partner:partner.id||partner.handle})}><span>{partner.handle||partner.name}</span><i>↗</i></a>})}</div></div>
  }
  return <section className="v11-network" id="partners" data-header-theme="dark">
    <div className="v11-network-head"><span>09 / CREATIVE NETWORK</span><h2>MAIS PROJETO.<br/><em>MAIS REDE.</em></h2><p>Quando a entrega pede novas mãos, conectamos criadores, influenciadores e empresas parceiras sem transformar o projeto em um quebra-cabeça de fornecedores.</p><div><strong>{items.length||25}</strong><small>CONEXÕES</small><i>1</i><small>DIREÇÃO</small><b>∞</b><small>COMBINAÇÕES</small></div></div>
    <div className="v11-partner-marquees">{row(first)}{row(second,true)}</div>
    <p>TOQUE OU CLIQUE EM UM NOME PARA ABRIR A PRESENÇA PÚBLICA DO PARCEIRO.</p>
  </section>
}

function ProblemSolver({ services = [], onBrief }) {
  const fallback=[
    {id:'sell',problem:'Quero vender mais',answer:'Organizamos oferta, presença, mídia e conversão para reduzir a distância entre atenção e ação.',stack:['Campanha','Conteúdo','Web','Performance']},
    {id:'small',problem:'Minha marca parece pequena',answer:'Construímos linguagem, sistema e consistência para aumentar percepção antes de aumentar volume.',stack:['Estratégia','Branding','Direção visual']},
    {id:'confuse',problem:'Ninguém entende o que fazemos',answer:'Transformamos complexidade em mensagem, hierarquia, experiência e prova.',stack:['Posicionamento','Copy','Web','Conteúdo']},
    {id:'launch',problem:'Preciso colocar uma ideia no mundo',answer:'Do briefing à produção, conectamos as frentes necessárias para lançar sem perder direção.',stack:['Estratégia','Produção','Motion','Físico']}
  ]
  const list=(services?.length?services:fallback).slice(0,6)
  const [active,setActive]=useState(0)
  const item=list[active]||fallback[0]
  return <section className="v11-solver" data-header-theme="light">
    <div className="v11-solver-head"><span>10 / COMEÇAR PELO PROBLEMA</span><h2>VOCÊ NÃO PRECISA<br/>SABER O NOME<br/><em>DO SERVIÇO.</em></h2><p>Conte o que precisa acontecer. A gente ajuda a descobrir quais frentes fazem sentido.</p></div>
    <div className="v11-solver-shell"><div>{list.map((row,index)=><button key={row.id||index} className={index===active?'is-active':''} aria-pressed={index===active} onClick={()=>setActive(index)}><small>0{index+1}</small><strong>{row.problem}</strong><span>↗</span></button>)}</div><article key={item.id||active}><span>SE FOSSE ESSE O PROBLEMA</span><h3>{item.answer}</h3><div>{(item.stack||[]).map(tag=><b key={tag}>{tag}</b>)}</div><button onClick={()=>onBrief(item.problem)}>QUERO CONVERSAR SOBRE ISSO ↗</button></article></div>
  </section>
}

function Contact({ onBrief, pitch, interest = '' }) {
  const text=encodeURIComponent('Olá! Conheci a Seeven pelo site e quero conversar sobre um projeto.')
  const contextualTitle = pitch?.cta?.title || (interest==='web' ? 'SEU PRÓXIMO SITE\nPODE COMEÇAR AQUI.' : interest==='brand' ? 'SUA PRÓXIMA MARCA\nPODE COMEÇAR AQUI.' : interest==='network' ? 'PRECISA DE MAIS BRAÇOS?\nA GENTE CONECTA.' : '')
  const titleParts = contextualTitle ? contextualTitle.split('\n') : []
  return <section className="v11-contact" id="contact" data-header-theme="light">
    <span>11 / START SOMETHING{pitch?.prospect ? ` · ${pitch.prospect}` : ''}</span>{contextualTitle ? <h2>{titleParts[0]}<br/><em>{titleParts[1]}</em></h2> : <h2>TEM UMA IDEIA?<br/><em>COLOCA NA MESA.</em></h2>}<p>{pitch?.active ? `Você já viu um recorte priorizado para ${pitch.prospect || pitch.segment}. Agora podemos transformar objetivo, problema ou oportunidade em um escopo real.` : 'Não precisa montar o escopo antes de falar com a gente. Pode chegar com um objetivo, um problema, uma referência ou só uma ideia ainda mal resolvida.'}</p>
    <div className="v11-contact-actions"><button onClick={()=>onBrief()}>BRIEF RÁPIDO · 60S ↗</button><a href={`https://wa.me/${WA_KAREN}?text=${text}`} target="_blank" rel="noreferrer">CONVERSAR AGORA ↗</a></div>
    <div className="v11-contact-people"><a href={`https://wa.me/${WA_GUSTAVO}?text=${text}`} target="_blank" rel="noreferrer"><small>DIREÇÃO</small><strong>Gustavo</strong><span>+55 11 92062-6850 ↗</span></a><a href={`https://wa.me/${WA_KAREN}?text=${text}`} target="_blank" rel="noreferrer"><small>NOVOS PROJETOS</small><strong>Karen</strong><span>+55 11 97149-3985 ↗</span></a></div>
  </section>
}

function ProjectMedia({ project, client, visual }) {
  const cover = visual || project.cover || client?.publicCover || client?.brandPoster
  return <div className="v10-project-media" style={{ '--accent': client?.accent || project.accent || '#b7ff35' }}>{cover ? <SmartImage src={cover} alt="" loading="lazy"/> : null}<div className="v10-project-shape"><span>{project.client?.slice(0,1) || '7'}</span></div><div className="v10-project-grid"/></div>
}

function CaseBentoStory({ project, study, intelligence, visual }) {
  const focus = intelligence?.focus || ['Clareza','Sistema','Escala']
  const signal = intelligence?.signal || [64,72,82,70,91,86]
  return <section className="v10-case-story"><div className="v10-case-story-head"><span className="v10-kicker">RACIOCÍNIO / CASE</span><h2>O visual é a última parte<br/>de uma <em>boa decisão.</em></h2></div><div className="v10-case-story-grid"><div className="v10-case-story-left">{[['01','Contexto', intelligence?.context || study.challenge],['02','Insight', intelligence?.insight || 'Encontrar a ideia que simplifica decisões e organiza prioridades.'],['03','Restrição', intelligence?.constraint || 'Resolver o problema sem criar ruído novo.']].map(([n,t,d]) => <article key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div></article>)}<div className="v10-case-signal"><span>CHALLENGE</span><div>{signal.map((value,i)=><i key={i} style={{height:`${Math.max(18,value)}%`}}/> )}</div><small>{focus.join(' · ')}</small></div></div><div className="v10-case-story-visual">{visual ? <SmartImage src={visual} alt="" loading="lazy"/> : null}<div><LogoMark/><small>{project.client}</small><strong>{intelligence?.objective || study.headline || project.title}</strong></div></div><div className="v10-case-story-right"><div className="v10-case-decision-hero"><span>DESIGN DECISION</span><strong>{intelligence?.decision || study.strategy}</strong><i>7</i></div><div className="v10-case-decision-list"><p>{intelligence?.system || (study.execution || []).join(' → ')}</p><p>{intelligence?.result || study.result}</p><p>{(intelligence?.channels || study.execution || []).join(' · ')}</p></div></div></div></section>
}

function BentoCase({ project, clients, behance, onClose, onBrief }) {
  const client = clients.find(c => c.id === project.clientId) || {}
  const study = project.caseStudy || caseStudies[project.id] || {}
  const intelligence = projectIntelligence.find(item => item.id === project.id)
  const source = safeLink(study.source || project.href || client.website || client.url)
  const accent = study.accent || intelligence?.accent || client.accent || '#b7ff35'
  const visual = projectVisual(project, behance) || clientVisual(client)
  const gallery = behance.filter(item => { const a=normalizeText(item.client); const b=normalizeText(project.client); return b && (a.includes(b) || b.split(' ').some(word=>word.length>4&&a.includes(word))) }).slice(0,4)
  useBodyLock(Boolean(project))
  useEffect(()=>{const close=e=>{if(e.key==='Escape')onClose()};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[onClose])
  return <div className="v10-case" role="dialog" aria-modal="true" aria-label={`Case ${project.client}`} style={{'--accent':accent}}><header><LogoMark/><button onClick={onClose}>Fechar <span>×</span></button></header><main><section className="v10-case-hero"><div><span className="v10-kicker">{study.eyebrow || project.label || 'CASE STUDY'}</span><h1>{study.headline || project.title}</h1><p>{study.intro || project.summary}</p><div className="v10-case-tags">{(study.execution || project.tags || []).map(item=><span key={item}>{item}</span>)}</div></div><ProjectMedia project={project} client={client} visual={visual}/></section><CaseBentoStory project={project} study={study} intelligence={intelligence} visual={visual}/>{gallery.length?<section className="v10-case-gallery"><div><span className="v10-kicker">PRESENÇA EM ESCALA</span><h2>Uma ideia não termina<br/>no primeiro formato.</h2></div><div>{gallery.map(item=><a key={item.id} href={safeLink(item.url)} target="_blank" rel="noreferrer"><SmartImage src={item.cover} alt={item.title} loading="lazy"/><span>{item.title}</span></a>)}</div></section>:null}<section className="v10-case-end"><div className="v10-case-end-top"><span>DO PIXEL AO PAPEL.</span><div className="v10-case-end-tags">{(study.execution || project.tags || []).slice(0,6).map(item=><span key={item}>{item}</span>)}</div></div><h2>Uma ideia só ganha força<br/>quando <em>vira presença.</em></h2><p>O case termina aqui. A lógica não: a mesma direção pode continuar em novos canais, formatos e pontos de contato.</p><div className="v10-case-end-actions">{source?<a href={source} target="_blank" rel="noreferrer">Ver presença pública {arrow}</a>:null}<button onClick={()=>{onClose();onBrief(`Projeto parecido com ${project.client}`)}}>Quero construir algo assim {arrow}</button></div></section></main></div>
}

function Brief({ open, onClose, initial = '' }) {
  const [step,setStep]=useState(0)
  const [form,setForm]=useState({need:initial,company:'',timing:'',name:''})
  const timerRef=useRef(0)
  useBodyLock(open)
  useEffect(()=>{if(open){setStep(initial?1:0);setForm(v=>({...v,need:initial||''}))}return()=>clearTimeout(timerRef.current)},[open,initial])
  if(!open)return null
  const choices=['Projeto 360° / várias frentes','Marca / identidade','Site / landing / sistema','Conteúdo / social','Campanha / mídia','Vídeo / motion','Impresso / evento','Tecnologia / automação','Ainda não sei']
  const send=()=>{const message=`Olá! Quero conversar sobre um projeto com a Seeven.\n\nPreciso de: ${form.need||'-'}\nMarca/empresa: ${form.company||'-'}\nPrazo: ${form.timing||'-'}\nMeu nome: ${form.name||'-'}`;track('brief_completed',{need:form.need});window.open(`https://wa.me/${WA_KAREN}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');onClose()}
  const choose=(field,value,next)=>{setForm(current=>({...current,[field]:value}));clearTimeout(timerRef.current);timerRef.current=setTimeout(()=>setStep(next),240)}
  return <div className="v10-brief" role="dialog" aria-modal="true" aria-label="Brief rápido"><header><LogoMark/><button onClick={onClose}>Fechar ×</button></header><div className="v10-brief-progress"><i style={{width:`${((step+1)/4)*100}%`}}/></div><div className="v10-brief-card"><span className="v10-kicker">BRIEF RÁPIDO · 0{step+1}/04</span>{step===0&&<><h2>O que precisamos<br/>construir?</h2><p className="v105-brief-hint">Toque em uma opção. A próxima pergunta abre automaticamente.</p><div className="v10-choice-grid">{choices.map(x=><button className={form.need===x?'is-active':''} key={x} onClick={()=>choose('need',x,1)}>{x}<span>{form.need===x?'✓':'+'}</span></button>)}</div></>}{step===1&&<><h2>Para qual marca<br/>ou empresa?</h2><input autoFocus value={form.company} onChange={e=>setForm({...form,company:e.target.value})} onKeyDown={e=>{if(e.key==='Enter'&&e.currentTarget.value.trim())setStep(2)}} placeholder="Nome da marca / empresa"/></>}{step===2&&<><h2>Quando isso precisa<br/>estar no mundo?</h2><p className="v105-brief-hint">Escolha uma faixa. Você pode detalhar depois no WhatsApp.</p><div className="v10-choice-grid">{['O quanto antes','30–60 dias','2–4 meses','Sem prazo definido'].map(x=><button className={form.timing===x?'is-active':''} key={x} onClick={()=>choose('timing',x,3)}>{x}<span>{form.timing===x?'✓':'+'}</span></button>)}</div></>}{step===3&&<><h2>Como podemos<br/>chamar você?</h2><input autoFocus value={form.name} onChange={e=>setForm({...form,name:e.target.value})} onKeyDown={e=>{if(e.key==='Enter'&&e.currentTarget.value.trim())send()}} placeholder="Seu nome"/></>}<a className="v10-brief-direct" href={`https://wa.me/${WA_KAREN}?text=${encodeURIComponent('Olá! Vim pelo site da Seeven e prefiro conversar direto sobre meu projeto.')}`} target="_blank" rel="noreferrer">Prefiro conversar direto no WhatsApp ↗</a><div className="v10-brief-actions"><button onClick={()=>step>0?setStep(step-1):onClose()}>← Voltar</button>{step===1?<button disabled={!form.company.trim()} onClick={()=>setStep(2)}>Continuar →</button>:step===3?<button disabled={!form.name.trim()} onClick={send}>Enviar no WhatsApp ↗</button>:<span className="v105-auto-step">AVANÇO AUTOMÁTICO</span>}</div></div></div>
}

function Footer() {
  return <footer className="v11-footer"><LogoMark/><div><a href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">BEHANCE ↗</a><a href="#top">VOLTAR AO TOPO ↑</a></div><small>© {new Date().getFullYear()} SEE7VEN · V12.1 · PRESENCE FROM PIXEL TO PAPER.</small></footer>
}

export default function App() {
  const cms=useCmsContent()
  const pitch=useMemo(()=>readPitchContext(),[])
  const [interest,setInterest]=useState('')
  const [caseProject,setCaseProject]=useState(null)
  const [brief,setBrief]=useState(false)
  const [briefPreset,setBriefPreset]=useState('')
  const openBrief=(preset='')=>{const contextual=preset || pitch.cta?.brief || '';setBriefPreset(contextual);setBrief(true);track('brief_started',{preset:contextual||undefined})}
  const openCase=(project,source='site',push=true)=>{if(!project)return;const tags=(project.tags||[]).join(' ').toLowerCase();setInterest(tags.includes('web')||tags.includes('site')?'web':tags.includes('brand')||tags.includes('identidade')?'brand':interest);setCaseProject(project);if(push&&window.location.pathname!==`/work/${project.id}`)history.pushState({case:project.id},'',`/work/${encodeURIComponent(project.id)}`);track('case_opened',{project:project.id,source})}
  const closeCase=(push=true)=>{setCaseProject(null);if(push&&/^\/work\//.test(window.location.pathname))history.pushState({},'',`/${window.location.search||''}${window.location.hash||''}`)}

  useEffect(()=>{document.documentElement.classList.add('seeven-v11');const meta=document.querySelector('meta[name="theme-color"]')||document.head.appendChild(Object.assign(document.createElement('meta'),{name:'theme-color'}));meta.content='#080808';return()=>document.documentElement.classList.remove('seeven-v11')},[])
  useEffect(()=>{track('page_view',{source:cms.source,version:'v12.1-story-adminfix'})},[cms.source])
  useEffect(()=>{if(!pitch.active)return;track('pitch_view',{segment:pitch.segment||undefined,prospect:pitch.prospect||undefined,pitch_id:pitch.pitchId||undefined})},[pitch.active])
  useEffect(()=>{const ids=['top','about','companies','capabilities','work','sites','partners','contact'];if(!('IntersectionObserver' in window))return;const seen=new Set();const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting&&entry.intersectionRatio>=.3&&!seen.has(entry.target.id)){seen.add(entry.target.id);track('section_view',{section:entry.target.id})}}),{threshold:[.3]});ids.map(id=>document.getElementById(id)).filter(Boolean).forEach(node=>observer.observe(node));return()=>observer.disconnect()},[cms.source])
  useEffect(()=>{const resolvePath=()=>{const match=decodeURIComponent(window.location.pathname).match(/^\/work\/([^/]+)\/?$/);if(!match){setCaseProject(null);return}const project=cms.projects.find(item=>item.id===match[1]);if(project)setCaseProject(project)};resolvePath();window.addEventListener('popstate',resolvePath);return()=>window.removeEventListener('popstate',resolvePath)},[cms.projects])
  useEffect(()=>{const defaultTitle='SEE7VEN — Creative Presence Studio';const defaultDescription='Estratégia, branding, web, conteúdo, motion, performance, tecnologia e presença física conectadas em uma única direção.';if(caseProject){const description=caseProject.summary||caseProject.title||defaultDescription;const visual=projectVisual(caseProject,cms.behance)||clientVisual(cms.clients.find(item=>item.id===caseProject.clientId)||{});const image=visual?(visual.startsWith('http')?visual:`${window.location.origin}${visual.startsWith('/')?'':'/'}${visual}`):`${window.location.origin}/og-see7ven.png`;const canonical=`${window.location.origin}/work/${encodeURIComponent(caseProject.id)}`;document.title=`${caseProject.client} — Case SEE7VEN`;setMeta('description',description);setMeta('og:title',document.title,true);setMeta('og:description',description,true);setMeta('og:url',canonical,true);setMeta('og:image',image,true);setMeta('twitter:title',document.title);setMeta('twitter:description',description);setMeta('twitter:image',image);setCanonical(canonical)}else{document.title=defaultTitle;const canonical=window.location.origin+'/';const image=`${window.location.origin}/og-see7ven.png`;setMeta('description',defaultDescription);setMeta('og:title',defaultTitle,true);setMeta('og:description',defaultDescription,true);setMeta('og:url',canonical,true);setMeta('og:image',image,true);setMeta('twitter:title',defaultTitle);setMeta('twitter:description',defaultDescription);setMeta('twitter:image',image);setCanonical(canonical)}},[caseProject,cms.clients,cms.behance])

  return <div className="v11-shell">
    <a className="v11-skip" href="#main-content">PULAR PARA O CONTEÚDO</a>
    <ExperienceGate projects={cms.projects} behance={cms.behance}/>
    <CursorHalo/>
    <Header onBrief={openBrief}/>
    <main id="main-content">
      <Hero onBrief={openBrief} pitch={pitch}/>
      <BrandStory/>
      <CompaniesAtlas clients={cms.clients} projects={cms.projects} priorityClientIds={pitchClientIds(cms.projects,pitch.ids)} onOpen={project=>openCase(project,'company_atlas')}/>
      <Capabilities onBrief={openBrief}/>
      <Method onBrief={openBrief}/>
      <FeaturedWork projects={cms.projects} clients={cms.clients} behance={cms.behance} priorityIds={pitch.ids} pitch={pitch} onOpen={project=>openCase(project,'selected_work')}/>
      <LiveSites segment={pitch.segment}/>
      <CompanyIndex clients={cms.clients} projects={cms.projects} priorityClientIds={pitchClientIds(cms.projects,pitch.ids)} onOpen={project=>openCase(project,'company_index')}/>
      <CreativeLab reels={cms.reels} behance={cms.behance}/>
      <Thinking/>
      <PartnerNetwork partners={cms.partners}/>
      <ProblemSolver services={cms.services} onBrief={openBrief}/>
      <Contact onBrief={openBrief} pitch={pitch} interest={interest}/>
    </main>
    <Footer/>
    {caseProject?<BentoCase project={caseProject} clients={cms.clients} behance={cms.behance} onClose={()=>closeCase()} onBrief={openBrief}/>:null}
    <Brief open={brief} onClose={()=>setBrief(false)} initial={briefPreset}/>
  </div>
}
