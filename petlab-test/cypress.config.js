const { defineConfig } = require("cypress");

module.exports = defineConfig({
  restartBrowserBetweenSpecFiles: true,
  reporter: "mochawesome", // use mochawesome as the reporter
  reporterOptions: {
    reportDir: "cypress/results", // where to save the report
    overwrite: true,             // Do not overwrite previous reports
    html: true,                   // Generate an HTML report
    json: true,                   // Generate a JSON report
  },
  e2e: {
    specPattern: 'cypress/integration/**/*.spec.js',  // Make sure to specify the correct spec files pattern
    setupNodeEvents(on, config) {
      // implement any additional node event listeners here if necessary
      require('cypress-mochawesome-reporter/plugin')(on);  // Register the mochawesome reporter plugin
    },
  },
});
