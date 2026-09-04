import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './main.jsx';
import Admin from './admin.jsx';
export default function Router(){return location.pathname.startsWith('/admin')?<Admin/>:<App/>}
createRoot(document.getElementById('root')).render(<Router/>);
