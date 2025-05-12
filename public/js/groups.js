const deals = [
    {
      title: "DUSA",
      image: "../images/dusa.jpeg",
      discount: "5%",
      required: 2,
      location: "Burwood, Melbourne",
      description: "DUSA Group Deal",
      deadline: "Sat, May 31, 2025"
    },
    {
      title: "Tommy Hilfiger",
      image: "../images/tommy.png",
      discount: "30%",
      required: 4,
      location: "Convention Centre Pl, South Wharf",
      description: "Buy 2 get 2 Hoodies Free",
      deadline: "Wed, Apr 30, 2025"
    },
    {
      title: "ZARA",
      image: "../images/zara.png",
      discount: "40%",
      required: 3,
      location: "Melbourne Bourke Street",
      description: "Zara X Week",
      deadline: "Sat, May 3, 2025"
    },
    {
      title: "The North Face",
      image: "../images/tnf.png",
      discount: "30%",
      required: 3,
      location: "Chadstone, Melbourne",
      description: "TNF Group Deal",
      deadline: "Sat, May 17, 2025"
    },
    {
      title: "Adidas",
      image: "../images/adidas.png",
      discount: "35%",
      required: 5,
      location: "Clayton, Melbourne",
      description: "Adidas Boost Offer - 35% Off on $750+",
      deadline: "Wed, May 21, 2025"
    },
    {
      title: "Levi's",
      image: "../images/levis.jpg",
      discount: "25%",
      required: 2,
      location: "Bourke Street Mall, Melbourne",
      description: "Levis Denim Discount - 25% Off on $500+",
      deadline: "Wed, May 21, 2025"
    }
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("group-grid");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modal-title");
    const modalImg = document.getElementById("modal-img");
    const modalDesc = document.getElementById("modal-desc");
    const modalPrice = document.getElementById("modal-price");
    const closeBtn = document.getElementById("close-btn");
    const confirmBtn = document.getElementById("confirm-btn");
  
    deals.forEach((deal, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${deal.image}" alt="${deal.title}" />
        <div class="card-title">${deal.title}</div>
        <div class="card-price">${deal.discount}</div>
        <p><strong>Required:</strong> ${deal.required}</p>
        <p>${deal.location}</p>
        <p><strong>Until - </strong><span style="color:red">${deal.deadline}</span></p>
        <button data-index="${index}">Join Group</button>
      `;
      grid.appendChild(card);
    });
  
    grid.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const deal = deals[e.target.getAttribute("data-index")];
        modalTitle.textContent = deal.title;
        modalImg.src = deal.image;
        modalDesc.textContent = deal.description;
        modalPrice.textContent = `${deal.discount} | Required: ${deal.required}`;
        modal.classList.remove("hidden");
      }
    });
  
    closeBtn.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  
    confirmBtn.addEventListener("click", () => {
      alert("You have joined the group!");
      modal.classList.add("hidden");
    });
  });
  