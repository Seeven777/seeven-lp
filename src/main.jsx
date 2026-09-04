import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import AdminApp from './admin'
import './styles.css'

const isAdmin = window.location.pathname.replace(/\/+$/, '') === '/admin'

createRoot(document.getElementById('root')).render(
  isAdmin ? <AdminApp/> : <App/>
)
