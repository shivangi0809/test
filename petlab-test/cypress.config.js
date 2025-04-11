const XLSX = require('xlsx');
const path = require('path');
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

function readUrlsFromExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(sheet);
  return jsonData.map(row => row.URL); 
}

module.exports = {
  e2e: {
    restartBrowserBetweenSpecFiles: false,
    reporter: "cypress-mochawesome-reporter",
    reporterOptions: {
      reportDir: "./report",
      overwrite: true,             
      html: true,
      json: true
    },
    setupNodeEvents(on, config) {
      on('before:run', async (details) => {
        console.log('override before:run');
        await beforeRunHook(details);
      });

      on('after:run', async () => {
        console.log('override after:run');
        await afterRunHook();
      });
      // Read URLs here and pass them to Cypress env
      const excelPath = path.resolve(__dirname, 'testData/urls.xlsx');
      const urls = readUrlsFromExcel(excelPath);
      config.env.testUrls = urls;
      return config;
    },
    baseUrl: 'https://offers.thepetlabco.com',
    specPattern: 'cypress/integration/**/*.js',
    supportFile: 'cypress/support/e2e.js'
  }
};
