import React, { useEffect, useMemo, useRef, useState } from 'react'
import { supabase, supabaseEnabled, supabaseDiagnostics } from './supabase'
import { behanceProjects as seededBehance, clients as seededClients, featuredProjects as seededProjects, solutions as seededSolutions } from './data'

const TABLES = {
  dashboard: { label: 'Visão geral', eyebrow: 'CONTROL ROOM' },
  contents: { label: 'Reels & mídia', eyebrow: 'MOTION ARCHIVE' },
  projects: { label: 'Projetos & cases', eyebrow: 'SELECTED WORK' },
  clients: { label: 'Marcas & clientes', eyebrow: 'CLIENT SYSTEM' },
  services: { label: 'Soluções', eyebrow: 'COMMERCIAL LAYER' },
  behance_items: { label: 'Behance', eyebrow: 'VISUAL ARCHIVE' }
}

const EMPTY = {
  contents: { slug: '', client: '', category: 'reel', title: '', description: '', permalink: '', video: '', url: '', poster: '', featured: false, active: true, order: 0 },
  projects: { slug: '', client: '', label: '', title: '', description: '', category: '', tags: '', theme: '', size: '', cover: '', url: '', eyebrow: '', headline: '', case_intro: '', challenge: '', strategy: '', execution: '', result: '', proof: '', before_title: '', before_text: '', after_title: '', after_text: '', source_url: '', research_context: '', audience: '', objective: '', constraint_text: '', insight: '', decision_text: '', system_map: '', focus: '', channels: '', signal: '', active: true, order: 0 },
  clients: { slug: '', name: '', handle: '', category: '', accent: '', url: '', website: '', brand_poster: '', public_cover: '', public_cover_fit: 'cover', public_proof: '', active: true, order: 0 },
  services: { title: '', description: '', stack: '', active: true, order: 0 },
  behance_items: { title: '', client: '', url: '', cover: '', tools: '', theme: 'editorial', active: true, order: 0 }
}

const LABELS = {
  slug: 'Slug / identificador', client: 'Cliente', category: 'Categoria', title: 'Título', description: 'Descrição', permalink: 'Link exato do Reel', video: 'Arquivo de vídeo / URL', url: 'URL pública / legado', poster: 'Capa do Reel', featured: 'Destaque', active: 'Publicado', order: 'Ordem',
  label: 'Label editorial', tags: 'Tags (separadas por vírgula)', theme: 'Direção visual', size: 'Tamanho do card', cover: 'Capa do projeto', eyebrow: 'Eyebrow', headline: 'Headline', case_intro: 'Introdução do case', challenge: 'Desafio', strategy: 'Estratégia', execution: 'Execução (vírgula)', result: 'Resultado', proof: 'Provas / entregas (vírgula)', before_title: 'Antes / título', before_text: 'Antes / contexto', after_title: 'Depois / título', after_text: 'Depois / contexto', source_url: 'Fonte pública', research_context: 'Contexto', audience: 'Público', objective: 'Objetivo', constraint_text: 'Restrição', insight: 'Insight', decision_text: 'Decisão', system_map: 'Sistema construído', focus: 'Focos (vírgula)', channels: 'Canais (vírgula)', signal: 'Sinal visual (vírgula)',
  name: 'Nome', handle: 'Perfil / @handle', accent: 'Cor de assinatura', website: 'Website', brand_poster: 'Poster da marca', public_cover: 'Capa pública', public_cover_fit: 'Encaixe da capa', public_proof: 'Contexto público', tools: 'Ferramentas (vírgula)', stack: 'Combinação de soluções (vírgula)'
}

const LONG_FIELDS = new Set(['description','public_proof','case_intro','challenge','strategy','result','before_text','after_text','research_context','audience','objective','constraint_text','insight','decision_text','system_map'])
const ADMIN_TABS = {
  contents: { 'Geral': ['slug','client','category','title','description'], 'Mídia': ['permalink','video','poster','url'], 'Publicação': ['featured','active','order'] },
  projects: { 'Geral': ['slug','client','label','title','description','category','tags','theme','size','url'], 'Mídia': ['cover','source_url','before_title','before_text','after_title','after_text'], 'Case': ['eyebrow','headline','case_intro','challenge','strategy','execution','result','proof'], 'Intelligence': ['research_context','audience','objective','constraint_text','insight','decision_text','system_map','focus','channels','signal'], 'Publicação': ['active','order'] },
  clients: { 'Geral': ['slug','name','handle','category','accent'], 'Presença': ['url','website','brand_poster','public_cover','public_cover_fit','public_proof'], 'Publicação': ['active','order'] },
  services: { 'Geral': ['title','description','stack'], 'Publicação': ['active','order'] },
  behance_items: { 'Geral': ['title','client','url','cover','tools','theme'], 'Publicação': ['active','order'] }
}

function slugify(value='') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,90)
}
const isReelUrl = value => /instagram\.com\/(reel|p|tv)\//i.test(String(value || ''))
const isVideoUrl = value => /\.(mp4|webm)(\?|#|$)/i.test(String(value || ''))
const cleanPayload = form => Object.fromEntries(Object.entries(form).filter(([key]) => !['id','created_at','updated_at'].includes(key)).map(([key,value]) => [key, typeof value === 'string' && value.trim() === '' ? null : value]))

const normalizeUrl = value => String(value || '').trim().replace(/\?.*$/, '').replace(/\/$/, '').toLowerCase()
function friendlyAuthError(error) {
  const message = String(error?.message || error || '')
  if (/invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.'
  if (/email not confirmed/i.test(message)) return 'Confirme o e-mail deste usuário no Supabase antes de entrar.'
  if (/invalid api key/i.test(message)) return 'A chave pública do Supabase é inválida. Revise as variáveis no Vercel e faça um redeploy.'
  if (/failed to fetch|network/i.test(message)) return 'Não foi possível conectar ao Supabase. Verifique sua conexão e tente novamente.'
  if (/rate limit|too many/i.test(message)) return 'Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.'
  return message || 'Não foi possível concluir o acesso.'
}

function friendlyDbError(error) {
  const message = String(error?.message || error || '')
  const code = String(error?.code || '')
  if (code === '23505' || /duplicate key|already exists/i.test(message)) return 'Já existe um item com este identificador, slug ou link. Revise os campos únicos e tente novamente.'
  if (code === '23503' || /foreign key/i.test(message)) return 'Este item ainda está ligado a outro registro. Revise as relações antes de excluir ou alterar.'
  if (code === '42P01' || /does not exist|schema cache/i.test(message)) return 'A estrutura do banco não está atualizada. Execute a migration V8 no Supabase e sincronize novamente.'
  if (/row-level security|permission denied|not authorized|violates row-level security/i.test(message)) return 'Sua conta não tem permissão para esta alteração. Revise cms_admins e as políticas RLS da V8.'
  if (/failed to fetch|network/i.test(message)) return 'A conexão com o Supabase falhou. Verifique a internet e tente novamente.'
  return message || 'Não foi possível concluir a alteração.'
}

function adminFocusable(container) {
  if (!container) return []
  return [...container.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true' && node.getClientRects().length > 0)
}

function useAdminDialog(open, { containerRef, initialRef, onClose }) {
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focus = () => (initialRef?.current || adminFocusable(containerRef?.current)[0])?.focus?.()
    const frame = requestAnimationFrame(focus)
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current?.(); return }
      if (event.key !== 'Tab') return
      const list = adminFocusable(containerRef?.current)
      if (!list.length) return
      const first = list[0], last = list[list.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', keydown)
      document.body.style.overflow = oldOverflow
      previous?.focus?.()
    }
  }, [open, containerRef, initialRef])
}

