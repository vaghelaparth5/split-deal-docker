// You can add this to your existing JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  // Current year for copyright
  const yearSpan = document.querySelector('.footer-bottom p');
  if (yearSpan) {
    yearSpan.innerHTML = yearSpan.innerHTML.replace('2025', new Date().getFullYear());
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('.footer-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});

function cardClicked(title) {
  alert(`You clicked on: ${title}`);
}
