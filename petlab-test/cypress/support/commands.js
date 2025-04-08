// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add("verifyPageLoad", (url) => {
  cy.visit(url);
  cy.url().should("eq", url); // Verify the URL matches
  cy.get("body").should("exist"); // Ensure the page body exists
  cy.request(url).its('status').should('eq', 200); // Verify HTTP 200 Success
});

Cypress.Commands.add("verifyPriceOnPage", (priceSelectors) => {
  cy.get(priceSelectors.oneTimePrice).should('be.visible').and('not.be.empty');
  cy.get(priceSelectors.subscribeSavePrice).should('be.visible').and('not.be.empty');
});

Cypress.Commands.add("verifyCurrency", (currencySelector) => {
  cy.get(currencySelector).should('have.text', '£'); // Assuming GBP as currency
});

Cypress.Commands.add("verifyFooterLinks", (footerLinks) => {
  footerLinks.forEach(link => {
    cy.get(link).should('have.attr', 'href').and('include', 'http'); // Verify link exists and is a valid URL
  });
});
