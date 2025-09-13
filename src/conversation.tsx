/* 
Este es el archivo de configuración del agente de voz de ElevenLabs, 
elaborado tomando como referencia la siguiente documentación oficial:
https://elevenlabs.io/docs/agents-platform/guides/quickstarts/next-js

Adicionalmente aquí se comparten los parametros del appkit utilizado
en la conexión de la wallet con reown.
*/

'use client';

import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react'; // Se agrega useState para manejar el estado de las variables de contacto
import { useAppKitAccount, useWalletInfo, useAppKitProvider, type Provider } from '@reown/appkit/react-core';//Los paquetes necesarios para llamar la información de la wallet de reown (Para mayor entendimiento de como funciona el appkit ir a components/InfoList.tsx).
import { contactsStorage } from './utils/contactsStorage'; // Se importa el módulo de manejo de contactos desde localStorage


// Exportar una función que retorne las variables de contacto para uso en otros componentes
export function useContactValidation() {
  const [contactCheck, setContactCheck] = useState<boolean>(false);
  const [addressContact, setAddressContact] = useState<string>('');
  
  return { contactCheck, setContactCheck, addressContact, setAddressContact };
}

export function Conversation() {
    const { address, isConnected, status } = useAppKitAccount();//Se específican los datos que se llaman del appkit de reown.
    const { walletInfo } = useWalletInfo();//Se específican los datos que se llaman del appkit de reown (Para extraer el nombre de la wallet conectada).
    const { walletProvider } = useAppKitProvider<Provider>('eip155'); // Provider de wallet para ejecutar transacciones
    
    // Estados para manejar la información de contactos validados
    const [contactCheck, setContactCheck] = useState<boolean>(false); // Variable que indica si el contacto existe en localStorage
    const [addressContact, setAddressContact] = useState<string>(''); // Variable que almacena la dirección del contacto validado
    const [transferStatus, setTransferStatus] = useState<string>(''); // Variable que almacena el estado de la transferencia para enviar al agente de voz
    
    // Función para ejecutar la transferencia usando el provider de la wallet
    const executeTransfer = useCallback(async (toAddress: string, amount: string, token: string) => {
      try {
        // Verificar que la wallet esté conectada y el provider esté disponible
        if (!isConnected || !walletProvider || !address) {
          console.error('❌ Wallet no conectada o provider no disponible');
          setTransferStatus('error_wallet_not_connected'); // Actualizar estado de transferencia
          return;
        }
        
        setTransferStatus('initiating'); // Establecer estado inicial de transferencia
        console.log('🔄 Iniciando transferencia...');
        console.log('📍 Desde:', address); // Dirección del usuario conectado
        console.log('📍 Hacia:', toAddress); // Dirección del contacto encontrado
        console.log('💰 Cantidad:', amount); // Cantidad a transferir
        console.log('🪙 Token:', token); // Token a transferir
        
        // Convertir la cantidad a Wei (multiplicar por 10^18 para ETH)
        const amountInWei = '0x' + (parseFloat(amount) * Math.pow(10, 18)).toString(16);
        
        // Preparar la transacción para transferir ETH nativo
        const transactionParams = {
          from: address, // Dirección del remitente (usuario conectado)
          to: toAddress, // Dirección del destinatario (contacto encontrado)
          value: amountInWei, // Cantidad en Wei
          gas: '0x5208', // Gas límite para transferencia simple de ETH (21000 en decimal)
        };
        
        console.log('📋 Parámetros de transacción:', transactionParams);
        setTransferStatus('pending'); // Establecer estado pendiente antes de enviar
        
        // Enviar la transacción usando el provider de la wallet
        const txHash = await walletProvider.request({
          method: 'eth_sendTransaction',
          params: [transactionParams]
        });
        
        console.log('✅ Transferencia exitosa! Hash:', txHash);
        setTransferStatus(`success_${txHash}`); // Establecer estado exitoso con hash de transacción
        
      } catch (error: any) {
        console.error('❌ Error en la transferencia:', error);
        setTransferStatus(`error_${error?.message || 'unknown_error'}`); // Establecer estado de error con mensaje
      }
    }, [isConnected, walletProvider, address]); // Dependencias del useCallback
    
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
        userId: 'navalue',
        connectionType: 'webrtc',
        clientTools:{actionHandler: async ({action,contact,token,token2,amount})=>{
          console.log("🟢 Acción recibida:", action, " Datos recibidos",contact,"|",amount,"|",token,"|",token2);
          
          // Validación de contacto en localStorage cuando se recibe un contacto del agente de voz
          if (contact) {
            // Buscar contacto por nombre en localStorage usando el módulo contactsStorage
            const foundContacts = contactsStorage.findContactsByName(contact);
            
            if (foundContacts.length > 0) {
              // Si se encuentra el contacto, tomar el primer resultado
              const foundContact = foundContacts[0];
              setContactCheck(true); // Establecer que el contacto existe
              setAddressContact(foundContact.address); // Guardar la dirección del contacto encontrado
              console.log("✅ Contacto encontrado:", foundContact.name, "- Dirección:", foundContact.address);
              
              // Ejecutar transferencia si la acción es "transfer" y se encontró el contacto
              if (action === 'transfer' && amount && token) {
                await executeTransfer(foundContact.address, amount, token);
              }
            } else {
              // Si no se encuentra el contacto, establecer valores por defecto
              setContactCheck(false); // Establecer que el contacto no existe
              setAddressContact(''); // Limpiar la dirección del contacto
              console.log("❌ Contacto no encontrado:", contact);
            }
          }
        }}, //uso de clientTools para obtener la acción (trasfer|exchange) que quiere usar el usuario a travez del agente de voz, el contacto y el token inicial como el final.
        dynamicVariables:{
            elevenlabs_Address:address || '',//Variable dinámica que se manda al agente de voz de elevenlabs (Address de la wallet).
            elevenlabs_Status:status || 'disconnected', //Variable dinámica que se manda al agente de voz de elevenlabs (Status de conexión de la wallet).
            elevenlabs_Wallet_Name:walletInfo?.name || 'Unknown', //Variable dinámica que se manda al agente de voz de elevenlabs (Con que wallet se conectó).
            elevenlabs_check_contact:contactCheck, //Variable dinámica que indica al agente de voz si el contacto existe en localStorage
            elevenlabs_transfer_status:transferStatus //Variable dinámica que indica al agente de voz el estado de la transferencia (initiating, pending, success_hash, error_message)
        }
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  }, [conversation, address, status, walletInfo, contactCheck, transferStatus]); //IMPORTANTE AGREGAR LAS VARIABLES DINÁMICAS QUE SE UTILIZARÁN PARA MANDAR AL AGENTE DE VOZ.

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
        {/* Sección para mostrar información de validación de contactos */}
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p><strong>Contact Check:</strong> {contactCheck ? 'Found' : 'Not Found'}</p>
          {/* Solo mostrar la dirección si el contacto fue encontrado */}
          {contactCheck && addressContact && (
            <p><strong>Contact Address:</strong> {addressContact}</p>
          )}
          {/* Mostrar el estado de la transferencia */}
          {transferStatus && (
            <p><strong>Transfer Status:</strong> {transferStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}