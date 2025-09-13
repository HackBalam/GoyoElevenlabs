import { QueryClientProvider } from '@tanstack/react-query';
import { ActionButtonList } from '../components/ActionButtonList';
import { InfoList } from '../components/InfoList';
import { Conversation } from '../conversation';
import { ContactsManager } from '../components/ContactsManager';

interface DebugPageProps {
  queryClient: any;
}

export const DebugPage = ({ queryClient }: DebugPageProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-[#7D4AE8] to-[#FF6B57] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">Debug / Desarrollo</h1>
          <p className="mt-2 text-lg opacity-90">Herramientas de desarrollo y debug</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        <div className="bg-white rounded-xl shadow-lg border border-[#7D4AE8]/20 p-6">
          <div className="flex items-center justify-center mb-6">
            <img src="/reown.svg" alt="Reown" className="w-20 h-20" />
          </div>
          <h2 className="text-2xl font-bold text-[#7D4AE8] text-center mb-4">AppKit Core React dApp</h2>
          
          <QueryClientProvider client={queryClient}>
            <div className="space-y-6">
              <div className="flex justify-center">
                <appkit-button />
              </div>
              
              <ActionButtonList />
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-center">
                  <strong>⚠️ Advertencia:</strong> Este projectId solo funciona en localhost.<br/>
                  Ve a <a href="https://cloud.reown.com" target="_blank" className="text-[#1CC5B8] hover:underline font-semibold" rel="Reown Cloud">Reown Cloud</a> para obtener el tuyo.
                </p>
              </div>
              
              <InfoList />
            </div>
          </QueryClientProvider>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#1CC5B8]/20 p-6">
          <h2 className="text-2xl font-bold text-[#1CC5B8] mb-6">ElevenLabs Agent Debug</h2>
          <div className="bg-gradient-to-br from-[#1CC5B8]/5 to-[#7D4AE8]/5 p-6 rounded-lg">
            <Conversation />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#2ECC71]/20 p-6">
          <h2 className="text-2xl font-bold text-[#2ECC71] mb-6">Gestión de Contactos (Debug)</h2>
          <ContactsManager />
        </div>
      </main>
    </div>
  );
};