import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { A11yProvider } from './a11y.jsx'
import { LanguageProvider } from './i18n.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <A11yProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </A11yProvider>
  </StrictMode>,
)
