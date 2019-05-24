// 登陆
const assert = require('assert');

async function login(driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;

  const {
    baseUrl,
  } = params;
  try {
    console.info('执行login case:')
    console.info('开始登陆');
    await driver.manage().window().maximize();
    await driver.get(`${baseUrl}/login`);
    await driver.findElement(By.id('username')).sendKeys('grant.song@bindo.com');
    await driver.findElement(By.id('password')).sendKeys('123456');
    const loginbuttom = await driver.wait(until.elementLocated(By.xpath("//button[@type='submit']")),5000);
    await loginbuttom.click();
    await driver.getCurrentUrl().then(loginurl => {
      assert.equal('http://galaxy.stg.gobindo.com/login', loginurl);
    });
    await driver.getTitle().then(logintitle => {
      assert.equal('Login - Bindo', logintitle);
    });
    await driver.sleep(6000);
    console.info('登陆完成');
  }catch(error) {
    console.error(error)
  }
}

module.exports = {
  login,
};