function Login({ onSession }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setStatus('Validando acesso…')
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (error) return setStatus(friendlyAuthError(error))
    setStatus('Acesso liberado.'); onSession(data.session)
  }
  return <div className="admin-login-wrap"><div className="admin-login">
    <span>SEE7VEN / CONTROL ROOM</span><h1>Conteúdo sem deploy.</h1>
    <p>Gerencie portfólio, cases, Reels, Behance e mídia em um painel feito para a própria operação da Seeven.</p>
    <form onSubmit={submit}><input autoComplete="email" type="email" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} required/><input autoComplete="current-password" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} required/><button disabled={busy}>{busy ? 'ENTRANDO…' : 'ENTRAR NO CONTROL ROOM'}</button></form>
    {status && <div className="admin-login-status" role="status" aria-live="polite">{status}</div>}<a href="/" style={{display:'inline-block',marginTop:'1rem',fontSize:'.55rem',opacity:.55}}>← VOLTAR PARA A LP</a>
  </div></div>
}

function SetupScreen() {
  return <div className="admin-setup-wrap"><div className="admin-setup">
    <span>SEE7VEN / CONTROL ROOM · SETUP</span><h1>Falta conectar o painel.</h1><p>O front-end está carregando, mas o build não recebeu a conexão pública do Supabase. Use somente a URL e a Publishable Key no Vite.</p>
    <div className="admin-diagnostics"><div className={supabaseDiagnostics.hasUrl?'ok':'missing'}><b>VITE_SUPABASE_URL</b><span>{supabaseDiagnostics.hasUrl?'DETECTADA':'AUSENTE'}</span></div><div className={supabaseDiagnostics.hasKey?'ok':'missing'}><b>VITE_SUPABASE_PUBLISHABLE_KEY</b><span>{supabaseDiagnostics.hasKey?`DETECTADA / ${supabaseDiagnostics.keyMode}`:'AUSENTE'}</span></div></div>
    <div className="admin-setup-steps"><article><span>PASSO 1</span><strong>Supabase</strong><p>Copie Project URL + Publishable Key em Connect / API Keys.</p></article><article><span>PASSO 2</span><strong>Vercel</strong><p>Cadastre as duas variáveis para Production e Preview.</p></article><article><span>PASSO 3</span><strong>Redeploy</strong><p>Vite incorpora as variáveis no build; um novo deploy é obrigatório.</p></article><article><span>PASSO 4</span><strong>Banco</strong><p>Em projeto já na V7.4, execute <code>SUPABASE_V8_MIGRATION.sql</code> uma vez.</p></article></div>
    <div className="admin-setup-actions"><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">ABRIR SUPABASE ↗</a><a href="https://vercel.com/dashboard" target="_blank" rel="noreferrer">ABRIR VERCEL ↗</a><a href="/">← VOLTAR AO SITE</a></div>
  </div></div>
}

