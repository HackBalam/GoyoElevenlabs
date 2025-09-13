import { useCallback, useState } from 'react';
import { useConversation } from '@elevenlabs/react';
import { useAppKitAccount, useWalletInfo, useAppKitProvider, type Provider } from '@reown/appkit/react-core';
import { MicrophoneAnimation } from '../components/MicrophoneAnimation';
import { contactsStorage } from '../utils/contactsStorage';

export const HomePage = () => {
  const { address, isConnected, status } = useAppKitAccount();
  const { walletInfo } = useWalletInfo();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  
  const [contactCheck, setContactCheck] = useState<boolean>(false);
  const [transferHash, setTransferHash] = useState<string>('');

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const executeTransfer = useCallback(async (toAddress: string, amount: string, token: string) => {
    try {
      if (!isConnected || !walletProvider || !address) {
        console.error('❌ Wallet no conectada o provider no disponible');
        return;
      }
      
      console.log('🔄 Iniciando transferencia...');
      console.log('📍 Desde:', address);
      console.log('📍 Hacia:', toAddress);
      console.log('💰 Cantidad:', amount);
      console.log('🪙 Token:', token);
      
      const amountInWei = '0x' + (parseFloat(amount) * Math.pow(10, 18)).toString(16);
      
      const transactionParams = {
        from: address,
        to: toAddress,
        value: amountInWei,
        gas: '0x5208',
      };
      
      console.log('📋 Parámetros de transacción:', transactionParams);
      
      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [transactionParams]
      });
      
      console.log('✅ Transferencia exitosa! Hash:', txHash);
      setTransferHash(txHash as string);
      
    } catch (error: any) {
      console.error('❌ Error en la transferencia:', error);
      setTransferHash('error');
    }
  }, [isConnected, walletProvider, address]);

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await conversation.startSession({
        agentId: 'agent_7601k3d9c9kme3ks4090bek2vk40',
        userId: 'navalue',
        connectionType: 'webrtc',
        clientTools:{actionHandler: async ({action,contact,token,token2,amount})=>{
          console.log("🟢 Acción recibida:", action, " Datos recibidos",contact,"|",amount,"|",token,"|",token2);
          
          if (contact) {
            const foundContacts = contactsStorage.findContactsByName(contact);
            
            if (foundContacts.length > 0) {
              const foundContact = foundContacts[0];
              setContactCheck(true);
              console.log("✅ Contacto encontrado:", foundContact.name, "- Dirección:", foundContact.address);
              
              if (action === 'transfer' && amount && token) {
                await executeTransfer(foundContact.address, amount, token);
              }
            } else {
              setContactCheck(false);
              console.log("❌ Contacto no encontrado:", contact);
            }
          }
        }},
        dynamicVariables:{
            elevenlabs_Address:address || '',
            elevenlabs_Status:status || 'disconnected',
            elevenlabs_Wallet_Name:walletInfo?.name || 'Unknown',
            elevenlabs_check_contact:contactCheck,
        }
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, address, status, walletInfo, contactCheck, executeTransfer, setContactCheck]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full p-4 md:p-6 flex justify-end">
        <appkit-button />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 -mt-16">
        <div className="flex flex-col items-center gap-8 md:gap-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-[#1CC5B8] to-[#7D4AE8] bg-clip-text text-transparent mb-4 md:mb-8">
            GOYO
          </h1>
          
          <div 
            onClick={conversation.status === 'connected' ? stopConversation : startConversation}
            className="cursor-pointer"
          >
            <MicrophoneAnimation 
              isListening={conversation.isSpeaking || conversation.status === 'connected'}
              isConnected={isConnected}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={startConversation}
              disabled={conversation.status === 'connected' || !isConnected}
              className="px-6 py-3 bg-gradient-to-r from-[#1CC5B8] to-[#7D4AE8] text-white rounded-full font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 min-w-[160px] border-0 outline-none"
            >
              Start Conversation
            </button>
            <button
              onClick={stopConversation}
              disabled={conversation.status !== 'connected'}
              className="px-6 py-3 bg-[#FF6B57] text-white rounded-full font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300 min-w-[160px] border-0 outline-none"
            >
              Stop Conversation
            </button>
          </div>

          <div className="text-center">
            <p className="text-lg md:text-xl text-gray-600">
              Status: <span className="font-semibold text-[#1CC5B8]">{conversation.status}</span>
            </p>
            <p className="text-md text-gray-500">
              Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}
            </p>
          </div>
        </div>
      </main>

      <footer className="p-4 md:p-6 text-center">
        {transferHash && transferHash !== 'error' && (
          <div className="bg-gradient-to-r from-[#2ECC71]/10 to-[#1CC5B8]/10 p-4 rounded-lg border border-[#2ECC71]/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-[#2ECC71] mb-2">Transferencia exitosa! Hash:</h3>
            <p className="text-sm font-mono text-gray-600 break-all">{transferHash}</p>
          </div>
        )}
        {transferHash === 'error' && (
          <div className="bg-gradient-to-r from-[#E74C3C]/10 to-[#FF6B57]/10 p-4 rounded-lg border border-[#E74C3C]/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-[#E74C3C] mb-2">Error en la transferencia</h3>
            <p className="text-sm text-gray-600">Hubo un problema al procesar la transacción.</p>
          </div>
        )}
      </footer>
    </div>
  );
};