(function () {
  const LOGO_URL = "/faviconorderflow.png"; // usa tu favicon o cambia por otra URL

  // Estilos principales
  const style = document.createElement("style");
  style.innerHTML = `
    /* Burbuja flotante azul marino con animación */
    #chatBubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: #001f4d; /* azul marino */
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      animation: bounce 1.5s infinite;
      z-index: 9999;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    #chatBubble::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      bottom: -10px;
      left: 20px;
      opacity: 0.6;
      animation: bubblePop 2s infinite;
    }
    @keyframes bubblePop {
      0% { transform: translateY(0) scale(1); opacity: 0.6; }
      50% { transform: translateY(-15px) scale(1.3); opacity: 0.3; }
      100% { transform: translateY(0) scale(1); opacity: 0.6; }
    }

    /* Widget de chat */
    #chatWidget {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      max-width: 90%;
      height: 520px;
      background: #000; /* área de mensajes negra */
      border-radius: 16px;
      border: 1px solid #ddd;
      box-shadow: 0 5px 35px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: system-ui, sans-serif;
      z-index: 9999;
    }

    /* Cabecera blanca */
    #chatHeader {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #fff;
      color: black;
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
      color: white;
    }
    .msg {
      margin-bottom: 12px;
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      line-height: 1.4;
    }
    .userMsg {
      background: #d9f7ff;
      color: #000;
      align-self: flex-end;
    }
    .botMsg {
      background: #222;
      color: #fff;
      align-self: flex-start;
    }

    /* Campo de texto + botón */
    #chatInput {
      display: flex;
      gap: 8px;
      padding: 10px;
      border-top: 1px solid #eee;
      background: #111;
    }
    #chatText {
      flex: 1;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid #444;
      background: #222;
      color: #fff;
      font-size: 14px;
    }
    #chatText::placeholder {
      color: #bbb;
    }
    #chatSend {
      padding: 8px 14px;
      background: #001f4d; /* azul marino */
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
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

  // Abrir / cerrar widget
  bubble.onclick = () => {
    widget.style.display = widget.style.display === "flex" ? "none" : "flex";

    if (!window.initialMessageSent) {
      const msgBox = document.getElementById("chatMessages");
      msgBox.innerHTML += `<div class="msg botMsg">¡Hola! 👋 ¿En qué puedo ayudarte?</div>`;
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
