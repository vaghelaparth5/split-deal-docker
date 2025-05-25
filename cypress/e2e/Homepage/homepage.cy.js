describe('Landing Page', () => {
  beforeEach(() => {
    cy.visit('/', {
      timeout: 60000,
      onBeforeLoad(win) {
        win.onerror = null;
      }
    });
  });

  it('should load the landing page successfully', () => {
    cy.get('header').should('exist');
    cy.get('.site__title').should('contain', 'Share and Recieve the Best Deals');
    cy.get('footer').should('exist');
  });

  it('should display the navigation bar correctly', () => {
    cy.get('.header__logo img').should('have.attr', 'src', './images/split-deal-logo.png');
    cy.get('.header__elenco li').should('have.length.at.least', 4);
    cy.get('.header__el a[href="/index.html"]').should('contain', 'Home');
    cy.get('.header__el a[href="/views/dealsDetails.html"]').should('contain', 'Deals');
  });

  it('should have call-to-action buttons', () => {
    cy.get('.buttonscontainer a[href*="grouplisting"]').should('exist');
    cy.get('.buttonscontainer a[href*="dealsDetails"]').should('exist');
  });
});