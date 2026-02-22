import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { RealtimeStateProvider } from './context/RealtimeStateContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RealtimeStateProvider>
      <App />
    </RealtimeStateProvider>
  </StrictMode>,
)
