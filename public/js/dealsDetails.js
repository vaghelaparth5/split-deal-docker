let deals = []; // Will be populated from API

const dealGrid = document.getElementById('dealGrid');
const brandFilter = document.getElementById('brandFilter');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('createDealModal');
const closeBtn = document.querySelector('.close');
const dealForm = document.getElementById('dealForm');

// Function to open modal with deal data
function openModal(dealData) {
  if (dealData) {
    document.getElementById('dealTitle').value = dealData.title || '';
    document.getElementById('dealDescription').value = dealData.description || '';
    document.getElementById('dealLocation').value = dealData.location || '';
    document.getElementById('dealPrice').value = dealData.price || '';
    document.getElementById('dealOriginalPrice').value = dealData.original_price || '';
    document.getElementById('dealMaxParticipants').value = dealData.max_participants || '';
    document.getElementById('dealCategory').value = dealData.category || '';
    document.getElementById('dealImage').value = dealData.image_url || '';

    const deadline = dealData.deadline ? new Date(dealData.deadline) : new Date();
    document.getElementById('dealDeadline').value = deadline.toISOString().slice(0, 16);
  }
  modal.style.display = 'block';
}

// Function to close modal
function closeModal() {
  modal.style.display = 'none';
  dealForm.reset();
}

// Event listeners for modal
if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

if (modal) {
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

// Handle form submission
if (dealForm) {
  dealForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      title: document.getElementById('dealTitle').value,
      description: document.getElementById('dealDescription').value,
      price: parseFloat(document.getElementById('dealPrice').value),
      original_price: parseFloat(document.getElementById('dealOriginalPrice').value),
      deadline: document.getElementById('dealDeadline').value,
      location: document.getElementById('dealLocation').value,
      max_participants: parseInt(document.getElementById('dealMaxParticipants').value),
      category: document.getElementById('dealCategory').value,
      image_url: document.getElementById('dealImage').value
    };

    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        closeModal();
        await fetchDeals(); // Refresh the deals list
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.message || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Error:', error);
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

  filteredDeals.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.innerHTML = `
      <img src="${deal.image_url || 'https://via.placeholder.com/150'}" alt="${deal.title}" />
      <h3>${deal.title}</h3>
      <p>${deal.description || ''}</p>
      <p>${deal.location || 'Location not specified'}</p>
      <p><strong>Price:</strong> $${deal.price} <s>$${deal.original_price}</s></p>
      <p><strong>Expiry:</strong> ${new Date(deal.deadline).toLocaleDateString()}</p>
      <button class="create-deal-btn">Create Group 🚀</button>
    `;
    dealGrid.appendChild(card);

    const button = card.querySelector('.create-deal-btn');
    button.addEventListener('click', () => openModal(deal));
  });
}

function applyFilters() {
  const selectedBrand = brandFilter ? brandFilter.value.toLowerCase() : 'all';
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';

  const filtered = deals.filter(deal => {
    const brandMatch = selectedBrand === "all" || 
      (deal.brand && deal.brand.toLowerCase().includes(selectedBrand)) ||
      (deal.title && deal.title.toLowerCase().includes(selectedBrand));
      
    const textMatch = searchText === '' || 
      (deal.title && deal.title.toLowerCase().includes(searchText)) ||
      (deal.description && deal.description.toLowerCase().includes(searchText)) ||
      (deal.category && deal.category.toLowerCase().includes(searchText));
      
    return brandMatch && textMatch;
  });

  renderDeals(filtered);
}

async function fetchDeals() {
  try {
    const response = await fetch('http://localhost:3000/api/deal/get');
    const data = await response.json();
    deals = data.deals || [];
    applyFilters(); // Apply current filters after fetching
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    if (dealGrid) {
      dealGrid.innerHTML = "<p>Error loading deals.</p>";
    }
  }
}

// Initialize event listeners
if (brandFilter && searchInput) {
  brandFilter.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', applyFilters);
  
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
  add // If you keep this function
};