function AccessScreen({ mode, email }) {
  const [copied, setCopied] = useState(false)
  const migration = mode === 'migration'
  const authorizationSql = `insert into public.cms_admins (user_id, email)\nselect id, email from auth.users where lower(email)=lower('${String(email || '').replace(/'/g, "''")}')\non conflict (user_id) do update set email = excluded.email;`
  const copySql = async () => {
    try { await navigator.clipboard.writeText(authorizationSql); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch {}
  }
  return <div className="admin-setup-wrap"><div className="admin-setup"><span>SEE7VEN / CONTROL ROOM · ACCESS</span><h1>{migration ? 'Atualização do banco necessária.' : 'Conta sem permissão de edição.'}</h1><p>{migration ? 'A V8 restringe o CMS a administradores explícitos. Execute SUPABASE_V8_MIGRATION.sql no SQL Editor e recarregue esta página.' : `A conta ${email || ''} autenticou, mas ainda não está autorizada em cms_admins.`}</p>{!migration&&<div className="admin-access-code"><span>SQL PARA AUTORIZAR ESTA CONTA</span><code>{authorizationSql}</code><button onClick={copySql}>{copied?'COPIADO ✓':'COPIAR SQL'}</button></div>}<div className="admin-setup-actions"><a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">ABRIR SUPABASE ↗</a><button onClick={()=>location.reload()}>RECARREGAR</button><button onClick={()=>supabase.auth.signOut()}>SAIR</button></div></div></div>
}

function MediaPreview({ form }) {
  const source = form.poster || form.cover || form.brand_poster || form.public_cover || form.video
  if (!source) return null
  const video = isVideoUrl(source) || source === form.video
  return <div className="admin-media-preview">{video ? <video src={source} muted controls preload="metadata"/> : <img src={source} alt="Prévia da mídia"/>}<p><b>Prévia</b><br/>A mídia acima é a referência visual atual. Para produção, priorize arquivos próprios no Media Vault em vez de hotlinks.</p></div>
}

function EditorDrawer({ table, item, clients, defaultOrder = 0, onClose, onSaved }) {
  const base = useMemo(() => ({ ...EMPTY[table], ...(!item ? { order: defaultOrder } : {}), ...(item || {}) }), [table, item, defaultOrder])
  const [form, setForm] = useState(base)
  const [tab, setTab] = useState(Object.keys(ADMIN_TABS[table])[0])
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dirty, setDirty] = useState(false)
  const fileRef = useRef(null)
  const drawerRef = useRef(null)
  const closeButtonRef = useRef(null)
  const uploadedPaths = useRef([])
  useEffect(()=>{ setForm(base); setTab(Object.keys(ADMIN_TABS[table])[0]); setDirty(false); setStatus(''); uploadedPaths.current=[] },[base,table])
  useEffect(()=>{ const before = event => { if (dirty) { event.preventDefault(); event.returnValue='' } }; window.addEventListener('beforeunload',before); return()=>window.removeEventListener('beforeunload',before) },[dirty])
  const set = (key,value) => { setForm(prev=>({...prev,[key]:value})); setDirty(true) }
  const cleanupUnsavedUploads = async () => {
    const paths=[...uploadedPaths.current]
    uploadedPaths.current=[]
    if(paths.length) await supabase.storage.from('portfolio-assets').remove(paths)
  }
  const requestClose = async () => {
    if (dirty && !confirm('Descartar alterações não salvas?')) return
    if (dirty) await cleanupUnsavedUploads()
    onClose()
  }
  useAdminDialog(true, { containerRef: drawerRef, initialRef: closeButtonRef, onClose: requestClose })

  const makeVideoPoster = file => new Promise(resolve => {
    const video=document.createElement('video'); const objectUrl=URL.createObjectURL(file); let done=false
    const timeout=setTimeout(()=>finish(null),10000)
    const finish=blob=>{ if(done)return; done=true; clearTimeout(timeout); URL.revokeObjectURL(objectUrl); video.removeAttribute('src'); resolve(blob) }
    video.muted=true; video.playsInline=true; video.preload='metadata'; video.onerror=()=>finish(null)
    video.onloadedmetadata=()=>{ if(!Number.isFinite(video.duration)) return finish(null); video.currentTime=Math.min(1,Math.max(.1,(video.duration||1)*.15)) }
    video.onseeked=()=>{ try { const canvas=document.createElement('canvas'); const max=1080; const scale=Math.min(1,max/Math.max(video.videoWidth||max,video.videoHeight||max)); canvas.width=Math.max(1,Math.round((video.videoWidth||1080)*scale)); canvas.height=Math.max(1,Math.round((video.videoHeight||1920)*scale)); canvas.getContext('2d').drawImage(video,0,0,canvas.width,canvas.height); canvas.toBlob(blob=>finish(blob),'image/jpeg',.86) } catch { finish(null) } }
    video.src=objectUrl
  })

  const uploadMedia = async file => {
    if (!file) return
    if (fileRef.current) fileRef.current.value=''
    const video = file.type.startsWith('video/')
    if (!file.type.startsWith('image/') && !video) return setStatus('Formato não suportado. Use imagem, MP4 ou WebM.')
    const max = video ? 80*1024*1024 : 12*1024*1024
    if (file.size > max) return setStatus(`Arquivo muito grande. Limite: ${video?'80 MB para vídeo':'12 MB para imagem'}.`)
    let target = null
    if (table==='contents') target=video?'video':'poster'
    else if (table==='projects'||table==='behance_items') target='cover'
    else if (table==='clients') target='brand_poster'
    if (!target) return setStatus('Este tipo de conteúdo não possui upload de mídia.')
    setUploading(true); setStatus('Enviando para o Media Vault…')
    const safe=file.name.toLowerCase().replace(/[^a-z0-9._-]+/g,'-'); const path=`${table}/${Date.now()}-${safe}`
    const { error } = await supabase.storage.from('portfolio-assets').upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type})
    if (error) { setUploading(false); return setStatus(friendlyDbError(error)) }
    uploadedPaths.current.push(path)
    const publicUrl=supabase.storage.from('portfolio-assets').getPublicUrl(path).data.publicUrl
    let updates={ [target]: publicUrl }
    if (table==='contents' && video) {
      const posterBlob=await makeVideoPoster(file)
      if (posterBlob) { const posterPath=`contents/${Date.now()}-${safe.replace(/\.[^.]+$/,'')}-poster.jpg`; const up=await supabase.storage.from('portfolio-assets').upload(posterPath,posterBlob,{contentType:'image/jpeg',cacheControl:'31536000',upsert:false}); if(!up.error) { uploadedPaths.current.push(posterPath); updates.poster=supabase.storage.from('portfolio-assets').getPublicUrl(posterPath).data.publicUrl } }
    }
    setForm(prev=>({...prev,...updates})); setDirty(true); setUploading(false); setStatus(updates.poster&&video?'Vídeo e poster automático prontos para salvar.':'Upload concluído. Salve para publicar a alteração.')
  }

  const save = async event => {
    event.preventDefault()
    const required = { contents: ['client','title'], projects: ['title'], clients: ['name'], services: ['title'], behance_items: ['title','url'] }[table] || []
    const missing = required.find(key => !String(form[key] || '').trim())
    if (missing) { setStatus(`Preencha “${LABELS[missing] || missing}” antes de salvar.`); return }
    if (table === 'contents' && form.permalink && !isReelUrl(form.permalink)) { setStatus('O permalink deve ser a URL exata de um Reel/post do Instagram.'); setTab('Mídia'); return }
    setStatus('Salvando…')
    const payload=cleanPayload(form)
    if ('slug' in payload && !payload.slug) payload.slug=slugify(payload.title||payload.name||payload.client||'item') || null
    if (!item?.id && (payload.order === null || payload.order === undefined)) payload.order = defaultOrder
    const query=item?.id ? supabase.from(table).update(payload).eq('id',item.id) : supabase.from(table).insert(payload)
    const { error }=await query
    if(error) return setStatus(friendlyDbError(error))
    uploadedPaths.current=[]; setDirty(false); setStatus('Salvo.'); await onSaved(); onClose()
  }

  const currentFields=ADMIN_TABS[table][tab] || []
  const canUpload=['contents','projects','behance_items','clients'].includes(table) && ['Mídia','Presença','Geral'].includes(tab)
  const renderField = key => {
    const value=form[key]
    if (key==='client' && table==='behance_items') return <label key={key}>{LABELS[key]}<input value={value??''} onChange={e=>set(key,e.target.value)} placeholder="Ex.: Seeven Projects"/></label>
    if (key==='client') { const requiredClient=table==='contents'; return <label key={key}>{LABELS[key]} {requiredClient&&<em className="admin-required">OBRIGATÓRIO</em>}<select value={value??''} onChange={e=>set(key,e.target.value)}><option value="">{requiredClient?'Selecionar…':'Projeto sem cliente específico / Seeven'}</option>{clients.map(client=><option key={client.slug||client.id} value={client.slug}>{client.name||client.slug}</option>)}</select></label> }
    if (typeof value==='boolean') return <label key={key}>{LABELS[key]}<select value={String(value)} onChange={e=>set(key,e.target.value==='true')}><option value="true">Sim</option><option value="false">Não</option></select></label>
    if (key==='size') return <label key={key}>{LABELS[key]}<select value={value??''} onChange={e=>set(key,e.target.value)}><option value="">Automático</option><option value="sm">Pequeno</option><option value="md">Médio</option><option value="lg">Grande</option><option value="xl">Hero</option></select></label>
    if (key==='theme') return <label key={key}>{LABELS[key]}<select value={value??''} onChange={e=>set(key,e.target.value)}><option value="">Automático</option>{['orange','wine','acid','violet','steel','sky','event','music','food','editorial'].map(x=><option key={x} value={x}>{x}</option>)}</select></label>
    if (key==='public_cover_fit') return <label key={key}>{LABELS[key]}<select value={value??'cover'} onChange={e=>set(key,e.target.value)}><option value="cover">Preencher</option><option value="contain">Conter</option></select></label>
    if (LONG_FIELDS.has(key)) return <label className="full" key={key}>{LABELS[key]}<textarea value={value??''} onChange={e=>set(key,e.target.value)}/></label>
    const urlLike=['permalink','video','url','poster','cover','source_url','website','brand_poster','public_cover'].includes(key)
    return <label className={urlLike?'full':''} key={key}>{LABELS[key]||key}<input type={key==='order'?'number':urlLike?'url':'text'} value={value??''} onChange={e=>set(key,key==='order'?(e.target.value===''?'':Number(e.target.value)):e.target.value)}/>{key==='slug'&&<button type="button" style={{marginTop:'.3rem',justifySelf:'start'}} onClick={()=>set('slug',slugify(form.title||form.name||form.client))}>GERAR SLUG</button>}</label>
  }

  return <div className="admin-drawer-backdrop" onMouseDown={event=>event.target===event.currentTarget&&requestClose()}><form ref={drawerRef} className="admin-editor-drawer" onSubmit={save} role="dialog" aria-modal="true" aria-label={`${item?.id?'Editar':'Novo'} ${TABLES[table].label}`}>
    <div className="admin-editor-top"><div><span>{TABLES[table].eyebrow}</span><b>{item?.id?'Editar':'Novo'} · {item?.title||item?.name||TABLES[table].label}</b></div><button ref={closeButtonRef} type="button" onClick={requestClose}>FECHAR ×</button></div>
    <div className="admin-editor-tabs">{Object.keys(ADMIN_TABS[table]).map(name=><button type="button" key={name} className={tab===name?'active':''} onClick={()=>setTab(name)}>{name}</button>)}</div>
    <div className="admin-editor-body"><div className="admin-form-grid">
      {table==='contents'&&tab==='Mídia'&&<div className="admin-media-help full"><b>COMO CADASTRAR UM REEL</b><br/>Cole em <b>Link exato do Reel</b> a URL aberta no Instagram, como <code>instagram.com/reel/ABC...</code>. A capa pode ser enviada abaixo. Se você tiver o MP4/WebM, envie-o também: o painel gera um poster automaticamente.</div>}
      {table==='projects'&&tab==='Case'&&<div className="admin-media-help full"><b>CASE QUE VENDE</b><br/>Conte o problema antes da solução. Desafio → decisão estratégica → execução → evidência. Não use métricas sem fonte.</div>}
      {currentFields.map(renderField)}
      {canUpload&&<label className="admin-dropzone" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();uploadMedia(e.dataTransfer?.files?.[0])}} onClick={()=>fileRef.current?.click()}><input ref={fileRef} type="file" accept="image/*,video/mp4,video/webm" onChange={e=>uploadMedia(e.target.files?.[0])}/><b>{uploading?'ENVIANDO…':'MEDIA VAULT'}</b><br/>Arraste uma imagem/vídeo ou clique para selecionar.</label>}
      <MediaPreview form={form}/>
    </div></div>
    <div className="admin-editor-footer"><span role="status" aria-live="polite">{status || (dirty?'Alterações não salvas':'Sem alterações pendentes')}</span><div><button type="button" onClick={requestClose}>Cancelar</button><button className="primary" disabled={uploading}>SALVAR</button></div></div>
  </form></div>
}

