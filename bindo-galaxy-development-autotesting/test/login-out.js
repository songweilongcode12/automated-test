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
    // const action1 = new Actions.LegacyActionSequence(driver).mouseDown().mouseUp()
    action.mouseMove(singout).perform();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//*[contains(text(),'退出')]")).click();
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  loginout,
};

