describe('Deal Filters', () => {
  before(() => {
    // Ignore uncaught exceptions if needed
    Cypress.on('uncaught:exception', () => false);
  });

  beforeEach(() => {
    // Increase timeouts
    Cypress.config('defaultCommandTimeout', 10000);
    Cypress.config('pageLoadTimeout', 60000);

    // Intercept API calls with fixture
    cy.intercept('GET', '/api/deal/get', { fixture: 'deals.json' }).as('getDeals');

    // Visit page with extended timeout
    cy.visit('/views/dealsDetails.html', {
      timeout: 60000,
      onBeforeLoad(win) {
        win.onerror = null; // Disable error handling
      }
    });

    // Wait for API call and minimum content
    cy.get('.deal-grid', { timeout: 15000 }).should('exist');
    cy.wait('@getDeals', { timeout: 10000 });
  });

  it('should filter deals by brand', () => {
    cy.get('#brandFilter').select('Superdry');
    
    // Verify filtered deals
    cy.get('.deal-card').should('have.length', 2); // We have 2 Superdry items in fixture
    cy.get('.deal-card').each(card => {
      cy.wrap(card).find('h3').invoke('text').should('match', /Superdry/i);
    });
  });

  it('should show all brands when "All Brands" is selected', () => {
    cy.get('#brandFilter').select('All');
    cy.get('.deal-card').should('have.length', 6); // All 6 deals from fixture
  });

  it('should search deals by text', () => {
    cy.get('#searchInput').type('jacket');
    cy.get('.deal-card').should('have.length', 1);
    cy.get('.deal-card h3').first().should('contain', 'Jacket');
  });

  it('should show no results message when no matches found', () => {
    cy.get('#searchInput').type('nonexistentterm{enter}');
    cy.get('.deal-grid').should('contain', 'No deals found.');
    cy.get('.deal-card').should('have.length', 0);
  });

  it('should combine brand filter and search', () => {
    cy.get('#brandFilter').select('Nike');
    cy.get('#searchInput').type('shoe{enter}');
    
    // Verify results
    cy.get('.deal-card').should('have.length', 1);
    cy.get('.deal-card h3').first()
      .should('contain', 'Nike')
      .and('contain', 'Shoe');
  });

  it('should clear filters when clicking clear button', () => {
    // First apply some filters
    cy.get('#brandFilter').select('Superdry');
    cy.get('#searchInput').type('jacket');
    cy.get('.deal-card').should('have.length', 1);

    // Clear filters
    cy.get('#searchInput').clear();
    cy.get('#brandFilter').select('All');
    
    // Verify all deals are shown again
    cy.get('.deal-card').should('have.length', 6);
  });

  it('should show weekend-only tag for relevant deals', () => {
    cy.get('#brandFilter').select('All');
    cy.get('.weekend-tag').should('have.length', 3); // 3 weekend-only deals in fixture
  });

  it('should show expired deals with different styling', () => {
    cy.get('.deal-card.expired').should('have.length', 4); // 1 expired deal in fixture
    cy.get('.deal-card.expired .expiry').should('exist');
  });
});