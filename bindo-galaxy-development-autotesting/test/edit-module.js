
// 编辑普通module
async function editmodule( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(3000);
    await driver.executeScript( 'window.scrollTo(0,document.body.scrollHeight);');
    const button5 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button5.click();
    await driver.sleep(5000);
    const buttonedits = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonedits.click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E_${params.createUuid()}`);
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).clear();
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).sendKeys(`E_${ params.createUuid()}`);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  }catch (error){
    console.error(error)
  }

}

// 编辑enufolder
async function editmoduleMenufolder( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;

  try {
    await driver.sleep(3000);
    const button6= await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button6.click();
    await driver.sleep(2000);
    const buttonedit6 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonedit6.click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E_${ params.createUuid()}`);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  }catch (error) {
    console.error(error)
  }

}

// 编辑Newmodule EMbedde
async function deitmoduleEMbedde( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;
  try {
    const button7 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button7.click();
    await driver.sleep(2000);
    const buttonedits7 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonedits7.click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E_${ params.createUuid()}`);
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//textarea[@class='ant-input']")).clear();
    await driver.findElement(By.xpath("//textarea[@class='ant-input']")).sendKeys('https://www.baidu.com/');
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  } catch(error) {
    console.error(error)

  }

}

// 编辑setting
async function editmoduleSetting( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;
  try {
    const button8 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button8.click();
    await driver.sleep(2000);
    const buttonedits8 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonedits8.click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E_${ params.createUuid()}`);
    await driver.findElement(By.xpath("//input[@id='moduleName']")).clear();
    await driver.findElement(By.xpath("//input[@id='moduleName']")).sendKeys(`E_${ params.createUuid()}`)
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  } catch (error) {
    console.error(error)
  }

}
// 编辑wiki only
async function editmoduleWikionly( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;
  try {
    const button9 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button9.click();
    await driver.sleep(2000);
    const buttonedits9 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonedits9.click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E_${ params.createUuid()}`);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  } catch(error) {
    console.error(error)
  }
}

module.exports = {
  editmodule,
  editmoduleMenufolder,
  deitmoduleEMbedde,
  editmoduleSetting,
  editmoduleWikionly,
};

