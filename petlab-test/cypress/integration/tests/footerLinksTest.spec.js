describe('Footer Links Test', () => {
  const urls = require('../../fixtures/urls.json').urls;

  urls.forEach((urlObj) => {
    it(`should verify footer links on ${urlObj.url}`, () => {
      cy.verifyPageLoad(urlObj.url);
      cy.verifyFooterLinks(urlObj.footerLinks);
    });
  });
});
