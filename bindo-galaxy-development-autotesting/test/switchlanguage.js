// 切换店铺
const Actions = require('selenium-webdriver/lib/actions');

async function switchlanguage( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始切换语言为中文')
    // await driver.sleep(3000);
    // await driver.wait(until.elementLocated(By.xpath("//div[@class='bg-c-header-node right ant-dropdown-trigger'][2]")),5000).click();
    // await driver.sleep(2000);
    const actions = new Actions.LegacyActionSequence(driver)
    actions.mouseMove(await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-c-header-node-icon'])[3]")),3000)).perform();
    await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("//li[contains(.,'简体中文')]")),3000).click();
    await driver.sleep(3000);
    console.info('语言切换成功');
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  switchlanguage,
};
