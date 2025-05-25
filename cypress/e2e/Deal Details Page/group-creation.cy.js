describe('Group Creation', () => {
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
      body: { success: true }
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

  it('should open the group creation modal when clicking Create Group', () => {
    cy.get('.create-deal-btn').first().click();
    cy.get('#createGroupModal').should('be.visible');
    cy.get('#createGroupModal h2').should('contain', 'Create New Group Deal');
  });

  it('should pre-fill deal information in the modal', () => {
    // Get deal info from the card
    cy.get('.deal-card').first().within(() => {
      cy.get('h3').invoke('text').as('dealTitle');
      cy.get('.price').invoke('text').as('dealPrice');
      cy.get('.create-deal-btn').click();
    });

    // Verify pre-filled values
    cy.get('@dealTitle').then((title) => {
      cy.get('#dealTitle').should('have.value', title.trim());
    });
    
    cy.get('@dealPrice').then((price) => {
      const numericPrice = parseFloat(price.replace('$', ''));
      cy.get('#totalValue').should('have.value', numericPrice);
    });
    
    cy.get('#discount').invoke('val').should('not.be.empty');
    cy.get('#dealId').invoke('val').should('not.be.empty');
    cy.get('#dealLogo').invoke('val').should('not.be.empty');
  });

  // Waiting for omar to finish this page
//   xit('should submit the group creation form successfully and redirect', () => {
//     cy.get('.create-deal-btn').first().click();
    
//     // Fill in required fields
//     cy.get('#storeName').type('Test Store');
//     cy.get('#storeLocation').type('Test Location');
//     cy.get('#membersRequired').clear().type('5');
//     cy.get('#expiryDate').type('2025-12-31T23:59');
    
//     // Stub the redirect
//     cy.window().then((win) => {
//       cy.stub(win, 'location').value({
//         href: '',
//         assign: cy.spy().as('redirect')
//       });
//     });

//     cy.get('#groupForm').submit();
//     cy.wait('@createGroup').then((interception) => {
//       expect(interception.response.statusCode).to.equal(201);
//     });

//     // Verify redirect to groups page
//     cy.get('@redirect').should('have.been.calledWith', '/groupslisting.html');
//   });

  it('should show validation errors for required fields', () => {
    cy.get('.create-deal-btn').first().click();
    
    // Clear required fields
    cy.get('#storeLocation').clear();
    cy.get('#membersRequired').clear();
    cy.get('#expiryDate').clear();
    
    // Attempt submission
    cy.get('#groupForm').submit();

    // Verify validation messages
    cy.get('#storeLocation').then(($input) => {
      expect($input[0].validationMessage).not.to.be.empty;
    });
    
    cy.get('#membersRequired').then(($input) => {
      expect($input[0].validationMessage).not.to.be.empty;
    });
    
    cy.get('#expiryDate').then(($input) => {
      expect($input[0].validationMessage).not.to.be.empty;
    });
  });

});