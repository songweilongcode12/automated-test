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

async function booleancontrol(driver, webdriver,params){
  const {
    By,
    until,
  }=webdriver;
  try {
    console.info('执行复选框控件操作：');
    await login.login(driver, webdriver, params)
    await switchpath.switchpath(driver,webdriver)
    await Newapp.Newappcompany(driver, webdriver);
    await EditApp.EditApp(driver, webdriver, params);
    await entermodule.entermodule(driver, webdriver);
    await Newmodule.Newmodule(driver, webdriver, params);
    await editmodule.editmodule(driver, webdriver, params);
    await foremview.foremview(driver, webdriver);
    await driver.sleep(4000);
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'是/否')]"));
    const local = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-container']"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[2]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[2]")),2000).click();
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Boolean')]")),4000);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.DIVIDE);
    // await driver.sleep(9000);
    await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Boolean')]")),2000).sendKeys(publicdata.controlsname)
    await driver.sleep(2000);
    // await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[3]")),3000).sendKeys(publicdata.field);
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[4]"))).sendKeys('Do not modify the automated test!');
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),8000).click()
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver);
    await athorization.athorization(driver,webdriver);
    await newdata.newdata(driver,webdriver);
    await editdata.editdata(driver,webdriver);
    await deletedata.delect(driver,webdriver);
    await switchmode.switchmode(driver,webdriver);
    await switchpath.switchpath(driver,webdriver);
    console.info('执行删除app');
    await deletedata.delect(driver,webdriver);
    console.info('删除app完成');
    await switchmode.switchmode(driver, webdriver);
    await loginout.loginout(driver,webdriver);
    await driver.sleep(3000);
    console.info('复选框控件操作完成：')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  booleancontrol,
};
