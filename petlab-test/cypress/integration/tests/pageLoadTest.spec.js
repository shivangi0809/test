describe('Page Load Test', () => {
  const urls = require('../../fixtures/urls.json').urls;

  urls.forEach((urlObj) => {
    it(`should load ${urlObj.url} successfully`, () => {
      cy.verifyPageLoad(urlObj.url);
    });
  });
});
