// profile.js (full updated version)
document.addEventListener('DOMContentLoaded', function() {
  // Authentication check
  const token = localStorage.getItem('authToken');
  if (!token) {
      window.location.href = '/views/login.html';
      return;
  }

  // Set username
  const userName = localStorage.getItem('userName');
  const profileNameElement = document.getElementById('profileName');
  if (userName && profileNameElement) {
      profileNameElement.textContent = userName;
  }

  // Tab functionality
  document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const tab = btn.getAttribute('data-tab');
          document.querySelectorAll('.tab-panel').forEach(panel => {
              panel.id === tab 
                  ? panel.classList.remove('hidden') 
                  : panel.classList.add('hidden');
          });
      });
  });
});