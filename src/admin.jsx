import React, { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseEnabled } from './supabase'

const emptyByTable = {
  contents: { slug: '', client: '', category: 'reel', title: '', description: '', permalink: '', video: '', url: '', poster: '', featured: false, active: true, order: 0 },
  projects: { slug: '', client: '', label: '', title: '', description: '', category: '', tags: '', theme: '', size: '', cover: '', url: '', eyebrow: '', headline: '', case_intro: '', challenge: '', strategy: '', execution: '', result: '', proof: '', before_title: '', before_text: '', after_title: '', after_text: '', source_url: '', research_context: '', audience: '', objective: '', constraint_text: '', insight: '', decision_text: '', system_map: '', focus: '', channels: '', signal: '', active: true, order: 0 },
  clients: { slug: '', name: '', handle: '', category: '', accent: '', url: '', website: '', brand_poster: '', public_cover: '', public_cover_fit: 'cover', public_proof: '', active: true, order: 0 },
  services: { title: '', description: '', active: true, order: 0 }
}

function Login({ onSession }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Entrando…')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return setStatus(error.message)
    onSession(data.session)
  }

  return <div className="admin-login">
    <span className="index-label">SEE7VEN / ADMIN</span>
    <h1>Conteúdo sem deploy.</h1>
    <p>Este painel usa o Supabase configurado pelas variáveis <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.</p>
    <form className="admin-form" onSubmit={submit}>
      <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required/>
      <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required/>
      <button type="submit">Entrar</button>
    </form>
    {status && <div className="admin-status">{status}</div>}
  </div>
}

