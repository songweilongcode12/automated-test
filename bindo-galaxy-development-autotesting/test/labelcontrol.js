const Actions = require('selenium-webdriver/lib/actions');
const input = require('selenium-webdriver/lib/input');
// const assert = require('assert')
// const aa = require('selenium-webdriver/testing/')
// const {
//   switchmode,
// }
// =require
const switchmode = require('./switchmode');
const editdata = require('./editdata');
const newdata = require('./new-datas');
const deletedata = require('./delect');

async function lablscontrol(driver, webdriver){
  const {
    By,
    until,
  }=webdriver;
  try {
    await driver.sleep(4000);
    console.info('执行label控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'控件名称')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    // await driver.executeScript("$('input[value='New 控件名称']').val(“”)");
    // await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),4000).click();
    // const js = 'document.getElementsByClassName("ant-input")[1].value="Testing Labels Control'
    // const parames = [
    //   "'",
    //   js,
    //   Math.ceil(Math.random()*10000),
    //   '"',
    //   ';',
    //   "'",
    // ]
    // const controlname = parames.join('');
    // await driver.sleep(3000)
    // console.info(controlname);
    // await driver.executeScript(controlname);
    // await driver.sleep(9000);
    const labname = await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),8000);
    // await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),4000).sendKeys(input.Key.DELETE);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.BACK_SPACE);
    // await driver.sleep(9000);
    const parames = [
      Math.ceil(Math.random()*10000),
    ]
    const controlname = parames.join('')
    await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),8000).sendKeys(controlname)
    await driver.sleep(2000);
    // await driver.findElement(By.className('ant-input-number-input')).clear();
    // await driver.sleep(3000);
    const lablesize = await driver.findElement(By.className('ant-input-number-input'));
    await lablesize.sendKeys(input.Key.COMMAND,'a');
    await lablesize.sendKeys(input.Key.BACK_SPACE);
    await lablesize.sendKeys('1');
    await driver.findElement(By.xpath("//div[@class='ant-select-selection__rendered'][contains(.,'500')]")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[@class='ant-select-dropdown-menu-item' and contains(text(),'300')]")),3000).click();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[3]")),2000).sendKeys('This is a testing !');
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn bg-galaxy-btn ant-btn-primary']")),3000).click();
    await driver.sleep(2000);
    await switchmode.switchmode(driver, webdriver);
    await driver.sleep(3000);
    await newdata.newdata(driver, webdriver);
    await editdata.editdata(driver, webdriver);
    await deletedata.delect(driver,webdriver);
    await driver.sleep(3000);
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  lablscontrol,
};
