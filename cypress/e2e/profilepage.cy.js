// cypress/e2e/profilepage.cy.js

describe('Static UI Check - Profile Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/views/profilepage.html');
    });
  
    it('should load the page with correct title', () => {
      cy.title().should('include', 'Profile'); // Update based on your actual page title
    });
  
    it('should display the login menu item', () => {
      cy.get('#loginMenuItem').should('exist');
    });
  
    it('should display the profile icon', () => {
      cy.get('#profileIcon').should('exist');
    });
  
    it('should have Current Groups and Past Deals tab buttons', () => {
      cy.contains('.tab-btn', 'Current Groups').should('exist');
      cy.contains('.tab-btn', 'Past Deals').should('exist');
    });
  
    it('should render at least one group card in Current tab', () => {
      cy.get('#current .group-card').its('length').should('be.gte', 1);
    });
  
    it('each group card in Current tab should have image, title, and description', () => {
      cy.get('#current .group-card').first().within(() => {
        cy.get('img').should('exist');
        cy.get('h3').should('exist').and('not.be.empty');
        cy.get('p').should('exist').and('not.be.empty');
      });
    });
  });
  