describe('Deals Page', () => {
  before(() => {
    // Start your server if needed
    // cy.exec('npm start');
  });

  beforeEach(() => {
    // Increase timeouts
    Cypress.config('defaultCommandTimeout', 10000);
    Cypress.config('pageLoadTimeout', 120000);

    // Ignore uncaught exceptions
    Cypress.on('uncaught:exception', () => false);

    // Intercept API calls
    cy.intercept('GET', '/api/deal/get', { fixture: 'deals.json' }).as('getDeals');

    // Visit page with extended timeout
    cy.visit('/views/dealsDetails.html', {
      timeout: 120000,
      onBeforeLoad(win) {
        win.onerror = null; // Disable error handling
      }
    });

    // Wait for API call or minimum content
    cy.get('.deal-grid', { timeout: 30000 }).should('exist');
  });

  it('should load the deals page successfully', () => {
    cy.get('.deal-title').should('contain', 'Deal Details');
    cy.get('.deal-subtitle').should('contain', 'Create groups and manage your deal');
  });

  it('should display the navigation bar correctly', () => {
    cy.get('.header__logo img').should('have.attr', 'src', '../images/split-deal-logo.png');
    cy.get('.header__elenco li').should('have.length.at.least', 4);
    cy.get('.header__el a[href="/index.html"]').should('contain', 'Home');
    cy.get('.header__el a[href="/views/dealsDetails.html"]').should('contain', 'Deals');
  });

  it('should load and display deals from the API', () => {
    cy.wait('@getDeals');
    cy.get('.deal-card').should('have.length.greaterThan', 0);
  });

  it('should display deal cards with correct information', () => {
    cy.wait('@getDeals');
    cy.get('.deal-card').first().within(() => {
      cy.get('h3').should('exist');
      cy.get('.price').should('exist');
      cy.get('.original-price').should('exist');
      cy.get('.expiry').should('exist');
      cy.get('.create-deal-btn').should('contain', 'Create Group');
    });
  });

  it('should show expired deals with appropriate styling', () => {
    cy.wait('@getDeals');
    // Assuming the fixture has at least one expired deal
    cy.get('.deal-card.expired').should('exist');
  });
});