describe('About Section', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the about section', () => {
    cy.get('.about-section').should('exist');
    cy.get('.about-content h2').should('contain', 'Why SplitDeal?');
  });

  it('should contain key information points', () => {
    const keyPhrases = [
      'Deakin University',
      'group discounts',
      'Split. Save. Smile.'
    ];
    
    keyPhrases.forEach(phrase => {
      cy.get('.about-content').should('contain', phrase);
    });
  });

  it('should have properly formatted content', () => {
    cy.get('.about-content p').should('have.length.at.least', 3);
    cy.get('.highlight').should('exist');
  });
});