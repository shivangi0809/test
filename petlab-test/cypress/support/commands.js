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

Cypress.Commands.add('validateCurrencyFormat', (selector, currencyRegex) => {
  cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.get(selector).should('exist').each(($el) => {
        cy.wrap($el)
          .invoke('text')
          .then((text) => {
            const cleaned = text.trim().split(' ')[0];
            cy.log(`Validating price: "${cleaned}"`);
            expect(cleaned).to.match(new RegExp(currencyRegex));
          });
      });
    } else {
      cy.log(`Selector not found: ${selector}`);
      throw new Error(`Selector not found on page: ${selector}`);
    }
  });
});


Cypress.Commands.add('selectAllOptionsAndCheckPrice', (selector, priceSelector) => {
  cy.get(selector).each(($option) => {
    cy.wrap($option).click({ force: true });
    cy.get(priceSelector).should('be.visible');
  });
});


