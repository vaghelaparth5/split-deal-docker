document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("group-grid");
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImg = document.getElementById("modal-img");
  const modalDesc = document.getElementById("modal-desc");
  const modalPrice = document.getElementById("modal-price");
  const modalDeadline = document.getElementById("modal-deadline");
  const closeBtn = document.getElementById("close-btn");
  const joinBtn = document.getElementById("join-btn");
  const searchInput = document.getElementById("search");
  const filterLocation = document.getElementById("filter-location");

  let deals = [];
  let selectedDeal = null;

  async function fetchDeals() {
    const res = await fetch("/api/group/get-groups");
    deals = await res.json();
    renderDeals(deals);
    populateLocationFilter(deals);
  }

  function renderDeals(dealList) {
    grid.innerHTML = "";
    dealList.forEach((deal) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${deal.dealLogo}" alt="${deal.dealTitle}" />
        <h3>${deal.dealTitle}</h3>
        <p>${deal.storeLocation}</p>
        <p><strong>${deal.discount}</strong></p>
        <button data-id="${deal.dealId}">Join Group</button>
      `;
      card.querySelector("button").addEventListener("click", () => openModal(deal));
      grid.appendChild(card);
    });
  }

  function openModal(deal) {
    selectedDeal = deal;
    modalTitle.textContent = deal.dealTitle;
    modalImg.src = deal.dealLogo;
    modalDesc.textContent = deal.dealDescription;
    modalPrice.textContent = `Discount: ${deal.discount}`;
    modalDeadline.textContent = `Expires: ${new Date(deal.expiryDate).toLocaleDateString()}`;
    modal.classList.remove("hidden");
  }

  closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  joinBtn.addEventListener("click", async () => {
    if (!selectedDeal) return;

    try {
      const res = await fetch(`/api/group/join-group/${selectedDeal.dealId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        alert("Successfully joined the group!");
      } else {
        alert(result.msg);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while joining the group.");
    }

    modal.classList.add("hidden");
  });

  function populateLocationFilter(deals) {
    const locations = [...new Set(deals.map(d => d.storeLocation))];
    locations.forEach(loc => {
      const opt = document.createElement("option");
      opt.value = loc;
      opt.textContent = loc;
      filterLocation.appendChild(opt);
    });
  }

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = deals.filter(d => d.dealTitle.toLowerCase().includes(searchTerm));
    renderDeals(filtered);
  });

  filterLocation.addEventListener("change", () => {
    const location = filterLocation.value;
    const filtered = location ? deals.filter(d => d.storeLocation === location) : deals;
    renderDeals(filtered);
  });

  await fetchDeals();
});
