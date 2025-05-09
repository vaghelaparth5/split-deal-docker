// Example: Fetching deal data based on ID (can be connected to a backend later)
document.addEventListener('DOMContentLoaded', () => {
    const dealId = window.location.pathname.split("/").pop();
    console.log(`Fetching details for deal ID: ${dealId}`);
    
    // You could fetch data from an API here and update DOM
    // fetch(`/api/deal/${dealId}`).then(...)
  });
  