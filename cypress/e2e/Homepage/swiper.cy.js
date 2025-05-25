describe('Featured Deals Swiper', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.onerror = null;
      }
    });
  });

  it('should display the swiper section', () => {
    cy.get('.swiper-section h2').should('contain', 'Featured Deals');
    cy.get('.swiper-container').should('exist');
  });

  it('should have navigation controls', () => {
    cy.get('.swiper-button-prev').should('exist');
    cy.get('.swiper-button-next').should('exist');
    cy.get('.swiper-pagination').should('exist');
  });

  it('should display at least 4 deal slides', () => {
    cy.get('.swiper-slide').should('have.length.at.least', 4);
    cy.get('.swiper-slide img').should('have.length.at.least', 4);
  });

  it('should navigate between slides', () => {
    cy.get('.swiper-slide').first().should('be.visible');
    cy.get('.swiper-button-next').click();
    cy.get('.swiper-slide').eq(1).should('be.visible');
    cy.get('.swiper-button-prev').click();
    cy.get('.swiper-slide').first().should('be.visible');
  });

  it('should update pagination dots when navigating', () => {
    cy.get('.swiper-pagination-dot').first().should('have.class', 'active');
    cy.get('.swiper-button-next').click();
    cy.get('.swiper-pagination-dot').eq(1).should('have.class', 'active');
  });
});