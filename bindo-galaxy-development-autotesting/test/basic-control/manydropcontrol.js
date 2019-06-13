const Actions = require('selenium-webdriver/lib/actions');
const input = require('selenium-webdriver/lib/input');
const login= require('../public-method/dashborad-method/login');
const switchmode = require('../public-method/dashborad-method/switchmode');
const switchpath = require('../public-method/moduild-build/switchpath');
const Newapp =require('../public-method/moduild-build/newapp');
const EditApp = require('../public-method/moduild-build/editapp');
const entermodule = require('../public-method/moduild-build/enter-module');
const Newmodule = require('../public-method/moduild-build/newmodule');
const editmodule = require('../public-method/moduild-build/editmodule');
const loginout = require('../public-method/dashborad-method/login-out');
const foremview =require('../public-method/moduild-build/enter-formview');
const athorization = require('../public-method/dashborad-method/permisson');
const newdata = require('../public-method/dashborad-method/new-datas');
const editdata = require('../public-method/dashborad-method/editdata');
const deletedata = require('../public-method/moduild-build/delect');
const publicdata = require('./publicdata');

async function manydropcontrol(driver, webdriver,params){
  const {
    By,
    until,
  }=webdriver;
  try {
    // await driver.sleep(10000);
    await login.login(driver,webdriver,params)
    await switchpath.switchpath(driver,webdriver)
    await Newapp.Newappcompany(driver, webdriver);
    await EditApp.EditApp(driver, webdriver, params);
    await entermodule.entermodule(driver, webdriver);
    await Newmodule.Newmodule(driver, webdriver, params);
    await editmodule.editmodule(driver, webdriver, params);
    await foremview.foremview(driver, webdriver);
    console.info('执行多选单选下拉框控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'下拉框')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    await driver.wait(until.elementLocated(By.xpath("//div[@class='ant-select-selection__rendered'][contains(.,'单选')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("//li[@aria-selected='false']")),2000).click()
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'OK')]")),2000).click();
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    if (await driver.wait(until.elementLocated(By.xpath("(//div[contains(@class,'ant-select-selection__rendered')])[1]")),3000).click()==null
    ){
      console.info('整数控件属性不可见设置成功')
    }else{
      console.info('整数控件属性不可见设置失败')
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
      console.info('多选下拉框控件隐藏文本属性设置成功')
    }else{
      console.info('多选下拉框控件隐藏文本属性设置失败')
    }
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Dropdown')] ")),4000);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.DIVIDE);
    // await driver.sleep(9000);
    await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Dropdown')]")),8000).sendKeys(publicdata.controlname)
    // await driver.sleep(2000);
    const field = (`testingname_${new Date().getTime()}`);
    // await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[3]")),3000).sendKeys(field);
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-primary ant-btn-block')]")),3000).click();
    // await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-icon-only')]")),2000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[6]")),2000).sendKeys('1');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[7]")),2000).sendKeys(publicdata.showname1);
    // await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn ant-btn-icon-only')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[8]")),2000).sendKeys('2');
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[9]")),2000).sendKeys(publicdata.showname2);
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[4]"))).sendKeys('Do not modify the automated test!');
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[5]")),4000).sendKeys('Do not modify the automated test!')
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),8000).click()
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver);
    await driver.sleep(3000);
    await athorization.athorization(driver,webdriver)
    await newdata.newdata(driver,webdriver,'C',"//div[contains(@class,'ant-select-selection__rendered')]","//li[@class='ant-select-dropdown-menu-item ant-select-dropdown-menu-item-active']");
    await editdata.editdata(driver,webdriver,'C',"//div[contains(@class,'ant-select-selection__rendered')]","//li[@class='ant-select-dropdown-menu-item']");
    await deletedata.delect(driver,webdriver);
    await switchmode.switchmode(driver,webdriver);
    await switchpath.switchpath(driver,webdriver);
    console.info('执行删除app');
    await deletedata.delect(driver,webdriver);
    console.info('删除app完成');
    await switchmode.switchmode(driver, webdriver);
    await loginout.loginout(driver,webdriver);
    await driver.sleep(3000);
    console.info('执行多选单选下拉框控件操作：')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  manydropcontrol,
};
