/* 
Este es el archivo de configuración del agente de voz de ElevenLabs, 
elaborado tomando como referencia la siguiente documentación oficial:
https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js

Adicionalmente aquí se comparten los parametros del appkit utilizado
en la conexión de la wallet con reown.
*/

'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback } from 'react';
import { useAppKitAccount, useWalletInfo } from '@reown/appkit/react-core';//Los paquetes necesarios para llamar la información de la wallet de reown (Para mayor entendimiento de como funciona el appkit ir a components/InfoList.tsx).


export function Conversation() {
    const { address, isConnected, status } = useAppKitAccount();//Se específican los datos que se llaman del appkit de reown.
    const { walletInfo } = useWalletInfo();//Se específican los datos que se llaman del appkit de reown (Para extraer el nombre de la wallet conectada).
    const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Start the conversation with your agent
      await conversation.startSession({
        agentId: 'agent_7601k3d9c9kme3ks4090bek2vk40',//ID de Agente de elevenlabs configurado.
        user_id: 'navalue',
        clientTools:{actionHandler: async ({action})=>{console.log("🟢 [ActionHandler] Nueva acción recibida:", action);}}, //uso de clientTools para obtener la acción que quiere usar el usuario a travez del agente de voz
        dynamicVariables:{
            elevenlabs_Address:address,//Variable dinámica que se manda al agente de voz de elevenlabs (Address de la wallet).
            elevenlabs_Status:status, //Variable dinámica que se manda al agente de voz de elevenlabs (Status de conexión de la wallet).
            elevenlabs_Wallet_Name:walletInfo?.name || 'Unknown' //Variable dinámica que se manda al agente de voz de elevenlabs (Con que wallet se conectó).
        }
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, address, status, walletInfo]); //IMPORTANTE AGREGAR LAS VARIABLES DINÁMICAS QUE SE UTILIZARÁN PARA MANDAR AL AGENTE DE VOZ.

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          onClick={startConversation}
          disabled={conversation.status === 'connected'}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Conversation
        </button>
        <button
          onClick={stopConversation}
          disabled={conversation.status !== 'connected'}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop Conversation
        </button>
      </div>

      <div className="flex flex-col items-center">
        <p>Status: {conversation.status}</p>
        <p>Agent is {conversation.isSpeaking ? 'speaking' : 'listening'}</p>
        <div className="mt-4 p-2 bg-gray-100 rounded">
        </div>
      </div>
    </div>
  );
}