function PitchLinkBuilder() {
  const [segment,setSegment]=useState('food'); const [prospect,setProspect]=useState(''); const [copied,setCopied]=useState(false)
  const origin=typeof window!=='undefined'?window.location.origin:''; const link=`${origin}/?for=${encodeURIComponent(segment)}${prospect.trim()?`&prospect=${encodeURIComponent(prospect.trim())}`:''}`
  const copy=async()=>{ try{await navigator.clipboard.writeText(link);setCopied(true);setTimeout(()=>setCopied(false),1500)}catch{} }
  return <div className="admin-pitch-builder"><div><b>PITCH LINK BUILDER</b><span>Envie a mesma LP já priorizando o repertório mais próximo do prospect.</span></div><select value={segment} onChange={e=>setSegment(e.target.value)}>{['food','eventos','b2b','institucional','nightlife'].map(x=><option key={x}>{x}</option>)}</select><input value={prospect} onChange={e=>setProspect(e.target.value)} placeholder="Nome do prospect (opcional)"/><button onClick={copy}>{copied?'COPIADO ✓':'COPIAR LINK'}</button><code>{link}</code></div>
}

function BehanceSync({ rows, onImported }) {
  const [projects,setProjects]=useState([]); const [status,setStatus]=useState(''); const [busy,setBusy]=useState('')
  const normalize=value=>String(value||'').replace(/\?.*$/,'').replace(/\/$/,'')
  const known=useMemo(()=>new Set([...seededBehance.map(x=>normalize(x.url)),...rows.map(x=>normalize(x.url))]),[rows])
  const missing=projects.filter(x=>!known.has(normalize(x.url)))
  const scan=async()=>{ setStatus('Consultando o perfil público…'); try{const response=await fetch('/api/behance-profile',{headers:{accept:'application/json'}}); const data=await response.json(); if(!response.ok)throw new Error(data?.message||'Falha na consulta'); setProjects(data.projects||[]); const next=(data.projects||[]).filter(x=>!known.has(normalize(x.url))); setStatus(next.length?`${next.length} projeto(s) novo(s) encontrado(s).`:'Perfil sincronizado. Nenhuma novidade pendente.')}catch(error){setStatus(`Behance indisponível no momento: ${error.message}`)} }
  const importOne=async project=>{ setBusy(project.url); setStatus('Importando metadados…'); try{const response=await fetch(`/api/behance-meta?url=${encodeURIComponent(project.url)}`); const meta=await response.json(); if(!response.ok)throw new Error(meta?.message||'Falha nos metadados'); const {error}=await supabase.from('behance_items').insert({title:meta.title||project.title||'Projeto Behance',client:'Seeven Projects',url:project.url,cover:meta.image||null,tools:null,theme:'editorial',active:true,order:Math.max(-1,...rows.map(row=>Number(row.order??-1)))+1}); if(error)throw error; setStatus('Importado. Revise cliente, ferramentas e capa.'); await onImported()}catch(error){setStatus(friendlyDbError(error))}finally{setBusy('')} }
  return <section className="admin-behance-sync"><div className="admin-behance-head"><div><b>BEHANCE WATCH</b><span>Compara o perfil público com o arquivo já importado no CMS.</span></div><button onClick={scan}>VERIFICAR NOVIDADES</button></div>{status&&<div className="admin-status" role="status" aria-live="polite" style={{marginTop:'.65rem'}}>{status}</div>}{missing.length>0&&<div className="admin-behance-found">{missing.map(project=><article key={project.url}><div><span>NOVO / BEHANCE</span><strong>{project.title}</strong><a href={project.url} target="_blank" rel="noreferrer">ABRIR PROJETO ↗</a></div><button disabled={busy===project.url} onClick={()=>importOne(project)}>{busy===project.url?'IMPORTANDO…':'IMPORTAR'}</button></article>)}</div>}</section>
}