function Editor({ table, item, onDone }) {
  const [form, setForm] = useState(item || emptyByTable[table])
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => setForm(item || emptyByTable[table]), [item, table])

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const fields = Object.entries(form).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))
  const fieldLabels = {
    slug: 'Slug estável', client: 'Cliente / slug', category: 'Categoria', title: 'Título', description: 'Descrição', permalink: 'Permalink do Reel / Instagram', video: 'Arquivo de vídeo / URL .mp4', url: 'URL legado / fonte', poster: 'Poster / capa', featured: 'Destaque', active: 'Publicado', order: 'Ordem',
    label: 'Label editorial', tags: 'Tags (vírgula)', theme: 'Tema visual', size: 'Tamanho do card', cover: 'Capa do projeto', eyebrow: 'Case / eyebrow', headline: 'Case / headline', case_intro: 'Case / introdução', challenge: 'Case / desafio', strategy: 'Case / estratégia', execution: 'Case / execução (vírgula)', result: 'Case / resultado', proof: 'Case / provas (vírgula)', before_title: 'Before / título', before_text: 'Before / texto', after_title: 'After / título', after_text: 'After / texto', source_url: 'Fonte pública do case', research_context: 'Project Intelligence / contexto', audience: 'Project Intelligence / público', objective: 'Project Intelligence / objetivo', constraint_text: 'Project Intelligence / restrição', insight: 'Project Intelligence / insight', decision_text: 'Project Intelligence / decisão', system_map: 'Project Intelligence / sistema', focus: 'Project Intelligence / focos (vírgula)', channels: 'Project Intelligence / canais (vírgula)', signal: 'Project Intelligence / signal 0-100 (vírgula)',
    name: 'Nome', handle: 'Perfil / handle', accent: 'Cor de assinatura', website: 'Website', brand_poster: 'Brand poster', public_cover: 'Capa pública / própria', public_cover_fit: 'Ajuste da capa', public_proof: 'Contexto público'
  }

  const makeVideoPoster = (file) => new Promise((resolve) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'metadata'
    const objectUrl = URL.createObjectURL(file)
    const cleanup = () => URL.revokeObjectURL(objectUrl)
    video.onloadedmetadata = () => { video.currentTime = Math.min(1, Math.max(.1, (video.duration || 1) * .15)) }
    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas')
        const max = 1080
        const scale = Math.min(1, max / Math.max(video.videoWidth || max, video.videoHeight || max))
        canvas.width = Math.max(1, Math.round((video.videoWidth || 1080) * scale))
        canvas.height = Math.max(1, Math.round((video.videoHeight || 1920) * scale))
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob(blob => { cleanup(); resolve(blob) }, 'image/jpeg', .86)
      } catch (_) { cleanup(); resolve(null) }
    }
    video.onerror = () => { cleanup(); resolve(null) }
    video.src = objectUrl
  })

  const uploadMedia = async (file) => {
    if (!file) return
    const targetField = table === 'contents' ? (file.type.startsWith('video/') ? 'video' : 'poster') : table === 'projects' ? 'cover' : null
    if (!targetField) return setStatus('Upload direto disponível para conteúdos e projetos.')
    setUploading(true)
    setStatus('Enviando mídia…')
    const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
    const path = `${table}/${Date.now()}-${safe}`
    const { error } = await supabase.storage.from('portfolio-assets').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) { setUploading(false); return setStatus(error.message) }
    const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(path)
    if (table === 'contents' && file.type.startsWith('video/')) {
      const posterBlob = await makeVideoPoster(file)
      let posterUrl = form.poster || ''
      if (posterBlob) {
        const posterPath = `${table}/${Date.now()}-${safe.replace(/\.[^.]+$/, '')}-poster.jpg`
        const posterUpload = await supabase.storage.from('portfolio-assets').upload(posterPath, posterBlob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false })
        if (!posterUpload.error) posterUrl = supabase.storage.from('portfolio-assets').getPublicUrl(posterPath).data.publicUrl
      }
      setForm(prev => ({ ...prev, video: data.publicUrl, poster: posterUrl }))
      setStatus(posterUrl ? 'Vídeo e capa automática prontos. Salve o item para publicar.' : 'Vídeo enviado. Não foi possível gerar a capa automática; selecione um poster.')
    } else {
      set(targetField, data.publicUrl)
      setStatus('Upload concluído. Salve o item para publicar.')
    }
    setUploading(false)
  }

  const onDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer?.files?.[0]
    if (file) uploadMedia(file)
  }

  const save = async (e) => {
    e.preventDefault()
    setStatus('Salvando…')
    const payload = { ...form }
    Object.keys(payload).forEach(k => payload[k] === '' && delete payload[k])
    const query = item?.id
      ? supabase.from(table).update(payload).eq('id', item.id)
      : supabase.from(table).insert(payload)
    const { error } = await query
    if (error) return setStatus(error.message)
    setStatus('Salvo.')
    onDone()
  }

  return <form className="admin-editor admin-form" onSubmit={save}>
    <h2>{item?.id ? 'Editar item' : 'Novo item'} / {table}</h2>
    <div className="admin-grid">
      {fields.map(([key, value]) => {
        const isBool = typeof value === 'boolean'
        const isLong = ['description', 'public_proof', 'case_intro', 'challenge', 'strategy', 'result', 'before_text', 'after_text', 'research_context', 'audience', 'objective', 'constraint_text', 'insight', 'decision_text', 'system_map'].includes(key)
        const section = table === 'projects' && key === 'eyebrow' ? <div className="admin-field-section full"><b>CASE STORY</b><span>Preencha esta parte para transformar o projeto em um case navegável e compartilhável.</span></div> : table === 'projects' && key === 'research_context' ? <div className="admin-field-section full"><b>PROJECT INTELLIGENCE</b><span>Contexto, público, insight e decisão alimentam o modo de case-study estratégico da V7.2.</span></div> : table === 'projects' && key === 'active' ? <div className="admin-field-section full"><b>PUBLICAÇÃO</b><span>Controle status e posição depois de estruturar o conteúdo.</span></div> : null
        let control
        if (isBool) control = <label>{fieldLabels[key] || key}<select value={String(value)} onChange={e => set(key, e.target.value === 'true')}><option value="true">Sim</option><option value="false">Não</option></select></label>
        else if (key === 'size') control = <label>{fieldLabels[key] || key}<select value={value ?? ''} onChange={e => set(key, e.target.value)}><option value="">Automático</option><option value="sm">sm</option><option value="md">md</option><option value="lg">lg</option><option value="xl">xl</option></select></label>
        else if (key === 'theme') control = <label>{fieldLabels[key] || key}<select value={value ?? ''} onChange={e => set(key, e.target.value)}><option value="">Automático</option>{['orange','wine','acid','violet','steel','sky','event','music','food'].map(theme => <option key={theme} value={theme}>{theme}</option>)}</select></label>
        else if (key === 'public_cover_fit') control = <label>{fieldLabels[key] || key}<select value={value ?? 'cover'} onChange={e => set(key, e.target.value)}><option value="cover">cover</option><option value="contain">contain</option></select></label>
        else if (isLong) control = <label className="full">{fieldLabels[key] || key}<textarea rows="4" value={value ?? ''} onChange={e => set(key, e.target.value)}/></label>
        else control = <label>{fieldLabels[key] || key}<input type={key === 'order' ? 'number' : 'text'} value={value ?? ''} onChange={e => set(key, key === 'order' ? Number(e.target.value) : e.target.value)}/></label>
        return <React.Fragment key={key}>{section}{control}</React.Fragment>
      })}
      {(table === 'contents' || table === 'projects') && <label className="admin-upload full" onDragOver={e => e.preventDefault()} onDrop={onDrop}><span><b>MEDIA VAULT</b> Arraste ou selecione imagem/vídeo para enviar ao bucket <code>portfolio-assets</code>.</span><input type="file" accept="image/*,video/mp4,video/webm" disabled={uploading} onChange={e => uploadMedia(e.target.files?.[0])}/><i>{uploading ? 'ENVIANDO…' : 'ESCOLHER ARQUIVO'}</i></label>}
      {table === 'contents' && <div className="admin-media-help"><b>Vídeos e destaques:</b> use <code>permalink</code> para a URL exata do Reel do Instagram e <code>video</code> para o arquivo próprio <code>.mp4/.webm</code>. O Media Vault preenche <code>video</code> e tenta gerar <code>poster</code> automaticamente. Marque <code>featured=true</code> para entrar nos Destaques. <code>url</code> continua disponível apenas para compatibilidade com registros antigos.</div>}
      {table === 'projects' && <div className="admin-media-help"><b>Capa do projeto:</b> use <code>cover</code> para a imagem principal. <code>slug</code> pode reaproveitar um case estrutural existente (ex.: <code>sindpetshop-ecosystem</code>). <code>tags</code>, <code>execution</code> e <code>proof</code> aceitam valores separados por vírgula. Preencha desafio/estratégia/resultado para criar um case compartilhável em <code>/work/slug</code>. Se a capa ficar vazia, o card mantém a direção de arte e exibe a identidade da marca como apoio.</div>}
      {table === 'clients' && <div className="admin-media-help"><b>Cliente / identidade:</b> use um <code>slug</code> estável (ex.: <code>venancio</code>), cor em <code>accent</code> e, quando possível, envie a arte própria para <code>brand_poster</code>/<code>public_cover</code>. O front-end preserva os IDs seeded durante a migração para não quebrar Reels e cases.</div>}
      {(form.poster || form.cover) && <div className="admin-media-preview"><img src={form.poster || form.cover} alt="Prévia da mídia"/><div><b>Prévia da capa</b><br/>Esta é a mídia que será priorizada no site. URLs públicas funcionam, mas arquivos próprios em Storage/CDN são mais estáveis para produção.</div></div>}
    </div>
    <button type="submit">Salvar</button>
    {status && <div className="admin-status">{status}</div>}
  </form>
}

