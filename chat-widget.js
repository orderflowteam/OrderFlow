(function () {
  const LOGO_URL = "https://orderflowteam.github.io/OrderFlow/favicon_orderflow_logo_blanco-removebg-preview.png";

  // Estilos principales
  const style = document.createElement("style");
  style.innerHTML = `
    /* Burbuja flotante negra con animación de chat */
    #chatBubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #000;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce 1.5s infinite;
      z-index: 9999;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    #chatBubble::after {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      background: #001f4d;
      border-radius: 50%;
      bottom: 5px;
      right: 5px;
      box-shadow: 0 0 5px #fff;
      animation: pop 1.5s infinite;
    }
    @keyframes pop {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }

    /* Widget de chat */
    #chatWidget {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      max-width: 90%;
      height: 520px;
      background: #fff; /* fondo de mensajes blanco */
      border-radius: 16px;
      border: 1px solid #ddd;
      box-shadow: 0 5px 35px rgba(0, 0, 0, 0.2);
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
      color: #333; /* gris para mensajes */
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
      background: #ddd; /* gris más claro */
      color: #000;
      align-self: flex-end;
    }
    .botMsg {
      background: #f0f0f0; /* gris para bot */
      color: #000;
      align-self: flex-start;
    }

    /* Campo de texto + botón */
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
    #chatText::placeholder { color: #aaa; }
    #chatSend {
      padding: 12px;
      background: #000; /* negro */
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      flex-shrink: 0;
    }

    /* Responsivo móvil */
    @media (max-width: 480px) {
      #chatWidget {
        width: 95%;
        height: 450px;
        bottom: 80px;
      }
      #chatText {
        font-size: 16px;
      }
      #chatSend {
        font-size: 16px;
      }
    }
  `;
  document.head.appendChild(style);

  // Burbuja flotante
  const bubble = document.createElement("div");
  bubble.id = "chatBubble";
  document.body.appendChild(bubble);

  // Widget de chat
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

  bubble.onclick = () => {
    widget.style.display = widget.style.display === "flex" ? "none" : "flex";
    if (!window.initialMessageSent) {
      document.getElementById("chatMessages").innerHTML += 
        `<div class="msg botMsg">¡Hola! 👋 ¿En qué puedo ayudarte?</div>`;
      window.initialMessageSent = true;
    }
  };

  async function sendMessage() {
    const text = document.getElementById("chatText").value.trim();
    if (!text) return;
    const msgBox = document.getElementById("chatMessages");
    msgBox.innerHTML += `<div class="msg userMsg">${text}</div>`;
    document.getElementById("chatText").value = "";
    msgBox.scrollTop = msgBox.scrollHeight;

    const res = await fetch(window.CHATBOT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await res.json();
    msgBox.innerHTML += `<div class="msg botMsg">${data.reply}</div>`;
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  document.getElementById("chatSend").onclick = sendMessage;
})();
