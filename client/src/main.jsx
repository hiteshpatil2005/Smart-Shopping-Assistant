import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner"
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#fb5600',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            fontSize: '16px',
            border: '1px solid #F97316',
          },
          duration: 3000,
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
