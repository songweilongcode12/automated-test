const Actions = require('selenium-webdriver/lib/actions');

async function loginout(driver, webdriver){
  const {
    By,
    // Actions,
    // WebDriver,
  }=webdriver;
    // const instanceDriver = new WebDriver();
  try {
    await driver.sleep(2000);
    const singout= await driver.findElement(By.xpath("//*[contains(text(),'Grant - MANAGER')]"));
    await driver.sleep(2000);
    // instanceDriver.actions({bridge: true}).mouseMove(singout).perform();
    const action = new Actions.LegacyActionSequence(driver);
    action.mouseMove(singout).perform();
    await driver.findElement(By.xpath("//*[contains(text(),'退出')]")).click();
    await driver.sleep(3000);
    // const actions = driver.actions();
    // await Actions(driver).move(singout).perform();
    // const action = new Actions(driver);
    // action.moveToElement(singout).click().perform();
    // await instance.mouseMove(singout).perform();
    // await driver(actions());
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  loginout,
};
