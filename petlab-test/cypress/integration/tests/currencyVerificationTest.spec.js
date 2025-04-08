describe('Currency Verification Test', () => {
  const urls = require('../../fixtures/urls.json').urls;

  urls.forEach((urlObj) => {
    it(`should display prices in GBP on ${urlObj.url}`, () => {
      cy.verifyPageLoad(urlObj.url);
      cy.verifyCurrency(urlObj.currencySelector);
    });
  });
});
