const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');
const test = require('../test');

const {
  Builder,
} = webdriver;

const {
  Options,
} = chrome;

const chromeOptions = new Options();

const { path } = chromedriver;
const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

let isOptionsHeadless = true;
const params = {
  baseUrl: 'http://localhost:3000',
}
process.argv.forEach(item => {
  if (item === '-w') {
    isOptionsHeadless = false;
  }
  if (item === '-staging') {
    params.baseUrl = 'http://galaxy-test.stg.gobindo.com';
  }
})

if (isOptionsHeadless) {
  chromeOptions.headless(); // 浏览器不提供可视化页面
}

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(chromeOptions)
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

(async function example() {
  try {
    await test(driver, webdriver, params);
  } finally {
    await driver.quit();
  }
})();
