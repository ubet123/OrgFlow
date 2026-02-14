import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SocketContextProvider } from './context/socketContext';


createRoot(document.getElementById('root')).render(
 
  <SocketContextProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </SocketContextProvider>
  
 
  
)
