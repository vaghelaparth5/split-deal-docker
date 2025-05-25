describe("Email Subscription", () => {
  beforeEach(() => {
    cy.visit("/views/dealsDetails.html");
  });

  it("should display the email subscription section", () => {
    cy.get(".email-subscription h2").should(
      "contain",
      "Never Miss a Deal Again!"
    );
    cy.get("#subscribeEmail").should("exist");
    cy.get(".subscribe-btn").should("exist");
  });

  it("should show success message for valid email submission", () => {
    cy.get("#subscribeEmail").type("test@example.com");
    cy.get(".subscribe-btn").click();
    cy.get("#subscriptionMessage")
      .should("contain", "Thank you for subscribing!")
      .and("have.class", "success");
  });

  it("should show error message for invalid email", () => {
    cy.get("#subscribeEmail").type("1234");
    cy.get(".subscribe-btn").click();
    cy.get("#subscriptionMessage").should("exist");
  });

  it("should clear the input after successful submission", () => {
    cy.get("#subscribeEmail").type("test@example.com");
    cy.get(".subscribe-btn").click();
    cy.get("#subscribeEmail").should("have.value", "");
  });
});