function QuickReel({ clients, rows, onSaved }) {
  const [client,setClient]=useState('')
  const [permalink,setPermalink]=useState('')
  const [title,setTitle]=useState('')
  const [status,setStatus]=useState('')
  const [busy,setBusy]=useState(false)
  const save=async()=>{
    if(!client)return setStatus('Escolha a marca antes de salvar.')
    if(!isReelUrl(permalink))return setStatus('Cole o link exato do Reel aberto no Instagram.')
    if(rows.some(row=>normalizeUrl(row.permalink||row.url)===normalizeUrl(permalink)))return setStatus('Este Reel já está cadastrado no CMS.')
    setBusy(true);setStatus('Adicionando Reel…')
    const clientName=clients.find(item=>item.slug===client)?.name||client
    const maxOrder=Math.max(-1,...rows.map(row=>Number(row.order??-1)))+1
    const {error}=await supabase.from('contents').insert({client,category:'reel',title:title.trim()||`Reel — ${clientName}`,permalink:permalink.trim(),featured:false,active:true,order:maxOrder})
    setBusy(false)
    if(error)return setStatus(friendlyDbError(error))
    setClient('');setPermalink('');setTitle('');setStatus('Reel adicionado. Agora envie uma capa para aumentar o impacto.');await onSaved()
  }
  return <section className="admin-quick-reel"><div><span>QUICK ADD / REEL</span><b>Tem o link? Publique em poucos segundos.</b><p>Instagram → abra o Reel → compartilhar/copiar link → cole abaixo. Depois você pode editar capa, vídeo próprio e destaque.</p></div><div className="admin-quick-reel-form"><select value={client} onChange={e=>setClient(e.target.value)}><option value="">Selecionar marca…</option>{clients.map(item=><option key={item.slug} value={item.slug}>{item.name}</option>)}</select><input value={permalink} onChange={e=>setPermalink(e.target.value)} placeholder="https://www.instagram.com/reel/..."/><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título opcional"/><button disabled={busy} onClick={save}>{busy?'SALVANDO…':'ADICIONAR REEL →'}</button></div>{status&&<small role="status" aria-live="polite">{status}</small>}</section>
}

function AdminItemCards({ rows, table, readiness, onEdit, onToggle, onDuplicate, onRemove, onMove }) {
  return <div className="admin-mobile-list">{rows.map(row=>{const[label,tone]=readiness(row);const media=row.poster||row.cover||row.brand_poster||row.public_cover;return <article key={row.id} className="admin-mobile-card"><div className="admin-mobile-card-top">{media?<img src={media} alt="" onError={event=>{event.currentTarget.hidden=true}}/>:<div className="admin-thumb admin-thumb-empty">7</div>}<div><span>{row.client||row.category||row.handle||row.slug||TABLES[table].eyebrow}</span><strong>{row.title||row.name||row.client||'Sem título'}</strong><small>ordem {row.order??'—'}</small></div></div><div className="admin-mobile-status"><span className={`readiness readiness-${tone}`}>{label}</span><button className={`publish-toggle ${row.active===false?'is-draft':'is-live'}`} onClick={()=>onToggle(row)}>{row.active===false?'RASCUNHO':'PUBLICADO'}</button></div><div className="admin-mobile-card-actions"><button aria-label="Mover item para cima" onClick={()=>onMove(row,-1)}>↑</button><button aria-label="Mover item para baixo" onClick={()=>onMove(row,1)}>↓</button><button onClick={()=>onEdit(row)}>EDITAR</button><button onClick={()=>onDuplicate(row)}>DUPLICAR</button><button className="danger" onClick={()=>onRemove(row)}>EXCLUIR</button></div></article>})}</div>
}

