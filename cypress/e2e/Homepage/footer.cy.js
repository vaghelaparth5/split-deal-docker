describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display footer content', () => {
    cy.get('.site-footer').should('exist');
    cy.get('.footer-brand h3').should('contain', 'SplitDeal');
    cy.get('.footer-bottom p').should('contain', '2025 IT Labs');
  });

  it('should have working quick links', () => {
    cy.get('.links-column h4').first().should('contain', 'Quick Links');
    cy.get('.links-column a').should('have.length.at.least', 4);
  });

  it('should display social media icons', () => {
    cy.get('.social-links a').should('have.length', 4);
    cy.get('.social-icon').should('have.length', 4);
  });

  it('should have copyright information', () => {
    cy.get('.footer-bottom').should('contain', 'All rights reserved');
  });
});