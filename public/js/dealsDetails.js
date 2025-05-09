const deals = [
  {
    brand: "Superdry",
    logo: "https://res.cloudinary.com/du5br7g8b/image/upload/v1743473069/dqp71qo4nv2a8wpmgta2.webp",
    title: "Superdry Winter Sale",
    location: "Convention Centre Pl, South Wharf",
    expiry: "April 25, 2025"
  },
  {
    brand: "Tommy Hilfiger",
    logo: "https://res.cloudinary.com/du5br7g8b/image/upload/v1742821088/e5sxqakk7aumxscyrvdz.png",
    title: "Buy 2 get 2 Hoodies Free",
    location: "Convention Centre Pl, South Wharf",
    expiry: "April 30, 2025"
  },
  {
    brand: "Zara",
    logo: "https://res.cloudinary.com/du5br7g8b/image/upload/v1742222953/hpukw5lmrnwijhoem2hb.webp",
    title: "Zara X Week",
    location: "Melbourne Bourke Street",
    expiry: "May 3, 2025"
  },
  {
    brand: "Nike",
    logo: "https://www.svgrepo.com/show/303173/nike-3-logo.svg",
    title: "Nike Air Max 20% Off + Free Shipping",
    location: "Melbourne Central",
    expiry: "May 10, 2025"
  },
  {
    brand: "Levi's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png",
    title: "Levi's Denim Discount - 25% Off",
    location: "Bourke Street Mall",
    expiry: "May 15, 2025"
  },
  {
    brand: "Levi's",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Levi%27s_logo.svg/2560px-Levi%27s_logo.svg.png",
    title: "Levi's Denim Discount - 25% Off",
    location: "Bourke Street Mall",
    expiry: "May 15, 2025"
  },
  {
    brand: "Nike",
    logo: "https://www.svgrepo.com/show/303173/nike-3-logo.svg",
    title: "Nike Air Max 20% Off + Free Shipping",
    location: "Melbourne Central",
    expiry: "May 10, 2025"
  },
  {
    brand: "Zara",
    logo: "https://res.cloudinary.com/du5br7g8b/image/upload/v1742222953/hpukw5lmrnwijhoem2hb.webp",
    title: "Zara X Week",
    location: "Melbourne Bourke Street",
    expiry: "May 3, 2025"
  },
  {
    brand: "Tommy Hilfiger",
    logo: "https://res.cloudinary.com/du5br7g8b/image/upload/v1742821088/e5sxqakk7aumxscyrvdz.png",
    title: "Buy 2 get 2 Hoodies Free",
    location: "Convention Centre Pl, South Wharf",
    expiry: "April 30, 2025"
  },
  
];

const dealGrid = document.getElementById('dealGrid');
const brandFilter = document.getElementById('brandFilter');
const searchInput = document.getElementById('searchInput');

function renderDeals(filteredDeals) {
  dealGrid.innerHTML = "";

  if (filteredDeals.length === 0) {
    dealGrid.innerHTML = "<p>No deals found.</p>";
    return;
  }

  filteredDeals.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.innerHTML = `
      <img src="${deal.logo}" alt="${deal.brand}" />
      <h3>${deal.title}</h3>
      <p>${deal.location}</p>
      <p><strong>Expiry:</strong> ${deal.expiry}</p>
      <button>Create Deal 🚀</button>
    `;
    dealGrid.appendChild(card);
  });
}

function applyFilters() {
  const selectedBrand = brandFilter.value.toLowerCase();
  const searchText = searchInput.value.toLowerCase();

  const filtered = deals.filter(deal => {
    const brandMatch = selectedBrand === "all" || deal.brand.toLowerCase() === selectedBrand;
    const textMatch =
      deal.brand.toLowerCase().includes(searchText) ||
      deal.title.toLowerCase().includes(searchText);
    return brandMatch && textMatch;
  });

  renderDeals(filtered);
}

// Initial render
renderDeals(deals);

// Event listeners
brandFilter.addEventListener('change', applyFilters);
searchInput.addEventListener('input', applyFilters);
