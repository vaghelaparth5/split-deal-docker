
window.onload = function () {
    console.log("working");

    const socket = io(); // ONLY ONE socket instance

    // ✅ CONNECTION
    socket.on("connect", () => {
        console.log("✅ Connected to server:", socket.id);
    });

    // ✅ DEAL NOTIFICATION
    socket.on("new_deal", (data) => {
        console.log("🔥 [DEAL] new_deal received:", data);

        const popup = document.getElementById("deal-notification");
        const img = document.getElementById("deal-img");
        const title = document.getElementById("deal-title");
        const price = document.getElementById("deal-price");
        const location = document.getElementById("deal-location");
        const viewBtn = document.getElementById("view-deal-btn");
        const closeBtn = document.getElementById("close-notification");

        if (!popup || !img || !title || !price || !location || !viewBtn || !closeBtn) {
            console.warn("❌ Deal toast DOM elements missing");
            return;
        }

        // Set content from backend payload
        img.src = data.deal.image_url || "https://via.placeholder.com/60"; // fallback
        title.textContent = data.deal.title;
        price.textContent = `₹${data.deal.price} (was ₹${data.deal.original_price})`;
        location.textContent = data.deal.location ? `📍 ${data.deal.location}` : "";
        viewBtn.href = `/views/dealsDetails.html?id=${data.deal._id}`;

        popup.classList.add("show");

        const timer = setTimeout(() => {
            popup.classList.remove("show");
        }, 7000);

        closeBtn.onclick = () => {
            popup.classList.remove("show");
            clearTimeout(timer);
        };
    });


    // ✅ GROUP NOTIFICATION
    socket.on("new_group", (data) => {
        console.log("📥 [GROUP] new_group received:", data);

        const popup = document.getElementById("group-notification");
        const title = document.getElementById("group-title");
        const members = document.getElementById("group-members");
        const joinBtn = document.getElementById("join-group-btn");
        const closeBtn = document.getElementById("close-group");

        if (!popup || !title || !members || !joinBtn || !closeBtn) {
            console.warn("❌ Group DOM elements not found");
            return;
        }

        title.textContent = data.group.dealTitle;
        members.textContent = `Members required: ${data.group.membersRequired}`;
        joinBtn.href = `/views/groupDetails.html?id=${data.group._id}`;

        popup.classList.add("show");

        const timer = setTimeout(() => {
            popup.classList.remove("show");
        }, 7000);

        closeBtn.onclick = () => {
            popup.classList.remove("show");
            clearTimeout(timer);
        };
    });

    // ✅ DISCONNECT
    socket.on("disconnect", () => {
        console.log("❌ Disconnected from server");
    });
};
