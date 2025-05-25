describe('Notifications', () => {
  before(() => {
    // Ignore uncaught exceptions
    Cypress.on('uncaught:exception', () => false);
  });

  beforeEach(() => {
    // Increase timeouts
    Cypress.config('defaultCommandTimeout', 10000);
    Cypress.config('pageLoadTimeout', 60000);

    // Intercept API calls
    cy.intercept('GET', '/api/deal/get', { fixture: 'deals.json' }).as('getDeals');
    cy.intercept('POST', '/api/group/create-group', {
      statusCode: 201,
      body: { success: true } // Removed groupId as requested
    }).as('createGroup');

    // Visit page with extended timeout
    cy.visit('/views/dealsDetails.html', {
      timeout: 60000,
      onBeforeLoad(win) {
        win.onerror = null; // Disable error handling
      }
    });

    // Wait for content to load
    cy.get('.deal-grid', { timeout: 15000 }).should('exist');
    cy.wait('@getDeals', { timeout: 10000 });
  });

  it('should show group creation notification after successful creation', () => {
    // Start with no notification visible
    // cy.get('#groupCreationNotification').should('not.exist');
    
    // Open and fill form
    cy.get('.create-deal-btn').first().click();
    fillRequiredGroupFields();
    
    // Submit form
    cy.get('#groupForm').submit();
    cy.wait('@createGroup');
    
    // Verify notification appears with correct content
    cy.get('#groupCreationNotification').should('be.visible')
      .within(() => {
        cy.get('.notification-icon').should('contain', '✓');
        cy.get('h3').should('contain', 'Group Created Successfully!');
        cy.get('p').should('contain', 'Your new group is ready to use');
        cy.get('.view-group-btn').should('contain', 'View Group');
      });
  });

//   TO DO waiting for Omar to finish
//   it('should navigate to groups page when clicking View Group', () => {
//     // Stub the redirect to avoid actual page change
//     cy.window().then((win) => {
//       cy.stub(win, 'location').value({
//         href: '',
//         assign: cy.spy().as('redirect')
//       });
//     });

//     // Create group
//     cy.get('.create-deal-btn').first().click();
//     fillRequiredGroupFields();
//     cy.get('#groupForm').submit();
//     cy.wait('@createGroup');
    
//     // Click view group button
//     cy.get('#viewGroupBtn').click();
    
//     // Verify redirect
//     cy.get('@redirect').should('have.been.calledWith', '/groupslisting.html');
//   });

  it('should auto-hide notification after 5 seconds', () => {
    // Create group
    cy.get('.create-deal-btn').first().click();
    fillRequiredGroupFields();
    cy.get('#groupForm').submit();
    cy.wait('@createGroup');
    
    // Verify notification appears
    cy.get('#groupCreationNotification').should('be.visible');
    
    // Wait for auto-hide (minus 1 second to check it's still visible)
    cy.wait(4000);
    cy.get('#groupCreationNotification').should('be.visible');
    
    // Wait remaining time
    cy.wait(1000);
    cy.get('#groupCreationNotification').should('not.be.visible');
  });

  it('should immediately hide notification when clicked outside', () => {
    // Create group
    cy.get('.create-deal-btn').first().click();
    fillRequiredGroupFields();
    cy.get('#groupForm').submit();
    cy.wait('@createGroup');
    
    // Click outside notification
    cy.get('body').click(10, 10);
    
    // Verify notification hides immediately
    cy.get('#groupCreationNotification').should('not.be.visible');
  });

  // Helper function to fill required group fields
  function fillRequiredGroupFields() {
    cy.get('#storeName').type('Test Store');
    cy.get('#storeLocation').type('Test Location');
    cy.get('#membersRequired').clear().type('5');
    cy.get('#expiryDate').type('2025-12-31T23:59');
  }
});