import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'

// A little hello for fellow developers poking around the console
console.log(
  '%cGean Paulo®%c\nPoking around? Everything fun here is client-side.\nSay hi: https://github.com/geanpaulo19',
  'background: #cdf553; color: #131311; font-weight: 600; font-size: 13px; padding: 3px 8px; border-radius: 4px;',
  'color: #f2f1ec; font-size: 12px; line-height: 1.7; padding: 6px 0;',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
