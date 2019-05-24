const Actions = require('selenium-webdriver/lib/actions');
const input = require('selenium-webdriver/lib/input');
const switchmode = require('./switchmode');
// const enterformview = require('./enter-formview');
// const editdata = require('./editdata');
const newdata = require('./new-datas');
const editdata = require('./editdata')
const deletedata = require('./delect');
// const assert = require('assert');
async function textcontrol(driver, webdriver){
  const {
    By,
    until,
  }=webdriver;
  try {
    await driver.sleep(4000);
    console.info('执行text控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bindo-galaxy-editor-widgets-option-text' and contains(text(),'单行文本')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click()
    await driver.sleep(2000)
    const notvisible = await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),2000).click();
    console.info(notvisible)
    if (notvisible===null){
      console.info('控件属性不可见设置成功')
    }else{
      console.info('控件属性不可见设置成功')
    }
    // await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[2]")),2000).click();
    const controltext = await driver.findElement(By.xpath("(//div[@class='bg-c-drag-node-bar'])[2]")).getText();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    await driver.sleep(3000)
    const texthiding = await driver.findElement(By.xpath("(//div[@class='bg-c-drag-node-bar'])[2]")).getText();
    if(controltext!==texthiding){
      console.info('文本控件隐藏文本属性设置成功')
    }else{
      console.info('文本控件隐藏文本属性设置失败')
    }
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[3]")),4000);
    // await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),4000).sendKeys(input.Key.DELETE);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.DIVIDE);
    // await driver.sleep(9000);
    const parames = [
      Math.ceil(Math.random()*10000),
    ]
    const controlname = parames.join('')
    await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[3]")),8000).sendKeys(controlname)
    await driver.sleep(2000);
    const field = (`testingname_${new Date().getTime()}`);
    await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[4]")),3000).sendKeys(field);
    // await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[5]")),3000).sendKeys('this is testing!');
    // await driver.sleep(2000);
    // await driver.wait(until.elementLocated(By.xpath("(//div[@class='ant-select-selection__rendered'])[2]")),2000).sendKeys('Testing');
    // await driver.sleep(2000);
    // await driver.wait(until.elementLocated(By.xpath("//li[@role='option' and contains(text(),'Testing')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[6]"))).sendKeys('Do not modify the automated test!');
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[7]")),4000).sendKeys('Do not modify the automated test!')
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),3000).click()
    await driver.sleep(4000)
    await switchmode.switchmode(driver,webdriver)
    await driver.sleep(3000);
    await newdata.newdata(driver,webdriver,"//input[contains(@placeholder,'Do not modify the automated test!')]");
    await editdata.editdata(driver,webdriver,"//input[contains(@placeholder,'Do not modify the automated test!')]");
    await deletedata.delect(driver,webdriver);
    await driver.sleep(3000);
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  textcontrol,
};
