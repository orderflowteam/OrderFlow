(function () {
  const LOGO_URL = "faviconorderflow.png"; // <-- CAMBIA TU LOGO AQUÍ

  // Insertamos estilos
  const style = document.createElement("style");
  style.innerHTML = `
    #chatBubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: black;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 30px;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      transition: 0.3s;
      z-index: 9999;
    }
    #chatBubble:hover {
      transform: scale(1.1);
    }

    #chatWidget {
      position: fixed;
      bottom: 100px;
      right: 20px;
      width: 350px;
      height: 520px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid #ddd;
      box-shadow: 0 5px 35px rgba(0, 0, 0, 0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.35s ease forwards;
      z-index: 9999;
      font-family: system-ui, sans-serif;
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    #chatHeader {
      display: flex;
      align-items: center;
      gap: 10px;
      background: black;
      color: white;
      padding: 14px;
      font-size: 16px;
    }
    #chatHeader img {
      width: 32px;
      height: 32px;
      border-radius: 6px;
    }

    #chatMessages {
      flex: 1;
      padding: 12px;
      overflow-y: auto;
      background: #fafafa;
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
      align-self: flex-end;
    }
    .botMsg {
      background: #ececec;
      align-self: flex-start;
    }

    #chatInput {
      display: flex;
      gap: 8px;
      padding: 10px;
      border-top: 1px solid #eee;
      background: white;
    }
    #chatText {
      flex: 1;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid #ddd;
    }
    #chatSend {
      padding: 8px 14px;
      background: black;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  // Burbuja flotante
  const bubble = document.createElement("div");
  bubble.id = "chatBubble";
  bubble.innerHTML = "💬";
  document.body.appendChild(bubble);

  // Ventana del chat
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

  // Abrir / cerrar
  bubble.onclick = () => {
    widget.style.display = widget.style.display === "flex" ? "none" : "flex";

    // Mensaje inicial automático
    if (!window.initialMessageSent) {
      const msgBox = document.getElementById("chatMessages");
      msgBox.innerHTML += `<div class="msg botMsg">¡Hola! 👋 ¿En qué puedo ayudarte?</div>`;
      window.initialMessageSent = true;
    }
  };

  // Enviar mensajes
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
