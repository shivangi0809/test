describe('Price Verification Test', () => {
  const urls = require('../../fixtures/urls.json').urls;

  urls.forEach((urlObj) => {
    it(`should display prices correctly on ${urlObj.url}`, () => {
      cy.verifyPageLoad(urlObj.url);
      cy.verifyPriceOnPage(urlObj.priceSelectors);
    });
  });
});
