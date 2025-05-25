function loadFooter() {
  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '../css/footer.css';
  document.head.appendChild(link);
  
  // Load HTML
  fetch('../views/footer.html');
    then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html);
      
      // Load JS after HTML is inserted
      const script = document.createElement('script');
      script.src = '../js/footer.js';
      document.body.appendChild(script);
    });
}

// Call the function when needed
loadFooter();