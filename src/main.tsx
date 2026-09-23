import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'

const rootElement = document.querySelector<HTMLDivElement>('#app')

if (!rootElement) {
  throw new Error('Не найден корневой элемент приложения.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
