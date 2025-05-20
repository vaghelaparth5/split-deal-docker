document.addEventListener('DOMContentLoaded', function () {
  const dealGrid = document.getElementById('dealGrid');
  const brandFilter = document.getElementById('brandFilter');
  const searchInput = document.getElementById('searchInput');
  const modal = document.getElementById('createDealModal');
  const dealTitleInput = document.getElementById('dealTitle');
  const createDealBtn = document.querySelector('.create-deal-btn');
  const closeModalBtn = document.querySelector('.close');

  function renderDeals(dealsToRender = window.deals) {
    dealGrid.innerHTML = '';
    dealsToRender.forEach((deal) => {
      const card = document.createElement('div');
      card.className = 'deal-card';
      card.textContent = `${deal.brand}: ${deal.title}`;
      dealGrid.appendChild(card);
    });
  }

  function filterDeals() {
    const brand = brandFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    const filtered = window.deals.filter((deal) => {
      const matchesBrand = brand === 'All' || deal.brand === brand;
      const matchesSearch =
        deal.title.toLowerCase().includes(searchTerm) ||
        deal.brand.toLowerCase().includes(searchTerm);
      return matchesBrand && matchesSearch;
    });

    renderDeals(filtered);
  }

  brandFilter.addEventListener('change', filterDeals);
  searchInput.addEventListener('input', filterDeals);

  createDealBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    dealTitleInput.value = createDealBtn.dataset.title || '';
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Initial render
  renderDeals();

  // Expose for tests
  window.renderDeals = renderDeals;
  window.filterDeals = filterDeals;
});
