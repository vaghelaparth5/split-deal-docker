document.addEventListener('DOMContentLoaded', function() {
  // Sample data - replace with your actual deals data
  const deals = [
    {
      image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Grocery Bundle',
      description: 'Save 30% on bulk grocery purchases'
    },
    {
      image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Office Supplies',
      description: 'Group discount on stationery items'
    },
    {
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Tech Gadgets',
      description: 'Latest electronics at wholesale prices'
    },
    {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      title: 'Restaurant Deal',
      description: 'Group dining with 25% discount'
    }
  ];

  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const pagination = document.querySelector('.swiper-pagination');
  const prevBtn = document.querySelector('.swiper-button-prev');
  const nextBtn = document.querySelector('.swiper-button-next');
  
  let currentIndex = 0;
  let slides = [];
  let dots = [];

  // Initialize swiper
  function initSwiper() {
    // Create slides
    deals.forEach((deal, index) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <img src="${deal.image}" alt="${deal.title}">
        <div class="swiper-slide-content">
          <h3>${deal.title}</h3>
          <p>${deal.description}</p>
        </div>
      `;
      swiperWrapper.appendChild(slide);
      slides.push(slide);

      // Create pagination dots
      const dot = document.createElement('div');
      dot.className = 'swiper-pagination-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      pagination.appendChild(dot);
      dots.push(dot);
    });

    // Set initial positions
    updateSwiper();
  }

  // Update swiper position
  function updateSwiper() {
    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update active dot
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateSwiper();
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSwiper();
  }

  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSwiper();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Auto-rotate (optional)
  let autoSlide = setInterval(nextSlide, 5000);
  
  // Pause auto-rotate on hover
  swiperWrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
  swiperWrapper.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
  });

  // Initialize
  initSwiper();
});