function Dashboard({ all, onNavigate, onSeed, seeding }) {
  const contents=all.contents||[], projects=all.projects||[], clients=all.clients||[], behance=all.behance_items||[]
  const activeReels=contents.filter(x=>x.active!==false)
  const playable=activeReels.filter(x=>isVideoUrl(x.video)||isReelUrl(x.permalink||x.url))
  const withPoster=activeReels.filter(x=>x.poster)
  const activeProjects=projects.filter(x=>x.active!==false)
  const covered=activeProjects.filter(x=>x.cover)
  const completeCases=activeProjects.filter(x=>x.challenge&&x.strategy&&x.result)
  const missingCover=activeProjects.filter(x=>!x.cover)
  const incompleteCase=activeProjects.filter(x=>x.slug && !(x.challenge&&x.strategy&&x.result))
  const projectCompleteness=activeProjects.length?((covered.length/activeProjects.length)*.45+(completeCases.length/activeProjects.length)*.55)*100:0
  const reelCompleteness=activeReels.length?((playable.length/activeReels.length)*.6+(withPoster.length/activeReels.length)*.4)*100:0
  const score=Math.round(activeProjects.length&&activeReels.length?(projectCompleteness+reelCompleteness)/2:Math.max(projectCompleteness,reelCompleteness))
  const issues=[
    {title:'Reels sem mídia reproduzível',detail:`${Math.max(0,activeReels.length-playable.length)} item(ns) ainda não abrem vídeo/Instagram diretamente.`,table:'contents',count:Math.max(0,activeReels.length-playable.length)},
    {title:'Reels sem capa própria',detail:`${Math.max(0,activeReels.length-withPoster.length)} item(ns) podem ganhar impacto com poster real.`,table:'contents',count:Math.max(0,activeReels.length-withPoster.length)},
    {title:'Projetos sem capa',detail:`${missingCover.length} item(ns) publicados sem imagem principal própria.`,table:'projects',count:missingCover.length},
    {title:'Cases incompletos',detail:`${incompleteCase.length} projeto(s) com slug ainda sem desafio + estratégia + resultado.`,table:'projects',count:incompleteCase.length}
  ].sort((a,b)=>b.count-a.count)
  return <>
    <section className="admin-command-hero"><div><span>CONTROL ROOM / V9.2</span><h1>O portfólio fica melhor quando você sabe <b>o que falta.</b></h1><p>Este painel mede completude editorial — não performance de marketing. Priorize mídia real e cases claros antes de adicionar mais efeitos.</p></div><div className="admin-score" style={{'--score':`${score*3.6}deg`}}><div><strong>{score}%</strong><span>COMPLETUDE<br/>DO CMS</span></div></div></section>
    <div className="admin-dashboard-grid"><article className="admin-stat"><span>PROJETOS PUBLICADOS</span><strong>{activeProjects.length}</strong><small>{covered.length} com capa · {completeCases.length} cases completos</small></article><article className="admin-stat"><span>REELS REPRODUZÍVEIS</span><strong>{playable.length}<i>/{activeReels.length}</i></strong><small>{withPoster.length} com capa própria</small></article><article className="admin-stat"><span>ARQUIVO BEHANCE</span><strong>{behance.filter(x=>x.active!==false).length}</strong><small>novidades entram pelo Behance Watch</small></article><article className="admin-stat"><span>MARCAS NO CMS</span><strong>{clients.filter(x=>x.active!==false).length}</strong><small>repertório ativo no painel</small></article></div>
    <div className="admin-health"><section className="admin-panel"><div className="admin-panel-head"><div><span>CONTENT HEALTH</span><b>O que merece atenção primeiro</b></div></div><div className="admin-health-list">{issues.map(issue=><div className={`admin-health-item ${issue.count===0?'resolved':''}`} key={issue.title}><div><strong>{issue.count===0?'✓ ':''}{issue.title}</strong><span>{issue.detail}</span></div><button onClick={()=>onNavigate(issue.table)}>{issue.count===0?'ABRIR':'REVISAR'} →</button></div>)}</div></section><section className="admin-panel"><div className="admin-panel-head"><div><span>WORKFLOW</span><b>Sequência que mais melhora a LP</b></div></div><div className="admin-health-list">{['1. Capas reais dos cases mais fortes','2. Permalinks corretos + posters dos Reels','3. Desafio → decisão → execução → resultado','4. Importar novidades do Behance','5. Criar links de prospecção por segmento'].map(text=><div className="admin-health-item" key={text}><div><strong>{text}</strong><span>Melhora a percepção comercial sem depender de novo efeito visual.</span></div></div>)}</div></section></div>
    <section className="admin-panel admin-seed-panel"><div className="admin-panel-head"><div><span>CMS FOUNDATION</span><b>Torne os fallbacks da LP editáveis no painel</b></div></div><div className="admin-seed-body"><p>A LP possui uma base estática de segurança. Este comando copia apenas os itens ainda ausentes para o Supabase, sem duplicar o que já existe.</p><button disabled={seeding} onClick={onSeed}>{seeding?'MIGRANDO BASE…':'MIGRAR BASE PARA O CMS →'}</button></div></section>
    <div className="admin-dashboard-pitch"><PitchLinkBuilder/></div>
  </>
}

