import React, { useEffect, useMemo, useState } from 'react'
import { supabase, supabaseEnabled } from './supabase'

const emptyByTable = {
  contents: { client: '', category: '', title: '', url: '', poster: '', featured: false, active: true, order: 0 },
  projects: { title: '', description: '', cover: '', url: '', active: true, order: 0 },
  clients: { name: '', handle: '', url: '', active: true, order: 0 },
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

  useEffect(() => setForm(item || emptyByTable[table]), [item, table])

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }))
  const fields = Object.entries(form).filter(([key]) => !['id', 'created_at', 'updated_at'].includes(key))

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
        const isLong = ['description'].includes(key)
        if (isBool) return <label key={key}>{key}<select value={String(value)} onChange={e => set(key, e.target.value === 'true')}><option value="true">true</option><option value="false">false</option></select></label>
        if (isLong) return <label className="full" key={key}>{key}<textarea rows="4" value={value ?? ''} onChange={e => set(key, e.target.value)}/></label>
        return <label key={key}>{key}<input type={key === 'order' ? 'number' : 'text'} value={value ?? ''} onChange={e => set(key, key === 'order' ? Number(e.target.value) : e.target.value)}/></label>
      })}
    </div>
    <button type="submit">Salvar</button>
    {status && <div className="admin-status">{status}</div>}
  </form>
}

export default function AdminApp() {
  const [session, setSession] = useState(null)
  const [table, setTable] = useState('contents')
  const [rows, setRows] = useState([])
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!supabaseEnabled) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => listener.subscription.unsubscribe()
  }, [])

  const load = async () => {
    if (!session) return
    setStatus('Carregando…')
    let query = supabase.from(table).select('*')
    const { data, error } = await query
    if (error) { setRows([]); return setStatus(error.message) }
    setRows((data || []).sort((a,b) => Number(a.order ?? 999) - Number(b.order ?? 999)))
    setStatus(`${data?.length || 0} itens`)
  }

  useEffect(() => { setSelected(null); load() }, [table, session])

  const remove = async (id) => {
    if (!confirm('Remover este item?')) return
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) setStatus(error.message)
    else load()
  }

  if (!supabaseEnabled) return <div className="admin-shell"><div className="admin-card"><div className="admin-body admin-login"><span className="index-label">SEE7VEN / ADMIN</span><h1>Supabase não configurado.</h1><p>Copie <code>.env.example</code> para <code>.env.local</code>, preencha URL e chave pública e reinicie o Vite. O site público continua funcionando com os dados estáticos de <code>src/data.js</code>.</p><a href="/">← Voltar ao site</a></div></div></div>

  if (!session) return <div className="admin-shell"><div className="admin-card"><div className="admin-body"><Login onSession={setSession}/></div></div></div>

  return <div className="admin-shell">
    <div className="admin-card">
      <div className="admin-top"><strong>SEE7VEN / ADMIN</strong><div><a href="/">Ver site</a> <button onClick={() => supabase.auth.signOut()}>Sair</button></div></div>
      <div className="admin-body">
        <div className="admin-tabs">{Object.keys(emptyByTable).map(name => <button className={table === name ? 'active' : ''} key={name} onClick={() => setTable(name)}>{name}</button>)}</div>
        <div className="admin-status">{status}</div>
        <table className="admin-table"><thead><tr><th>ID</th><th>TÍTULO / NOME</th><th>ATIVO</th><th>AÇÕES</th></tr></thead><tbody>
          {rows.map(row => <tr key={row.id}><td>{String(row.id).slice(0,8)}</td><td>{row.title || row.name || row.client || '—'}</td><td>{String(row.active ?? '—')}</td><td><button onClick={() => setSelected(row)}>Editar</button> <button onClick={() => remove(row.id)}>Excluir</button></td></tr>)}
        </tbody></table>
        <Editor table={table} item={selected} onDone={() => { setSelected(null); load() }}/>
      </div>
    </div>
  </div>
}
