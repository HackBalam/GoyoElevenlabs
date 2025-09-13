/* 
Para implementar como base el proyecto de reown se utilizó como referencia la sigueinte documentación:
https://docs.monad.xyz/guides/reown-guide
Adicionalmente en este archivo se agrega el front de el agente de voz de elevenlabs.
Se implementó React Router para navegación entre páginas con diseño responsivo.
*/

import { createAppKit } from '@reown/appkit/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { projectId, metadata, networks } from './config'
import { Navigation } from './components/Navigation'
import { HomePage } from './pages/HomePage'
import { ContactsPage } from './pages/ContactsPage'
import { DebugPage } from './pages/DebugPage'

import "./App.css"

const queryClient = new QueryClient()

const generalConfig = {
  projectId,
  networks,
  metadata,
  themeMode: 'light' as const,
  themeVariables: {
    '--w3m-accent': '#000000',
  }
}

// Create modal
createAppKit({
  ...generalConfig,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: ["google","x","github","discord","apple","facebook","farcaster",],
    email: true,
    emailShowWallets: true
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-white to-[#1CC5B8]/5">
          <div className="hidden md:block fixed top-4 left-4 z-50">
            <Navigation />
          </div>
          
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/debug" element={<DebugPage queryClient={queryClient} />} />
          </Routes>
          
          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