export default function AdminApp() {
  const [session,setSession]=useState(null)
  const [access,setAccess]=useState('checking')
  const [table,setTable]=useState('dashboard')
  const [all,setAll]=useState({})
  const [selected,setSelected]=useState(undefined)
  const [status,setStatus]=useState('')
  const [query,setQuery]=useState('')
  const [statusFilter,setStatusFilter]=useState('all')
  const [loading,setLoading]=useState(false)
  const [seeding,setSeeding]=useState(false)

  useEffect(()=>{
    if(!supabaseEnabled)return
    supabase.auth.getSession().then(({data,error})=>{ if(error)setStatus(error.message); setSession(data?.session||null) })
    const {data:listener}=supabase.auth.onAuthStateChange((_e,next)=>setSession(next))
    return()=>listener.subscription.unsubscribe()
  },[])

  useEffect(()=>{
    if(!session){setAccess('checking');return}
    ;(async()=>{
      const {data,error}=await supabase.from('cms_admins').select('user_id').eq('user_id',session.user.id).maybeSingle()
      if(error){setAccess(error.code==='42P01'||/cms_admins/i.test(error.message)?'migration':'denied');return}
      setAccess(data?'allowed':'denied')
    })()
  },[session])

  const loadAll=async()=>{
    if(!session||access!=='allowed')return
    setLoading(true)
    try{
      const names=['contents','projects','clients','services','behance_items']
      const results=await Promise.all(names.map(name=>supabase.from(name).select('*')))
      const next={}; const errors=[]
      names.forEach((name,index)=>{
        const result=results[index]
        if(result.error)errors.push(`${TABLES[name].label}: ${friendlyDbError(result.error)}`)
        next[name]=(result.data||[]).sort((a,b)=>Number(a.order??999)-Number(b.order??999))
      })
      setAll(next)
      setStatus(errors.length?errors.join(' · '):`Sincronizado às ${new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`)
    }catch(error){ setStatus(`Falha ao sincronizar: ${friendlyDbError(error)}`) }
    finally{ setLoading(false) }
  }
  const seedFallbacks=async()=>{
    if(!session||access!=='allowed'||seeding)return
    setSeeding(true); setStatus('Preparando a base editável…')
    try{
      const existingClients=new Set((all.clients||[]).map(row=>String(row.slug||'').toLowerCase()).filter(Boolean))
      const existingProjects=new Set((all.projects||[]).map(row=>String(row.slug||'').toLowerCase()).filter(Boolean))
      const existingServices=new Set((all.services||[]).map(row=>String(row.title||'').toLowerCase()).filter(Boolean))
      const existingBehance=new Set((all.behance_items||[]).map(row=>normalizeUrl(row.url)).filter(Boolean))
      const nextOrder = rows => Math.max(-1,...rows.map(row=>Number(row.order??-1)))+1
      const clientBase=nextOrder(all.clients||[]), projectBase=nextOrder(all.projects||[]), serviceBase=nextOrder(all.services||[]), behanceBase=nextOrder(all.behance_items||[])
      const clientRows=seededClients.filter(item=>!existingClients.has(item.id.toLowerCase())).map((item,index)=>({slug:item.id,name:item.name,handle:item.handle||null,category:item.category||null,accent:item.accent||null,url:item.url||null,website:item.website||null,brand_poster:item.brandPoster||null,public_cover:item.publicCover||null,public_cover_fit:item.publicCoverFit||'cover',public_proof:item.publicProof||null,active:true,order:clientBase+index}))
      const projectRows=seededProjects.filter(item=>!existingProjects.has(item.id.toLowerCase())).map((item,index)=>({slug:item.id,client:item.clientId||null,label:item.label||null,title:item.title,description:item.summary||null,category:item.label||null,tags:(item.tags||[]).join(', '),theme:item.theme||null,size:item.size||null,cover:item.cover||null,url:/^https?:/i.test(item.href||'')?item.href:null,active:true,order:projectBase+index}))
      const serviceRows=seededSolutions.filter(item=>!existingServices.has(String(item.problem||'').toLowerCase())).map((item,index)=>({title:item.problem,description:item.answer,stack:(item.stack||[]).join(', '),active:true,order:serviceBase+index}))
      const behanceRows=seededBehance.filter(item=>!existingBehance.has(normalizeUrl(item.url))).map((item,index)=>({title:item.title,client:item.client||'Seeven Projects',url:item.url,cover:item.cover||null,tools:(item.tools||[]).join(', '),theme:item.theme||'editorial',active:true,order:behanceBase+index}))
      const batches=[['clients',clientRows],['projects',projectRows],['services',serviceRows],['behance_items',behanceRows]]
      const errors=[]; let inserted=0
      for(const [name,data] of batches){ if(!data.length)continue; const {error}=await supabase.from(name).insert(data); if(error)errors.push(`${TABLES[name].label}: ${friendlyDbError(error)}`); else inserted+=data.length }
      const seedMessage=errors.length?`Migração parcial: ${errors.join(' · ')}`:`${inserted} item(ns) adicionados ao CMS. A base está pronta para edição.`
      await loadAll()
      setStatus(seedMessage)
    }catch(error){setStatus(`Falha ao migrar a base: ${friendlyDbError(error)}`)}
    finally{setSeeding(false)}
  }

  useEffect(()=>{loadAll()},[session,access])
  useEffect(()=>{setSelected(undefined);setQuery('');setStatusFilter('all')},[table])

  const rows=table==='dashboard'?[]:(all[table]||[])
  const readiness=row=>{
    if(table==='contents'){
      const playable=isVideoUrl(row.video)||isReelUrl(row.permalink||row.url)
      if(playable&&row.poster)return['PRONTO','ok']
      if(playable)return['SEM CAPA','mid']
      if(row.poster)return['SÓ CAPA','mid']
      return['PENDENTE','low']
    }
    if(table==='projects'){
      if(!row.cover)return['SEM CAPA','low']
      if(row.slug && !(row.challenge&&row.strategy&&row.result))return['CASE INCOMPLETO','mid']
      return['PRONTO','ok']
    }
    if(table==='behance_items')return row.cover?['PRONTO','ok']:['SEM CAPA','mid']
    if(table==='clients'){
      if(!row.name)return['SEM NOME','low']
      if(!(row.brand_poster||row.public_cover))return['SEM CAPA','mid']
      return['PRONTO','ok']
    }
    if(table==='services'){
      if(!row.title||!row.description)return['INCOMPLETO','low']
      if(!row.stack)return['SEM COMBINAÇÃO','mid']
      return['PRONTO','ok']
    }
    return['PRONTO','ok']
  }
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase()
    return rows.filter(row=>{
      if(q&&!JSON.stringify(row).toLowerCase().includes(q))return false
      if(statusFilter==='published'&&row.active===false)return false
      if(statusFilter==='draft'&&row.active!==false)return false
      if(statusFilter==='attention'&&readiness(row)[1]==='ok')return false
      return true
    })
  },[rows,query,statusFilter,table])

  const remove=async row=>{if(!confirm(`Excluir “${row.title||row.name||'este item'}”? Esta ação não pode ser desfeita.`))return;const {error}=await supabase.from(table).delete().eq('id',row.id);setStatus(error?friendlyDbError(error):'Item removido.');if(!error)loadAll()}
  const toggle=async row=>{const {error}=await supabase.from(table).update({active:row.active===false}).eq('id',row.id);setStatus(error?friendlyDbError(error):'Publicação atualizada.');if(!error)loadAll()}
  const duplicate=async row=>{const copy={...row};['id','created_at','updated_at'].forEach(k=>delete copy[k]);if('title'in copy)copy.title=`${copy.title||'Item'} — cópia`;if('slug'in copy&&copy.slug)copy.slug=`${copy.slug}-copy-${Date.now().toString().slice(-4)}`;copy.active=false;copy.order=Math.max(-1,...rows.map(x=>Number(x.order??-1)))+1;const {error}=await supabase.from(table).insert(copy);setStatus(error?friendlyDbError(error):'Cópia criada como rascunho.');if(!error)loadAll()}
  const move=async(row,direction)=>{
    const ordered=[...rows].sort((a,b)=>Number(a.order??999)-Number(b.order??999)||String(a.id).localeCompare(String(b.id)))
    const index=ordered.findIndex(x=>x.id===row.id), target=ordered[index+direction]
    if(index<0||!target)return
    // Regrava a sequência inteira. Assim ordens duplicadas no CMS não fazem o botão parecer quebrado.
    const reordered=[...ordered]
    ;[reordered[index],reordered[index+direction]]=[reordered[index+direction],reordered[index]]
    const results=await Promise.all(reordered.map((item,position)=>Number(item.order)===position?Promise.resolve({error:null}):supabase.from(table).update({order:position}).eq('id',item.id)))
    const error=results.find(x=>x?.error)?.error
    setStatus(error?friendlyDbError(error):'Ordem atualizada.')
    if(!error)loadAll()
  }
  const exportBackup=()=>{const blob=new Blob([JSON.stringify({version:'9.2',exported_at:new Date().toISOString(),data:all},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`seeven-cms-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url)}

  if(!supabaseEnabled)return <div className="admin-shell"><SetupScreen/></div>
  if(!session)return <div className="admin-shell"><Login onSession={setSession}/></div>
  if(access==='checking')return <div className="admin-shell"><div className="admin-login-wrap"><div className="admin-login"><span>SEE7VEN / CONTROL ROOM</span><h1>Validando acesso…</h1><p>Confirmando sessão e permissões editoriais.</p></div></div></div>
  if(access!=='allowed')return <div className="admin-shell"><AccessScreen mode={access} email={session.user.email}/></div>

  const counts=Object.fromEntries(Object.keys(TABLES).filter(x=>x!=='dashboard').map(name=>[name,(all[name]||[]).length]))
  const clientOptions=[...seededClients,...(all.clients||[])].filter((item,index,array)=>array.findIndex(other=>(other.slug||other.id)===(item.slug||item.id))===index).map(item=>({...item,slug:item.slug||item.id}))
  const title=TABLES[table]
  const defaultOrder=Math.max(-1,...rows.map(row=>Number(row.order??-1)))+1
  const published=rows.filter(row=>row.active!==false).length
  const publicLink = row => {
    if (table === 'projects' && row.slug) return `/work/${encodeURIComponent(row.slug)}`
    if (table === 'contents') return row.permalink || row.video || row.url || ''
    if (table === 'behance_items') return row.url || ''
    if (table === 'clients') return row.website || row.url || ''
    return ''
  }

  return <div className="admin-shell"><div className="admin-app">
    <aside className="admin-sidebar">
      <div className="admin-logo"><span className="brand-mark">7</span><span>SEE7VEN<br/>CONTROL ROOM</span></div>
      <div className="admin-user"><span>ADMIN AUTORIZADO</span><b>{session.user.email}</b></div>
      <nav className="admin-nav">{Object.entries(TABLES).map(([key,meta])=><button key={key} className={table===key?'active':''} onClick={()=>setTable(key)}><span>{meta.label}</span>{key!=='dashboard'&&<small>{counts[key]??0}</small>}</button>)}</nav>
      <div className="admin-sidebar-foot"><a href="/" target="_blank" rel="noreferrer">Abrir LP ↗</a><a href="https://www.behance.net/wedeseeven" target="_blank" rel="noreferrer">Behance ↗</a><button onClick={exportBackup}>Backup JSON</button><button onClick={()=>supabase.auth.signOut()}>Sair</button></div>
    </aside>

    <main className="admin-main">
      <header className="admin-topbar"><div><span>{title.eyebrow}</span><b>{title.label}</b><small>{table==='dashboard'?'Saúde, prioridades e atalhos da presença Seeven.':`${published} publicado(s) de ${rows.length} item(ns)`}</small></div><div className="admin-topbar-actions"><a href="/" target="_blank" rel="noreferrer">VER LP ↗</a><button onClick={loadAll}>{loading?'SINCRONIZANDO…':'SINCRONIZAR'}</button>{table!=='dashboard'&&<button className="primary" onClick={()=>setSelected(null)}>+ NOVO</button>}</div></header>
      <div className="admin-content">
        {table==='dashboard'?<Dashboard all={all} onNavigate={setTable} onSeed={seedFallbacks} seeding={seeding}/>:<>
          {table==='behance_items'&&<BehanceSync rows={rows} onImported={loadAll}/>} 
          {table==='contents'&&<QuickReel clients={clientOptions} rows={rows} onSaved={loadAll}/>} 
          <div className="admin-toolbar"><div className="admin-status" role="status" aria-live="polite">{status||`${rows.length} item(ns) · ${published} publicado(s)`}</div><div className="admin-toolbar-search"><input aria-label="Buscar" placeholder={`Buscar em ${title.label.toLowerCase()}…`} value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Filtrar status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Todos</option><option value="published">Publicados</option><option value="draft">Rascunhos</option><option value="attention">Precisam de atenção</option></select></div><button onClick={()=>setSelected(null)}>+ NOVO ITEM</button></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ORDEM</th><th>MÍDIA</th><th>ITEM</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody>{filtered.map(row=>{const[label,tone]=readiness(row);const media=row.poster||row.cover||row.brand_poster||row.public_cover;return <tr key={row.id}><td><div className="order-controls"><button aria-label="Mover item para cima" onClick={()=>move(row,-1)}>↑</button><span>{row.order??'—'}</span><button aria-label="Mover item para baixo" onClick={()=>move(row,1)}>↓</button></div></td><td>{media?<img className="admin-thumb" src={media} alt="" onError={event=>{event.currentTarget.hidden=true}}/>:<div className="admin-thumb admin-thumb-empty">7</div>}</td><td><strong>{row.title||row.name||row.client||'Sem título'}</strong><small>{row.client||row.category||row.handle||row.slug||''}</small>{publicLink(row)&&<a className="admin-inline-link" href={publicLink(row)} target="_blank" rel="noreferrer">{table==='projects'?'VER CASE':table==='contents'?'ABRIR MÍDIA':table==='behance_items'?'VER BEHANCE':'ABRIR PRESENÇA'} ↗</a>}</td><td><div className="admin-status-stack"><span className={`readiness readiness-${tone}`}>{label}</span><button className={`publish-toggle ${row.active===false?'is-draft':'is-live'}`} onClick={()=>toggle(row)}>{row.active===false?'RASCUNHO':'PUBLICADO'}</button></div></td><td><div className="row-actions"><button onClick={()=>setSelected(row)}>Editar</button><button onClick={()=>duplicate(row)}>Duplicar</button><button className="danger" onClick={()=>remove(row)}>Excluir</button></div></td></tr>})}</tbody></table></div>
          <AdminItemCards rows={filtered} table={table} readiness={readiness} onEdit={setSelected} onToggle={toggle} onDuplicate={duplicate} onRemove={remove} onMove={move}/>
          {filtered.length===0&&<div className="admin-empty"><span>SEM RESULTADOS</span><b>Nada corresponde a este filtro.</b><button onClick={()=>{setQuery('');setStatusFilter('all')}}>LIMPAR FILTROS</button></div>}
        </>}
      </div>
    </main>
    {table!=='dashboard'&&selected!==undefined&&<EditorDrawer table={table} item={selected} clients={clientOptions} defaultOrder={defaultOrder} onClose={()=>setSelected(undefined)} onSaved={loadAll}/>} 
  </div></div>
}
