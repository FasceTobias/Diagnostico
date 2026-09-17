import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './lib/session-cleanup'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/* PWA: el service worker sólo cachea el shell para que la app abra al
   instante y funcione sin señal. Nada de push todavía.

   VITE_NO_SW=1 lo desactiva, para builds de previsualización que no viven
   en la raíz de su propio dominio y no deberían registrar nada. */
if ('serviceWorker' in navigator && import.meta.env.PROD && !import.meta.env.VITE_NO_SW) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
