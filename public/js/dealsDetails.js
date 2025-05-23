let deals = []; // Will be populated from API

const dealGrid = document.getElementById("dealGrid");
const brandFilter = document.getElementById("brandFilter");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("createDealModal");
const closeBtn = document.querySelector(".close");
const dealForm = document.getElementById("dealForm");

// Update the openGroupModal function
function openModal(dealData) {
  // Clear any existing values
  document.getElementById("groupForm").reset();

  // If we're creating a group from an existing deal, pre-fill some fields
  if (dealData) {
    document.getElementById("dealTitle").value = dealData.title || "";
    document.getElementById("price").value = dealData.price || "";
    document.getElementById("original_price").value =
      dealData.original_price || "";
    document.getElementById("deadline").value = dealData.deadline
      ? new Date(dealData.deadline).toISOString().slice(0, 16)
      : "";
    document.getElementById("max_participants").value =
      dealData.max_participants || 5;
  }

  modal.style.display = "block";

  // Update the form submission handler
if (document.getElementById("groupForm")) {
  document.getElementById("groupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      title: document.getElementById("groupTitle").value,
      description: document.getElementById("groupDescription").value,
      dealTitle: document.getElementById("dealTitle").value,
      price: parseFloat(document.getElementById("price").value),
      original_price: parseFloat(
        document.getElementById("original_price").value
      ),
      deadline: document.getElementById("deadline").value,
      max_participants: parseInt(
        document.getElementById("max_participants").value
      ),
    };

    console.log("Form Data:", formData);

    try {
      const response = await fetch("http://localhost:3000/api/deal/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        closeModal();
        alert("Group created successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message || "Failed to create group");
        alert(
          "Failed to create group: " + (errorData.message || "Please try again")
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network error. Please try again.");
    }
  });
}
}



// Function to close modal
function closeModal() {
  modal.style.display = "none";
  // formData.reset();
}

// Event listeners for modal
if (closeBtn) {
  closeBtn.addEventListener("click", closeModal);
}

if (modal) {
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}


function renderDeals(filteredDeals) {
  if (!dealGrid) return;

  dealGrid.innerHTML = "";

  if (filteredDeals.length === 0) {
    dealGrid.innerHTML = "<p>No deals found.</p>";
    return;
  }

  filteredDeals.forEach((deal) => {
    const card = document.createElement("div");
    card.className = "deal-card";
    card.innerHTML = `
      <img src="${deal.image_url || "https://via.placeholder.com/150"}" alt="${
      deal.title
    }" />
      <h3>${deal.title}</h3>
      <p>${deal.description || ""}</p>
      <p>${deal.location || "Location not specified"}</p>
      <p><strong>Price:</strong> $${deal.price} <s>$${
      deal.original_price
    }</s></p>
      <p><strong>Expiry:</strong> ${new Date(
        deal.deadline
      ).toLocaleDateString()}</p>
      <button class="create-deal-btn">Create Group 🚀</button>
    `;
    dealGrid.appendChild(card);

    const button = card.querySelector(".create-deal-btn");
    button.addEventListener("click", () => openModal(deal));
  });
}

function applyFilters() {
  const selectedBrand = brandFilter ? brandFilter.value.toLowerCase() : "all";
  const searchText = searchInput ? searchInput.value.toLowerCase() : "";

  const filtered = deals.filter((deal) => {
    const brandMatch =
      selectedBrand === "all" ||
      (deal.brand && deal.brand.toLowerCase().includes(selectedBrand)) ||
      (deal.title && deal.title.toLowerCase().includes(selectedBrand));

    const textMatch =
      searchText === "" ||
      (deal.title && deal.title.toLowerCase().includes(searchText)) ||
      (deal.description &&
        deal.description.toLowerCase().includes(searchText)) ||
      (deal.category && deal.category.toLowerCase().includes(searchText));

    return brandMatch && textMatch;
  });

  renderDeals(filtered);
}

async function fetchDeals() {
  try {
    const response = await fetch("http://localhost:3000/api/deal/get");
    const data = await response.json();
    deals = data.deals || [];
    applyFilters(); // Apply current filters after fetching
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    if (dealGrid) {
      dealGrid.innerHTML = "<p>Error loading deals.</p>";
    }
  }
}

// Initialize event listeners
if (brandFilter && searchInput) {
  brandFilter.addEventListener("change", applyFilters);
  searchInput.addEventListener("input", applyFilters);

  // Initial fetch
  fetchDeals();
}

// math.js
function add(a, b) {
  return a + b;
}

module.exports = {
  deals,
  openModal,
  closeModal,
  dealForm, // Exporting elements initialized at top level
  dealGrid,
  brandFilter,
  searchInput,
  modal,
  closeBtn,
  renderDeals,
  applyFilters,
  fetchDeals,
  add, // If you keep this function
};
