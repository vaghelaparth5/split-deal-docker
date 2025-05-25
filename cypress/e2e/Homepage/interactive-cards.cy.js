describe('Interactive Cards', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display three interactive cards', () => {
    cy.get('.interactive-cards .card').should('have.length', 3);
  });

  it('should contain correct card content', () => {
    const expectedTitles = ['Group Deal', 'Student Offer', 'Weekly Pick'];
    cy.get('.card-overlay h3').each(($el, index) => {
      cy.wrap($el).should('contain', expectedTitles[index]);
    });
  });

  it('should have proper images in cards', () => {
    cy.get('.card img').each(($img) => {
      cy.wrap($img)
        .should('have.attr', 'src')
        .and('match', /unsplash/);
    });
  });
});