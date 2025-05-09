const deals = [
  {
    brand: "Superdry",
    logo: "/images/superdry.png",
    title: "Superdry Winter Sale",
    location: "Convention Centre Pl, South Wharf",
    expiry: "April 25, 2025"
  },
  {
    brand: "Tommy Hilfiger",
    logo: "/images/tommy.png",
    title: "Buy 2 get 2 Hoodies Free",
    location: "Convention Centre Pl, South Wharf",
    expiry: "April 30, 2025"
  },
  {
    brand: "Zara",
    logo: "/images/zara.png",
    title: "Zara X Week",
    location: "Melbourne Bourke Street",
    expiry: "May 3, 2025"
  },
  {
    brand: "Nike",
    logo: "/images/nike.png",
    title: "Nike Air Max 20% Off + Free Shipping",
    location: "Melbourne Central",
    expiry: "May 10, 2025"
  },
  {
    brand: "Levi's",
    logo: "/images/levis.png",
    title: "Levi's Denim Discount - 25% Off",
    location: "Bourke Street Mall",
    expiry: "May 15, 2025"
  }
];

const dealGrid = document.getElementById('dealGrid');

deals.forEach(deal => {
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
