// 编辑app
async function EditApp( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(5000);
    await driver.executeScript( 'window.scrollTo(0,document.body.scrollHeight);');
    const button4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button4.click();
    // await driver.executeScript('document.body.scrollTop;');
    await driver.sleep(2000);
    const buttonEdits = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonEdits.click();
    await driver.sleep(2000);
    const editdatas = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).clear();
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(editdatas);
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@type='text']")).click();
    await driver.findElement(By.xpath("//input[@id='icon_obj']")).click();
    await driver.findElement(By.xpath("//li[@title='Bindo']")).click();
    await driver.findElement(By.xpath("//li[@title='UK']")).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button' and @class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    await driver.executeScript('window.location.reload();');
    await driver.sleep(3000);
    // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    // var loacl_rows4 = await driver.wait(until.elementLocated(By.xpath("//td[contains(.,'"+editdatas+"')]")),4100);
    // await loacl_rows4.click();
    // await driver.sleep(3000);
    // var last_rows4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")),4500);
    // await last_rows4.click();
    // await driver.sleep(6000);
  } catch(error) {
    console.error(error)
  }
}

// 编辑系统app
async function EditsystemApp( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(3000);
    const button5 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button5.click();
    await driver.sleep(5000);
    const buttonEdits1 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonEdits1.click();
    await driver.sleep(2000);
    const editdatas1 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).clear();
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(editdatas1);
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@type='text']")).click();
    await driver.findElement(By.xpath("//input[@id='icon_obj']")).click();
    await driver.findElement(By.xpath("//li[@title='Bindo']")).click();
    await driver.findElement(By.xpath("//li[@title='UK']")).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'确 认')]")).click();
    await driver.sleep(4000);
    await driver.executeScript('window.location.reload();');
    await driver.sleep(8000);
    // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    // var loacl_rows5 = await driver.wait(until.elementLocated(By.xpath("//td[contains(.,'"+editdatas1+"')]")),4100);
    // await loacl_rows5.click();
    // await driver.sleep(3000);
    // var last_rows4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")),4500);
    // await last_rows4.click();
    await driver.sleep(6000);
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  EditApp,
  EditsystemApp,
}
