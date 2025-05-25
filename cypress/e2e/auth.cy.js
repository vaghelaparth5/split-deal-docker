describe('Authentication Page Tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/views/login.html'); // Make sure server is running
    });
  
    it('Loads the Sign In form initially', () => {
      cy.get('#formTitle').should('contain', 'Sign In');
      cy.get('#email').should('exist');
      cy.get('#password').should('exist');
      cy.get('#submitBtn').should('contain', 'Sign In');
      cy.get('#toggleText').should('contain', "Don't have an account?");
      cy.get('#toggleLink').should('contain', 'Sign Up');
    });
  
    it('Toggles to Sign Up form correctly', () => {
      cy.get('#toggleLink').click();
  
      cy.get('#formTitle').should('contain', 'Sign Up');
      cy.get('#nameField').should('be.visible');
      cy.get('#confirmField').should('be.visible');
      cy.get('#submitBtn').should('contain', 'Sign Up');
      cy.get('#toggleText').should('contain', 'Already have an account?');
      cy.get('#toggleLink').should('contain', 'Sign In');
    });
  
    it('Switches back to Sign In form correctly after toggling', () => {
      cy.get('#toggleLink').click(); // Switch to Sign Up
      cy.get('#toggleLink').click(); // Switch back to Sign In
  
      cy.get('#formTitle').should('contain', 'Sign In');
      cy.get('#nameField').should('not.be.visible');
      cy.get('#confirmField').should('not.be.visible');
      cy.get('#submitBtn').should('contain', 'Sign In');
    });
  
    it('Shows error message when required fields are empty', () => {
      cy.get('#submitBtn').click();
  
      // Change this selector & text based on your real error handling
      cy.get('#errorMessage').should('be.visible').and('contain', 'Please enter');
    });
  });
  