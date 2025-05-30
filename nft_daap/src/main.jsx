import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import '@fontsource/press-start-2p';

import "@fontsource/montserrat"; // Default weight: 400
import "@fontsource/montserrat/300.css"; // Weight 300
import "@fontsource/montserrat/500.css"; // Weight 500
import "@fontsource/montserrat/700-italic.css"; // Weight 700, Italic

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
