const Actions = require('selenium-webdriver/lib/actions');
// const assert = require('assert')
// const aa = require('selenium-webdriver/testing/')
// const {
//   switchmode,
// }
// =require
const login = require('../public-method/dashborad-method/login');
const loginout = require('../public-method/dashborad-method/login-out');
const switchmode = require('../public-method/dashborad-method/switchmode');
const Newapp = require('../public-method/moduild-build/newapp');
const EditApp = require('../public-method/moduild-build/editapp');
const Newmodule = require('../public-method/moduild-build/newmodule');
const entermodule = require('../public-method/moduild-build/enter-module')
const editmodule = require('../public-method/moduild-build/editmodule');
const foremview = require('../public-method/moduild-build/enter-formview');
const newdata = require('../public-method/dashborad-method/new-datas');
const edtidata = require('../public-method/dashborad-method/editdata');
const deletedata = require('../public-method/moduild-build/delect');
const athorization = require('../public-method/dashborad-method/permisson');

async function tabs(driver, webdriver,params){
  const {
    By,
    until,
  }=webdriver;
  try {
    await login.login(driver,webdriver);
    console.info('执行tabs控件操作：')
    const action = new Actions.LegacyActionSequence(driver);
    await Newapp.Newappcompany(driver, webdriver);
    await EditApp.EditApp(driver, webdriver, params);
    await entermodule.entermodule(driver, webdriver);
    await Newmodule.Newmodule(driver, webdriver, params);
    await editmodule.editmodule(driver, webdriver, params);
    await foremview.foremview(driver, webdriver)
    const start = await driver.wait(until.elementLocated((By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'选项卡')]"),2000)));
    const local = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-container']"))
    await driver.sleep(3000);
    action.mouseMove(start).mouseDown().mouseMove(local).mouseUp().perform()
    await driver.sleep(3000);
    const clearmsg = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @value='New Tab']")),3000);
    await clearmsg.clear();
    const tablsname = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @value='New Tab']")),3000);
    await tablsname.sendKeys('Testing msg');
    await driver.sleep(3000);
    await driver.findElement(By.xpath("(//input[contains(@type,'text')])[3]")).sendKeys('Running automated tests');
    await driver.findElement(By.xpath("//div[@role='tab'][contains(.,'视图')]")).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),5000).click();
    await driver.sleep(2000);
    console.info('tabs控件设置完成')
    await switchmode.switchmode(driver,webdriver)
    await athorization.athorization(driver,webdriver)
    await newdata.newdata(driver,webdriver)
    await edtidata.editdata(driver,webdriver)
    await deletedata.delect(driver,webdriver)
    await switchmode.switchmode(driver,webdriver)
    await deletedata.deletedata(driver,webdriver)
    await switchmode.switchmode(driver,webdriver)
    await loginout.loginout(driver,webdriver)
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  tabs,
};
