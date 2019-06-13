const Actions = require('selenium-webdriver/lib/actions');
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

async function notecontrol(driver, webdriver,params){
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
    console.info('执行note控件操作：')
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-text' and contains(text(),'笔记')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    action.dragAndDrop(start,local).perform();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),3000).click();
    await driver.sleep(2000);
    // await driver.wait(until.elementLocated(By.xpath("//i[contains(@class,'fa fa-expand')]")),3000).click();
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@style,'min-height: 200px;')]")),4000).sendKeys('(Module build automated test input test for the note control, do not delete, thank you for your cooperation module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作)!  (module build自动化测试对note控件输入测试，请勿删除，谢谢合作! Module build automated test input test for the note control, do not delete, thank you for your cooperation module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作!)');
    // await driver.sleep(2000);
    // await driver.wait(until.elementLocated(By.xpath("//i[contains(@class,'fa fa-compress')]")),2000).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'OK')]")).click();
    await driver.sleep(2000);
    const controlname = await driver.findElement(By.xpath("(//input[contains(@type,'text')])[2]"))
    await controlname.sendKeys('Testing note!');
    await driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(publicdata.field)
    await driver.findElement(By.xpath("(//input[@type='text'])[4]")).sendKeys('this is Testing!')
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'保 存')]")),3000).click();
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver);
    await athorization.athorization(driver,webdriver);
    await newdata.newdata(driver,webdriver,'B',"//div[contains(@style,'min-height: 200px;')]",);
    await editdata.editdata(driver,webdriver,'B',"//div[contains(@style,'min-height: 200px;')]",);
    await deletedata.delect(driver,webdriver);
    await driver.sleep(3000);
    await switchmode.switchmode(driver,webdriver);
    await switchpath.switchpath(driver,webdriver);
    console.info('执行删除app');
    await deletedata.delect(driver,webdriver);
    console.info('删除app完成');
    await switchmode.switchmode(driver, webdriver);
    await loginout.loginout(driver,webdriver);
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  notecontrol,
};
