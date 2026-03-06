import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Augenstein from './augenstein.tsx'

function App() {
  return <Augenstein />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
