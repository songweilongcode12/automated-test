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

async function labelcontrol(driver, webdriver,params){
  const {
    By,
    until,
  }=webdriver;
  try {
    await login.login(driver,webdriver,params)
    await switchpath.switchpath(driver,webdriver)
    await Newapp.Newappcompany(driver, webdriver);
    await EditApp.EditApp(driver, webdriver, params);
    await entermodule.entermodule(driver, webdriver);
    await Newmodule.Newmodule(driver, webdriver, params);
    await editmodule.editmodule(driver, webdriver, params);
    await foremview.foremview(driver, webdriver);
    await driver.sleep(4000);
    console.info('执行label控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'控件名称')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    action.dragAndDrop(start,local).perform();
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),8000);
    // await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),4000).sendKeys(input.Key.DELETE);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.BACK_SPACE);
    await driver.wait(until.elementLocated(By.xpath("(//input[@type='text'])[2]")),8000).sendKeys(publicdata.controlname)
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
    await athorization.athorization(driver,webdriver);
    await newdata.newdata(driver, webdriver);
    await editdata.editdata(driver, webdriver);
    await deletedata.delect(driver,webdriver);
    await switchmode.switchmode(driver,webdriver);
    await switchpath.switchpath(driver,webdriver);
    console.info('执行删除app');
    await deletedata.delect(driver,webdriver);
    console.info('删除app完成');
    await switchmode.switchmode(driver, webdriver);
    await loginout.loginout(driver,webdriver);
    await driver.sleep(3000);
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  labelcontrol,
};
