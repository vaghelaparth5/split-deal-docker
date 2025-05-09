let selectedGroup = null;

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("group-grid");

  fetch("https://splitdeal.onrender.com/api/group/get-groups")
    .then((res) => res.json())
    .then((groups) => {
      groups.forEach((group) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${group.dealLogo}" alt="${group.dealTitle}" />
          <h3 class="card-title">${group.dealTitle}</h3>
          <p class="card-price">$${group.totalValue}</p>
          <button>Join Me</button>
        `;
        card.querySelector("button").addEventListener("click", () => openModal(group));
        grid.appendChild(card);
      });
    })
    .catch((err) => {
      console.error("Error fetching groups:", err);
      grid.innerHTML = "<p>Failed to load group deals.</p>";
    });
});

function openModal(group) {
  selectedGroup = group;
  document.getElementById("modal-title").innerText = group.dealTitle;
  document.getElementById("modal-img").src = group.dealLogo;
  document.getElementById("modal-desc").innerText =
    group.dealDescription || "No description available.";
  document.getElementById("modal-price").innerText = `Price: $${group.totalValue}`;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  selectedGroup = null;
  document.getElementById("modal").classList.add("hidden");
}

function confirmJoin() {
  if (selectedGroup) {
    alert(`You joined the group for ${selectedGroup.dealTitle}`);
    closeModal();
  }
}
