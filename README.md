# Goyo - Crypto Voice Assistant

Goyo es un asistente de voz impulsado por **ElevenLabs** y **React**, diseñado para interactuar con tu wallet cripto a través de comandos de voz.  
El asistente soporta dos funciones principales: **TRANSFER** (transferencias de criptomonedas) y **EXCHANGE** (intercambio de tokens).  

---

## 🚀 Instalación

1. Clonar el repositorio y navegar al directorio del proyecto **Goyo**.

2. Instalar dependencias:
   ```bash
   npm install @elevenlabs/react
   npm install

3. Crear un archivo .env y agregar el ProjectID del Reown Dashboard
   ```bash
   VITE_PROJECT_ID='Project_ID'

4. En el archivo \src\conversation.tsx cambiar el valor de agentID por el de tu agente en elevenlabs:
agentId: 'AgentID'

5. Ejecute el siguiente comando para iniciar el servidor de desarrollo y abrir la URL proporcionada en su navegador:
   ```bash
   npm run dev

6. Antes Configura tu agente de voz en elevenlabs.

Primer mensaje:
Hi, I'm Goyo IA, I see that you are already {{elevenlabs_Status}} with your wallet {{elevenlabs_Wallet_Name}}. 

Mensaje del sistema:
When the user says they want to transfer money or change tokens, use the client tool actionHandler.

Valor de variables dinámicas:
elevenlabs_Status-desconnected
elevenlabs_Wallet_Name-Walletconnect

Agregar un cliente:
Nombre-actionHandler
Descripción
You are a crypto wallet assistant specialized in two main services:
1. **TRANSFER**: For sending cryptocurrency, transfers, or sending funds
2. **EXCHANGE**: For currency exchange, swaps, or token conversion
Available user wallet information:
- Address: {{elevenlabs_Address}}
- Status: {{elevenlabs_Status}}
- Wallet: {{elevenlabs_Wallet_Name}}
IMPORTANT INSTRUCTIONS:
- When the user mentions "transfer," "send," "send money," or similar → use actionHandler with action: "transfer"
- When they mention "exchange," "swap," "exchange," "convert," or similar → use actionHandler with action: "exchange"
Examples:
- "Help me transfer something" → actionHandler(action: "transfer")
- "I want to exchange my tokens" → actionHandler(action: "exchange")
- "I need to send crypto" → actionHandler(action: "transfer")

Parámetros
Tipo de datos-String
Identificador-action
Requerido
Tipo de valor-LLM Promt
Descripción-Agregar la misma de arriba

