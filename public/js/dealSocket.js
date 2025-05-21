window.onload = function () {
  // ✅ This runs only after the DOM is ready
  const log = (msg) => {
    const output = document.getElementById("debug-output");
    if (!output) return console.log(msg); // fallback
    const line = document.createElement("div");
    line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    console.log(msg);
  };

  if (typeof io !== "undefined") {
    const socket = io();

    socket.on("connect", () => {
      log("✅ Connected to server: " + socket.id);
    });

    socket.on("disconnect", () => {
      log("❌ Disconnected from server");
    });
``
    socket.on("new_deal", (data) => {
      log("🔥 Received new_deal: \n" + data.deal.title);

      const popup = document.getElementById("deal-notification");
      const message = document.getElementById("notification-message");
      const closeBtn = document.getElementById("close-notification");

      if (!popup || !message || !closeBtn) {
        log("❌ Notification elements missing");
        return;
      }

      message.textContent = `${data.msg}: ${data.deal.title}`;
      popup.classList.add("show");

      const timer = setTimeout(() => {
        popup.classList.remove("show");
      }, 5000);

      closeBtn.onclick = () => {
        popup.classList.remove("show");
        clearTimeout(timer);
      };
    });
  } else {
    log("❌ socket.io script not loaded");
  }
};
