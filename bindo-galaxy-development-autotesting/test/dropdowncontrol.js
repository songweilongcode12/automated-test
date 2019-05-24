const Actions = require('selenium-webdriver/lib/actions');
const input = require('selenium-webdriver/lib/input');
const switchmode = require('./switchmode');
const newdata = require('./new-datas');
const editdata = require('./editdata')
const deletedata = require('./delect');
const configdata = require('./publicdata')

async function dropcontrol(driver, webdriver){
  const {
    By,
    until,
  }=webdriver;
  try {
    // await driver.sleep(10000);
    console.info('执行单选下拉框控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'下拉框')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'OK')]")),2000).click();
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    if (await driver.wait(until.elementLocated(By.xpath("(//div[contains(@class,'ant-select-selection__rendered')])[1]")),3000).click()==null
    ){
      console.info('单选下拉框控件属性不可见设置成功')
    }else{
      console.info('单选下拉框控件属性不可见设置失败')
    }
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[2]")),2000).click();
    await driver.sleep(3000);
    const controltext = await driver.findElement(By.xpath("//span[contains(.,'Dropdown - 下拉框')]")).getText();
    // await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    // await driver.sleep(3000)
    const texthiding = await driver.findElement(By.xpath("(//div[contains(@class,'bg-c-module-editor-nodes-bar-space')])[2]")).getText();
    await driver.sleep(3000)
    if(controltext!==texthiding){
      console.info('单选下拉框控件隐藏文本属性设置成功')
    }else{
      console.info('单选下拉框控件隐藏文本属性设置失败')
    }
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Dropdown')] ")),4000);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.DIVIDE);
    // await driver.sleep(9000);
    await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Dropdown')]")),8000).sendKeys(configdata.controlname)
    // await driver.sleep(2000);
    const field = (`testingname_${new Date().getTime()}`);
    // await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[3]")),3000).sendKeys(field);
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-primary ant-btn-block')]")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-icon-only')]")),2000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[6]")),2000).sendKeys('1');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[7]")),2000).sendKeys(configdata.showname1);
    // await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-icon-only')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[8]")),2000).sendKeys('2');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[9]")),2000).sendKeys(configdata.showname2);
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[4]"))).sendKeys('Do not modify the automated test!');
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[5]")),4000).sendKeys('Do not modify the automated test!')
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),8000).click()
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver);
    await driver.sleep(3000);
    await newdata.newdata(driver,webdriver,'C',"//div[contains(@class,'ant-select-selection__rendered')]","//li[@class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-active']");
    await editdata.editdata(driver,webdriver,'C',"//div[contains(@class,'ant-select-selection__rendered')]","//li[@class='ant-select-dropdown-menu-item']");
    await deletedata.delect(driver,webdriver);
    await driver.sleep(3000);
    console.info('单选下拉框控件操作完成：')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  dropcontrol,
};
