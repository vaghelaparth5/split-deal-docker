// cypress/e2e/grouplisting_simple_tests.cy.js

describe('Group Listing Page - Simple E2E Tests with Updated URIs', () => {
  beforeEach(() => {
    // Intercept the API call and use the simpleDeals.json fixture
    // Make sure your simpleDeals.json in cypress/fixtures/ has the updated content
    cy.intercept('GET', '/api/group/get-groups', { fixture: 'simpleDeals.json' }).as('getDeals');

    // IMPORTANT: Adjust this URL to where your grouplisting.html is served.
    cy.visit('http://localhost:3000/views/grouplisting.html'); 

    cy.wait('@getDeals'); // Wait for the mocked API call to complete
  });

  // Test 1: Page Load and Essential Elements
  it('should load the page and display header, filters, and footer', () => {
    cy.get('.header .header__logo img').should('be.visible');
    cy.get('.header .header__nav').should('be.visible');
    cy.get('.filters #search').should('be.visible');
    cy.get('.filters #filter-location').should('be.visible');
    cy.get('.site-footer').should('be.visible');
  });

  // Test 2: Deals are Loaded and Displayed
  it('should load and display deal cards in the grid with updated info', () => {
    cy.get('#group-grid .card').should('have.length', 3); // Based on simpleDeals.json
    
    // Check the first deal (Nike)
    cy.get('#group-grid .card').first().within(() => {
      cy.get('h3').should('contain.text', 'Nike Air Max Shoes');
      cy.get('img').should('have.attr', 'src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp-Z5H8Lrp8q79zl6eN531tj0Jt9QmPcVaxg&s');
      cy.get('p').eq(0).should('contain.text', 'Online'); // storeLocation
      cy.get('p').eq(1).find('strong').should('contain.text', '25% OFF'); // discount (or however your groups.js displays it)
    });

    // Optionally, check another deal (e.g., Domino's)
    cy.get('#group-grid .card').eq(1).within(() => {
      cy.get('h3').should('contain.text', "Domino's Pizza Feast");
      cy.get('img').should('have.attr', 'src', 'https://logowik.com/content/uploads/images/dominos-pizza5190.jpg');
    });
  });

  // Test 3: Search Functionality
  it('should filter deals based on search input for new titles', () => {
    cy.get('#search').type('Nike Air');
    cy.get('#group-grid .card').should('have.length', 1);
    cy.get('#group-grid .card h3').should('contain.text', 'Nike Air Max Shoes');

    cy.get('#search').clear().type('Pizza');
    cy.get('#group-grid .card').should('have.length', 1);
    cy.get('#group-grid .card h3').should('contain.text', "Domino's Pizza Feast");

    cy.get('#search').clear().type('NonExistent');
    cy.get('#group-grid .card').should('have.length', 0);
  });

  // Test 4: Location Filter Functionality (remains largely the same, assuming locations are consistent)
  it('should filter deals based on location selection', () => {
    cy.get('#filter-location option[value="Online"]').should('exist');
    cy.get('#filter-location option[value="Downtown"]').should('exist');

    cy.get('#filter-location').select('Online');
    cy.get('#group-grid .card').should('have.length', 1);
    cy.get('#group-grid .card p').first().should('contain.text', 'Online');

    cy.get('#filter-location').select(''); // Select "All Locations"
    cy.get('#group-grid .card').should('have.length', 3); 
  });

  // Test 5: Modal Opens with Correct Deal Information
  it('should open the modal with correct updated deal info when "Join Group" is clicked', () => {
    cy.get('#group-grid .card button').first().click(); // Clicks on Nike deal

    cy.get('#modal').should('not.have.class', 'hidden').and('be.visible');
    cy.get('#modal-title').should('contain.text', 'Nike Air Max Shoes'); 
    cy.get('#modal-img').should('have.attr', 'src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp-Z5H8Lrp8q79zl6eN531tj0Jt9QmPcVaxg&s');
    cy.get('#modal-desc').should('contain.text', 'Latest Nike Air Max running shoes, perfect for athletes.');
    // Ensure your groups.js populates modal-price correctly based on 'discount' or 'price' field
    cy.get('#modal-price').should('contain.text', '25% OFF'); // Or how your groups.js formats it
  });

  // Test 6: Modal Closes When Close Button is Clicked
  it('should close the modal when the close button (×) is clicked', () => {
    cy.get('#group-grid .card button').first().click(); 
    cy.get('#modal').should('not.have.class', 'hidden');

    cy.get('#modal .close-btn').click();
    cy.get('#modal').should('have.class', 'hidden');
  });

});
