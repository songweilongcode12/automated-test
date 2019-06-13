const switchmode = require('./switchmode');

// module 授权
async function athorization(driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始执行权限操作')
    const permissonbutton = await driver.wait(until.elementLocated(By.xpath('//i[@aria-label="icon: lock"]')),5000);
    await permissonbutton.click();
    await driver.sleep(1000);
    // await driver.executeScript( "window.scrollTo(0,document.body.scrollHeight);");
    // await driver.sleep(5000);
    // await driver.findElement(By.xpath('//div[@class="bg-galaxy-footer"]')).click();
    await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'编 辑')]]")).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-9]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-8]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-7]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-6]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-5]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-4]")).click();
    await driver.findElement(By.xpath("(//button[@type='button'])[last()-3]")).click();
    await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")).click();
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver)
    await switchmode.switchmode(driver,webdriver)
    console.info('权限操作结束')

  } catch (error) {
    console.error(error)
  }
}

module.exports={
  athorization,
};
