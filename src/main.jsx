import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import Toast from './components/Toast'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toast />
  </React.StrictMode>
)
