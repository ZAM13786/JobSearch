import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'

// This part for the mock API can be kept as is.
if (typeof window !== 'undefined') {
  const startMSW = async () => {
    try {
      const { worker } = await import('./mocks/browser')
      const swUrl = `${import.meta.env.BASE_URL}mockServiceWorker.js`
      const head = await fetch(swUrl, { method: 'HEAD' })
      if (head.ok) {
        await worker.start({ serviceWorker: { url: swUrl } })
      }
    } catch (e) {
      console.warn('MSW failed to start', e)
    }
  }
  startMSW()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter 
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)