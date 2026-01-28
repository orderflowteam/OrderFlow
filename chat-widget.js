(function () {
  const LOGO_URL = "https://orderflowteam.github.io/OrderFlow/favicon_orderflow_logo_blanco-removebg-preview.png";

  // Estilos principales
  const style = document.createElement("style");
  style.innerHTML = `
  
/* Soluciona texto invertido */
#chatMessages, #chatText {
  direction: ltr !important;
  unicode-bidi: plaintext !important;
}

/* =========================== */
/*   🔥 BARRA FLOTANTE NUEVA   */
/* =========================== */
#chatBubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #000;
  border-radius: 25px; /* Mitad de 50px para círculo perfecto */
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 50px;
  height: 50px;
  overflow: hidden;
  padding: 0; /* Centrado perfecto sin padding inicial */
}

#chatBubble:hover {
  width: auto;
  padding: 0 20px;
  border-radius: 40px;
  gap: 10px;
}

#chatBubble svg {
  min-width: 24px;
  min-height: 24px;
  flex-shrink: 0;
}

#chatBubble span {
  opacity: 0;
  max-width: 0;
  transition: all 0.3s ease;
  display: inline-block;
  overflow: hidden;
}

#chatBubble:hover span {
  opacity: 1;
  max-width: 200px;
}

/* bolita animada */
#chatBubble .mini {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  display: inline-block;
  animation: pop 1.5s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pop {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

/* =========================== */
/*           WIDGET            */
/* =========================== */

#chatWidget {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 350px;
  max-width: 90%;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #ddd;
  box-shadow: 0 5px 35px rgba(0,0,0,0.2);
  display: none;
  flex-direction: column;
  overflow: hidden;
  font-family: system-ui, sans-serif;
  z-index: 9999;
}

/* Cabecera negra */
#chatHeader {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #000;
  color: white;
  padding: 14px;
  font-size: 16px;
}

#chatHeader img {
  width: 32px;
  height: 32px;
  border-radius: 6px;
}

/* Área de mensajes */
#chatMessages {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  color: #333;
  background: #fff;
}

.msg {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 80%;
  line-height: 1.4;
}

.userMsg {
  background: #ddd;
  color: #000;
  align-self: flex-end;
}

.botMsg {
  background: #f0f0f0;
  color: #000;
  align-self: flex-start;
}

/* =========================== */
/*    Input de escribir        */
/* =========================== */

#chatInput {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #ccc;
  background: #fff;
}

#chatText {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #f9f9f9;
  color: #000;
  font-size: 14px;
}

#chatText::placeholder {
  color: #aaa;
}

#chatSend {
  padding: 12px;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  flex-shrink: 0;
}

/* =========================== */
/*        RESPONSIVE MOBILE    */
/* =========================== */

@media (max-width: 480px) {
  #chatWidget {
    width: 95%;
    height: 450px;
    bottom: 80px;
  }

  #chatText {
    font-size: 18px;
    padding: 14px;
    flex: 3; /* input ocupa más */
  }

  #chatSend {
    flex: 1;
    font-size: 16px;
    padding: 14px;
  }
}

  `;
  document.head.appendChild(style);

  // ===========================
  //     BURBUJA FLOTANTE
  // ===========================
  const bubble = document.createElement("div");
  bubble.id = "chatBubble";
  bubble.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>Pregúntame cualquier duda</span>
  `;
  document.body.appendChild(bubble);

  // ===========================
  //       WIDGET DEL CHAT
  // ===========================
  const widget = document.createElement("div");
  widget.id = "chatWidget";
  widget.innerHTML = `
    <div id="chatHeader">
      <img src="${LOGO_URL}" />
      <b>Asistente IA</b>
    </div>
    <div id="chatMessages"></div>
    <div id="chatInput">
      <input id="chatText" placeholder="Escribe aquí..." />
      <button id="chatSend">Enviar</button>
    </div>
  `;
  document.body.appendChild(widget);

  // Expandir/ocultar chat
  bubble.onclick = () => {
    widget.style.display = widget.style.display === "flex" ? "none" : "flex";
    if (!window.initialMessageSent) {
      document.getElementById("chatMessages").innerHTML +=
        `<div class="msg botMsg">¡Hola! 👋 ¿En qué puedo ayudarte?</div>`;
      window.initialMessageSent = true;
    }
  };

  // Enviar mensaje
  async function sendMessage() {
    const text = document.getElementById("chatText").value.trim();
    if (!text) return;

    const msgBox = document.getElementById("chatMessages");
    msgBox.innerHTML += `<div class="msg userMsg">${text}</div>`;
    document.getElementById("chatText").value = "";
    msgBox.scrollTop = msgBox.scrollHeight;

    try {
      const res = await fetch(window.CHATBOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();
      console.log("Chatbot response:", data);

      let botReply = "";

      // Manejar diferentes formatos de respuesta (n8n, OpenAI, etc.)
      if (typeof data === 'string') {
        botReply = data;
      } else if (Array.isArray(data) && data.length > 0) {
        botReply = data[0].output || data[0].reply || data[0].text || JSON.stringify(data[0]);
      } else if (typeof data === 'object' && data !== null) {
        botReply = data.output || data.reply || data.text || data.message || JSON.stringify(data);
      } else {
        botReply = "Lo siento, hubo un error al procesar la respuesta.";
      }

      msgBox.innerHTML += `<div class="msg botMsg">${botReply}</div>`;
    } catch (err) {
      console.error("Error fetching chatbot response:", err);
      msgBox.innerHTML += `<div class="msg botMsg">Error: No se pudo conectar con el agente. Asegúrate de que el webhook esté activo.</div>`;
    }

    msgBox.scrollTop = msgBox.scrollHeight;
  }

  document.getElementById("chatSend").onclick = sendMessage;

})();
