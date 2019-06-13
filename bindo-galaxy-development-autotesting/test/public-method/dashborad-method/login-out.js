const Actions = require('selenium-webdriver/lib/actions');

async function loginout(driver, webdriver){
  const {
    By,
  }=webdriver;
  try {
    console.info('开始执行login out ')
    await driver.sleep(2000);
    const action = new Actions.LegacyActionSequence(driver);
    action.mouseMove(await driver.findElement(By.xpath("//div[contains(text(),'Grant (MANAGER)')]"))).perform();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//li[@class='ant-dropdown-menu-item']")).click();
    await driver.sleep(5000);
    console.info('退出登陆')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  loginout,
};

