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

async function datarange(driver, webdriver,params){
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
    console.info('执行日期范围控件操作：');
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'日期范围')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(4000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.sleep(2000)
    // const log1 = await driver.wait(until.elementLocated(By.xpath("//span[@class='ant-calendar-picker']")),3000).click()
    // console.info(log1)
    // if (await driver.wait(until.elementLocated(By.xpath("//span[@class='ant-calendar-picker']")),3000).click()==null
    // ){
    //   console.info('日期范围控件属性不可见设置成功')
    // }else{
    //   console.info('日期范围控件属性不可见设置失败')
    // }ls
    await driver.sleep(2000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[1]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[2]")),2000).click();
    await driver.sleep(3000);
    const controltext = await driver.findElement(By.xpath("//span[contains(text(),'Date Range - 日期范围')]")).getText();
    await driver.sleep(3000)
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    // await driver.sleep(3000)
    const texthiding = await driver.findElement(By.xpath("(//div[contains(@class,'bg-c-module-editor-nodes-bar')])[4]")).getText();
    await driver.sleep(3000)
    if(controltext!==texthiding){
      console.info('日期范围控件隐藏文本属性设置成功')
    }else{
      console.info('日期范围控件隐藏文本属性设置失败')
    }
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'checkbox')])[4]"))).click();
    await driver.sleep(3000);
    const labname = await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Date Range')]")),4000);
    await labname.sendKeys(input.Key.COMMAND,'a');
    await labname.sendKeys(input.Key.DIVIDE);
    // await driver.sleep(9000);
    await driver.wait(until.elementLocated(By.xpath("//input[contains(@value,'Date Range')]")),2000).sendKeys(publicdata.controlname)
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[3]")),3000).sendKeys(publicdata.field);
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@title,'YYYY-MM-DD')]")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[4]"))).sendKeys('Do not modify the automated test!');
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[5]")),2000).sendKeys('Do not modify the automated test!')
    await driver.wait(until.elementLocated(By.xpath("(//input[contains(@type,'text')])[6]")),2000).sendKeys('Do not modify the automated test!')
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),8000).click()
    await driver.sleep(4000);
    await switchmode.switchmode(driver,webdriver);
    await driver.sleep(3000);
    await athorization.athorization(driver,webdriver)
    await newdata.newdata(driver,webdriver,'F',"(//input[@class='ant-calendar-range-picker-input'])[1]","(//input[@class='ant-calendar-input '])[1]","//td[@title='April 21, 2013']");
    await editdata.editdata(driver,webdriver,'F',"(//input[@class='ant-calendar-range-picker-input'])[1]","//td[@title='March 20, 2013']","//td[@title='April 23, 2013']");
    await deletedata.delect(driver,webdriver);
    await driver.sleep(3000);
    await switchmode.switchmode(driver,webdriver);
    await switchpath.switchpath(driver,webdriver);
    console.info('执行删除app');
    await deletedata.delect(driver,webdriver);
    console.info('删除app完成');
    await switchmode.switchmode(driver, webdriver);
    await loginout.loginout(driver,webdriver);
    console.info('日期范围范围操作完成：')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  datarange,
};
