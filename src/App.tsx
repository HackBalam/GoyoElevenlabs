/* 
Para implementar como base el proyecto de reown se utilizó como referencia la sigueinte documentación:
https://docs.monad.xyz/guides/reown-guide
Adicionalmente en este archivo se agrega el front de el agente de voz de elevenlabs.
*/

import { createAppKit } from '@reown/appkit/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionButtonList } from './components/ActionButtonList'
import { InfoList } from './components/InfoList'
import { projectId, metadata, networks } from './config'

import "./App.css"
import { Conversation } from "./conversation.tsx"//Se importa el archivo de configuración del agente de voz de elevenlabs.
import { ContactsManager } from "./components/ContactsManager"// Se importa el componente de gestión de contactos.

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
    socials: [],
    email: false
  }
})

export function App() {
  

//Aquí se encuentra el frontend de elevenlabs y reown.
  return (
    <div className={"pages"}>
      <img src="/reown.svg" alt="Reown" style={{ width: '150px', height: '150px' }} />
      <h1>AppKit Core React dApp Example</h1>
        <QueryClientProvider client={queryClient}>
            <appkit-button />
            <ActionButtonList />
            <div className="advice">
              <p>
                This projectId only works on localhost. <br/>
                Go to <a href="https://cloud.reown.com" target="_blank" className="link-button" rel="Reown Cloud">Reown Cloud</a> to get your own.
              </p>
            </div>
            <InfoList />
        </QueryClientProvider>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
            <h1 className="text-4xl font-bold mb-8 text-center">
              Elevenlabs Agents
            </h1>
            <Conversation />
          </div>
        </main>
        <ContactsManager />
    </div>
  )
}

export default App
