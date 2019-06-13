// 切换店铺
async function switchshop( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始选择店铺')
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//div[@class='bg-c-header-node right ant-dropdown-trigger'][2]")),5000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'取消全部')]")),5000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//input[@class='ant-input']")),3000).sendKeys('Module Builder Test Group');;
    // await storename.sendKeys('Test Module Builder');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//input[@type='checkbox']")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'应 用')]")),3000).click();
    // await driver.findElement(By.xpath("//button[@type='button'][contains(.,'应 用')]")).click();
    // await driver.sleep(3000);
    // var choose_store = await driver.wait(until.elementLocated(By.xpath("//div[@class='bg-c-header-store-drop-title ' and contains(text(),'Test Module Builder')]")),2000);
    // await choose_store.click();
    await driver.sleep(5000);
    console.info('店铺选择完成');
  } catch (error) {
    console.error(error)

  }
}

module.exports = {
  switchshop,
};
