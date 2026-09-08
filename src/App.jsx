import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useCmsContent } from './useCmsContent'
import { caseStudies } from './data'

const WA_KAREN = '5511971493985'
const WA_GUSTAVO = '5511920626850'
const arrow = '↗'

function track(event, detail = {}) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...detail })
  } catch (_) {}
}

function clamp(value, min = 0, max = 1) { return Math.min(max, Math.max(min, value)) }

function useSectionProgress(ref) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const travel = Math.max(rect.height - window.innerHeight, 1)
      setProgress(clamp((-rect.top) / travel))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [ref])
  return progress
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

function SmartImage({ src, alt = '', ...props }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src || failed) return null
  return <img src={src} alt={alt} onError={() => setFailed(true)} decoding="async" {...props}/>
}

function LogoMark() {
  return <span className="v10-logo" aria-label="Seeven"><i>7</i><b>SEE7VEN</b></span>
}

function Header({ onBrief }) {
  const [open, setOpen] = useState(false)
  useBodyLock(open)
  return <>
    <header className="v10-header">
      <a href="#top" className="v10-brand"><LogoMark/></a>
      <nav className="v10-nav" aria-label="Principal">
        <a href="#work">Projetos</a><a href="#system">Sistema</a><a href="#contact">Contato</a>
      </nav>
      <button className="v10-start" onClick={() => onBrief()}>Começar projeto <span>{arrow}</span></button>
      <button className="v10-menu-btn" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'FECHAR' : 'MENU'}</button>
    </header>
    <div className={`v10-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="v10-menu-inner">
        <span className="v10-kicker">NAVEGAÇÃO</span>
        {[['01','Projetos','#work'],['02','Como pensamos','#system'],['03','Motion','#motion'],['04','Contato','#contact']].map(([n,l,h]) => <a key={h} href={h} onClick={() => setOpen(false)}><small>{n}</small><strong>{l}</strong><span>↘</span></a>)}
        <button onClick={() => { setOpen(false); onBrief() }}>Tenho um projeto em mente <span>{arrow}</span></button>
      </div>
    </div>
  </>
}

function Hero({ projects }) {
  const ref = useRef(null)
  const progress = useSectionProgress(ref)
  const featured = projects.slice(0, 5)
  const phase = clamp(progress * 1.35)
  return <section className="v10-hero" id="top" ref={ref} style={{ '--p': phase }}>
    <div className="v10-hero-sticky">
      <div className="v10-ambient"/>
      <div className="v10-hero-meta"><span>CREATIVE PRESENCE STUDIO</span><span>SÃO PAULO · BRASIL</span><span>EST. 2024</span></div>
      <div className="v10-hero-copy">
        <span className="v10-kicker">ESTRATÉGIA · DESIGN · TECNOLOGIA</span>
        <h1><span>MARCAS</span><span>PRECISAM DE</span><em>PRESENÇA.</em></h1>
        <p>Construímos sistemas de marca que conectam estratégia, identidade, conteúdo, web, motion e mundo físico.</p>
      </div>
      <div className="v10-orbit" aria-hidden="true">
        {featured.map((project, i) => {
          const client = project.client || 'SEE7VEN'
          const angle = (i / Math.max(featured.length, 1)) * Math.PI * 2
          const x = 50 + Math.cos(angle) * 37
          const y = 50 + Math.sin(angle) * 31
          return <div className="v10-orbit-node" key={project.id} style={{ '--x': `${x}%`, '--y': `${y}%`, '--delay': i }}><i/><span>{client}</span></div>
        })}
        <div className="v10-orbit-core"><LogoMark/><small>ONE CONNECTED SYSTEM</small></div>
      </div>
      <a href="#system" className="v10-scroll-cue"><i/><span>Role para explorar</span></a>
    </div>
  </section>
}

const nodes = [
  ['Estratégia','Direção antes da execução'],['Branding','Identidade reconhecível'],['Conteúdo','Consistência que se move'],
  ['Web','Experiências que convertem'],['Motion','Ideias com ritmo'],['Físico','Presença fora da tela']
]

function PresenceSystem() {
  const ref = useRef(null)
  const p = useSectionProgress(ref)
  const active = Math.min(nodes.length - 1, Math.floor(clamp(p * 1.02) * nodes.length))
  return <section className="v10-system" id="system" ref={ref} style={{ '--p': p }}>
    <div className="v10-system-sticky">
      <div className="v10-section-head"><span className="v10-kicker">02 / PRESENCE SYSTEM</span><h2>Uma marca.<br/><em>Muitos pontos de contato.</em></h2><p>O valor não está em fazer mais peças. Está em fazer cada ponto reforçar o mesmo posicionamento.</p></div>
      <div className="v10-network" aria-label="Mapa de capacidades">
        <div className="v10-network-core"><b>SEE7VEN</b><small>PRESENCE<br/>SYSTEM</small></div>
        {nodes.map(([title,desc], i) => <div key={title} className={`v10-service-node n${i+1} ${i === active ? 'is-active' : ''}`}><span>{String(i+1).padStart(2,'0')}</span><b>{title}</b><small>{desc}</small></div>)}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M50 50 L18 20 M50 50 L50 13 M50 50 L82 22 M50 50 L17 76 M50 50 L50 88 M50 50 L84 76"/></svg>
      </div>
      <div className="v10-system-count"><strong>0{active+1}</strong><span>/ 06</span></div>
    </div>
  </section>
}

function ProjectMedia({ project, client }) {
  const cover = project.cover || client?.publicCover || client?.brandPoster
  return <div className="v10-project-media" style={{ '--accent': client?.accent || project.accent || '#b7ff35' }}>
    {cover ? <SmartImage src={cover} alt="" loading="lazy"/> : null}
    <div className="v10-project-shape"><span>{project.client?.slice(0,1) || '7'}</span></div>
    <div className="v10-project-grid"/>
  </div>
}

function SelectedWork({ projects, clients, onOpen }) {
  const top = projects.slice(0, 6)
  return <section className="v10-work" id="work">
    <div className="v10-work-intro"><span className="v10-kicker">03 / SELECTED WORK</span><h2>O trabalho<br/>fala <em>primeiro.</em></h2><p>Projetos em contextos diferentes. Uma constante: construir uma presença que faça sentido para a marca e para quem está do outro lado.</p></div>
    <div className="v10-work-list">
      {top.map((project, i) => {
        const client = clients.find(c => c.id === project.clientId) || {}
        return <article className="v10-project" key={project.id} style={{ '--accent': client.accent || '#b7ff35' }}>
          <button className="v10-project-hit" onClick={() => onOpen(project)} aria-label={`Abrir case ${project.client}`}/>
          <div className="v10-project-index"><span>{String(i+1).padStart(2,'0')}</span><small>{project.label || 'PROJECT'}</small></div>
          <ProjectMedia project={project} client={client}/>
          <div className="v10-project-copy"><h3>{project.client}</h3><p>{project.title}</p><div>{(project.tags || []).slice(0,4).map(tag => <span key={tag}>{tag}</span>)}</div><button onClick={() => onOpen(project)}>Explorar case {arrow}</button></div>
        </article>
      })}
    </div>
  </section>
}

function BentoCase({ project, clients, onClose, onBrief }) {
  const client = clients.find(c => c.id === project.clientId) || {}
  const study = project.caseStudy || caseStudies[project.id] || {}
  const source = safeLink(study.source || project.href || client.website || client.url)
  const accent = study.accent || client.accent || '#b7ff35'
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
        <div><span className="v10-kicker">{project.label || 'CASE STUDY'}</span><h1>{study.headline || project.title}</h1><p>{study.intro || project.summary}</p></div>
        <ProjectMedia project={project} client={client}/>
      </section>
      <section className="v10-case-bento">
        <article className="problem"><small>01 / DESAFIO</small><h2>{study.challenge || 'Transformar comunicação fragmentada em uma presença coerente e fácil de reconhecer.'}</h2></article>
        <article className="decision"><small>02 / DECISÃO</small><p>{study.strategy || 'Reduzir ruído, definir hierarquia e fazer cada ponto de contato trabalhar como parte do mesmo sistema.'}</p></article>
        <article className="system"><small>03 / SISTEMA</small><div>{(study.execution?.length ? study.execution : project.tags || ['Estratégia','Identidade','Conteúdo','Digital']).map((item,i) => <span key={`${item}-${i}`}>{String(i+1).padStart(2,'0')} {item}</span>)}</div></article>
        <article className="result"><small>04 / RESULTADO</small><h2>{study.result || project.summary}</h2>{study.proof?.length ? <ul>{study.proof.slice(0,4).map(item => <li key={item}>{item}</li>)}</ul> : null}</article>
      </section>
      <section className="v10-case-end"><span>DO PIXEL AO PAPEL.</span><h2>Uma ideia só ganha força<br/>quando <em>vira presença.</em></h2><div>{source ? <a href={source} target="_blank" rel="noreferrer">Ver presença pública {arrow}</a> : null}<button onClick={() => { onClose(); onBrief(`Projeto parecido com ${project.client}`) }}>Quero construir algo assim {arrow}</button></div></section>
    </main>
  </div>
}

function Capabilities({ services, onBrief }) {
  const [active, setActive] = useState(0)
  const fallback = nodes.map(([title, desc]) => ({ problem: title, answer: desc, stack: [] }))
  const items = (services?.length ? services : fallback).slice(0, 6)
  return <section className="v10-capabilities">
    <div className="v10-cap-title"><span className="v10-kicker">04 / CAPABILITIES</span><h2>Não vendemos uma lista.<br/><em>Montamos o sistema certo.</em></h2></div>
    <div className="v10-cap-grid">
      <div className="v10-cap-menu">{items.map((item,i) => <button key={`${item.problem}-${i}`} className={active===i?'is-active':''} onClick={() => setActive(i)}><small>0{i+1}</small><strong>{item.problem}</strong><span>+</span></button>)}</div>
      <div className="v10-cap-detail"><span className="v10-kicker">FOCO / {String(active+1).padStart(2,'0')}</span><h3>{items[active]?.problem}</h3><p>{items[active]?.answer}</p><div>{(items[active]?.stack || []).map(x => <span key={x}>{x}</span>)}</div><button onClick={() => onBrief(items[active]?.problem)}>Conversar sobre isso {arrow}</button></div>
    </div>
  </section>
}

function Motion({ reels, clients }) {
  const usable = reels.filter(r => r.poster || r.video || r.permalink || r.url).slice(0, 8)
  const fallback = reels.slice(0, 8)
  const items = usable.length >= 4 ? usable : fallback
  return <section className="v10-motion" id="motion">
    <div className="v10-motion-head"><span className="v10-kicker">05 / MOTION & CONTENT</span><h2>Algumas ideias<br/><em>precisam se mover.</em></h2></div>
    <div className="v10-marquee"><div>{[...items,...items].map((reel,i) => { const client=clients.find(c=>c.id===reel.clientId)||{}; const href=safeLink(reel.permalink||reel.url||client.url); return <a key={`${reel.id}-${i}`} href={href||'#work'} target={href?'_blank':undefined} rel="noreferrer" className="v10-motion-card" style={{'--accent':reel.accent||client.accent||'#765bff'}}><div>{reel.poster ? <SmartImage src={reel.poster} alt="" loading="lazy"/> : <span className="v10-motion-seven">7</span>}<i>▶</i></div><small>{reel.client}</small><strong>{reel.title}</strong></a>})}</div></div>
  </section>
}

function Proof({ clients }) {
  return <section className="v10-proof">
    <div><span className="v10-kicker">06 / TRUST</span><h2>Design chama atenção.<br/><em>Consistência constrói valor.</em></h2></div>
    <div className="v10-client-cloud">{clients.slice(0,11).map(client => <span key={client.id}>{client.brandPoster ? <SmartImage src={client.brandPoster} alt={client.name} loading="lazy"/> : client.name}</span>)}</div>
  </section>
}

function Contact({ onBrief }) {
  const text = encodeURIComponent('Olá! Conheci a Seeven pelo site e quero conversar sobre um projeto.')
  return <section className="v10-contact" id="contact">
    <span className="v10-kicker">07 / START SOMETHING</span>
    <h2>A sua marca<br/>já tem <em>presença?</em></h2>
    <p>Conte o que você está construindo. A gente organiza o problema, encontra a direção e transforma isso em um sistema que funciona.</p>
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
  const choices = ['Marca / identidade','Site / landing page','Conteúdo / social','Campanha','Motion / vídeo','Ainda não sei']
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
      <div className="v10-brief-actions"><button disabled={step===0&&!form.need} onClick={()=> step>0 ? setStep(step-1) : onClose()}>← Voltar</button><button onClick={()=>step<3?setStep(step+1):send()}>{step<3?'Continuar →':'Enviar no WhatsApp ↗'}</button></div>
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
  useEffect(() => {
    document.documentElement.classList.add('seeven-v10')
    const meta = document.querySelector('meta[name="theme-color"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name:'theme-color' }))
    meta.content = '#0a0a0a'
    return () => document.documentElement.classList.remove('seeven-v10')
  }, [])
  useEffect(() => { track('page_view',{source:cms.source,version:'v10'}) }, [cms.source])
  return <div className="v10-shell">
    <Header onBrief={openBrief}/>
    <main>
      <Hero projects={cms.projects}/>
      <PresenceSystem/>
      <SelectedWork projects={cms.projects} clients={cms.clients} onOpen={p=>{setCaseProject(p);track('case_opened',{project:p.id})}}/>
      <Capabilities services={cms.services} onBrief={openBrief}/>
      <Motion reels={cms.reels} clients={cms.clients}/>
      <Proof clients={cms.clients}/>
      <Contact onBrief={openBrief}/>
    </main>
    <Footer/>
    {caseProject ? <BentoCase project={caseProject} clients={cms.clients} onClose={()=>setCaseProject(null)} onBrief={openBrief}/> : null}
    <Brief open={brief} onClose={()=>setBrief(false)} initial={briefPreset}/>
  </div>
}