function PitchLinkBuilder() {
  const [segment, setSegment] = useState('food')
  const [prospect, setProspect] = useState('')
  const [copied, setCopied] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const link = `${origin}/?for=${encodeURIComponent(segment)}${prospect.trim() ? `&prospect=${encodeURIComponent(prospect.trim())}` : ''}`
  const copy = async () => {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch (_) {}
  }
  return <div className="admin-pitch-builder">
    <div><b>PITCH LINK BUILDER</b><span>Gere um link da mesma LP priorizando cases do segmento e, se quiser, reconhecendo o prospect no hero.</span></div>
    <select value={segment} onChange={e => setSegment(e.target.value)}><option value="food">Food</option><option value="eventos">Eventos</option><option value="b2b">B2B</option><option value="institucional">Institucional</option><option value="nightlife">Nightlife</option></select>
    <input value={prospect} onChange={e => setProspect(e.target.value)} placeholder="Nome do prospect (opcional)"/>
    <button onClick={copy}>{copied ? 'COPIADO ✓' : 'COPIAR LINK'}</button>
    <code>{link}</code>
  </div>
}

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [table, setTable] = useState('contents')
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')
  const [queryText, setQueryText] = useState('')

  useEffect(() => {
    if (!supabaseEnabled) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => listener.subscription.unsubscribe()
  }, [])

  const load = async () => {
    if (!session) return
    setStatus('Carregando…')
    const { data, error } = await supabase.from(table).select('*')
    if (error) { setRows([]); return setStatus(error.message) }
    const ordered = (data || []).sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
    setRows(ordered)
    setStatus(`${ordered.length} itens · ${ordered.filter(r => r.active !== false).length} ativos`)
  }

  useEffect(() => { setSelected(null); setQueryText(''); load() }, [table, session])

  const filteredRows = useMemo(() => {
    const q = queryText.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(row => JSON.stringify(row).toLowerCase().includes(q))
  }, [rows, queryText])

  const remove = async (id) => {
    if (!confirm('Remover este item?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) setStatus(error.message)
    else load()
  }

  const toggleActive = async (row) => {
    setStatus('Atualizando publicação…')
    const { error } = await supabase.from(table).update({ active: row.active === false }).eq('id', row.id)
    if (error) setStatus(error.message); else load()
  }

  const duplicate = async (row) => {
    const copy = { ...row }
    ;['id','created_at','updated_at'].forEach(key => delete copy[key])
    if ('title' in copy) copy.title = `${copy.title || 'Item'} — cópia`
    copy.order = Number(copy.order ?? rows.length) + 1
    const { error } = await supabase.from(table).insert(copy)
    if (error) setStatus(error.message); else load()
  }

  const move = async (row, direction) => {
    const ordered = [...rows].sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999))
    const index = ordered.findIndex(item => item.id === row.id)
    const targetIndex = index + direction
    if (index < 0 || targetIndex < 0 || targetIndex >= ordered.length) return
    const target = ordered[targetIndex]
    const aOrder = Number(row.order ?? index)
    const bOrder = Number(target.order ?? targetIndex)
    setStatus('Reordenando…')
    const [a,b] = await Promise.all([
      supabase.from(table).update({ order: bOrder }).eq('id', row.id),
      supabase.from(table).update({ order: aOrder }).eq('id', target.id)
    ])
    if (a.error || b.error) setStatus(a.error?.message || b.error?.message); else load()
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `seeven-${table}-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url)
  }

  const readiness = (row) => {
    if (table === 'contents') {
      if (row.poster && /instagram\.com\/(reel|p|tv)\//i.test(String(row.permalink || row.url || ''))) return ['REEL + CAPA', 'ok']
      if (row.poster && (row.video || /\.(mp4|webm)(\?|$)/i.test(String(row.url || '')))) return ['VÍDEO + CAPA', 'ok']
      if (row.poster) return ['CAPA', 'mid']
      return ['FALLBACK', 'low']
    }
    if (table === 'projects') return row.cover ? ['CAPA', 'ok'] : ['SEM CAPA', 'low']
    return [row.active === false ? 'RASCUNHO' : 'ATIVO', row.active === false ? 'mid' : 'ok']
  }

  if (!supabaseEnabled) return <div className="admin-shell"><div className="admin-card"><div className="admin-body admin-login"><span className="index-label">SEE7VEN / ADMIN</span><h1>Supabase não configurado.</h1><p>Copie <code>.env.example</code> para <code>.env.local</code>, preencha URL e chave pública e reinicie o Vite. O site público continua funcionando com os dados estáticos de <code>src/data.js</code>.</p><a href="/">← Voltar ao site</a></div></div></div>

  if (!session) return <div className="admin-shell"><div className="admin-card"><div className="admin-body"><Login onSession={setSession}/></div></div></div>

  return <div className="admin-shell">
    <div className="admin-card">
      <div className="admin-top"><strong>SEE7VEN / ADMIN 2.3</strong><div><a href="/">Ver site</a> <button onClick={exportJson}>Exportar JSON</button> <button onClick={() => supabase.auth.signOut()}>Sair</button></div></div>
      <div className="admin-body">
        <div className="admin-tabs">{Object.keys(emptyByTable).map(name => <button className={table === name ? 'active' : ''} key={name} onClick={() => setTable(name)}>{name}</button>)}</div>
        <PitchLinkBuilder/>
        <div className="admin-toolbar"><div className="admin-status">{status}</div><input aria-label="Buscar itens" placeholder={`Buscar em ${table}…`} value={queryText} onChange={e => setQueryText(e.target.value)}/><button onClick={() => setSelected(null)}>+ Novo item</button></div>
        <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ORDEM</th><th>MÍDIA</th><th>TÍTULO / NOME</th><th>STATUS</th><th>AÇÕES</th></tr></thead><tbody>
          {filteredRows.map(row => { const [label,tone] = readiness(row); return <tr key={row.id}>
            <td><div className="order-controls"><button title="Subir" onClick={() => move(row,-1)}>↑</button><span>{row.order ?? '—'}</span><button title="Descer" onClick={() => move(row,1)}>↓</button></div></td>
            <td>{row.poster || row.cover ? <img className="admin-thumb" src={row.poster || row.cover} alt=""/> : <div className="admin-thumb admin-thumb-empty">7</div>}</td>
            <td><strong>{row.title || row.name || row.client || '—'}</strong><small>{row.client || row.category || row.handle || ''}</small></td>
            <td><button className={`readiness readiness-${tone}`} onClick={() => toggleActive(row)}>{row.active === false ? 'RASCUNHO' : label}</button></td>
            <td><div className="row-actions"><button onClick={() => setSelected(row)}>Editar</button><button onClick={() => duplicate(row)}>Duplicar</button><button onClick={() => remove(row.id)}>Excluir</button></div></td>
          </tr>})}
        </tbody></table></div>
        <Editor table={table} item={selected} onDone={() => { setSelected(null); load() }}/>
      </div>
    </div>
  </div>
}

