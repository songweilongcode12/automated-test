
// const assert = require('assert');
const publicdata = require('../../basic-control/publicdata')
const switchpath = require('./switchpath');
// 新建普通app
async function NewappAppstore( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始新建应用级app')
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),2500).click();
    await driver.sleep(3000)
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(publicdata.newappdata);
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'ant-select-selection__rendered')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(),'应用商店')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("//input[@id='icon_obj']")),1000).click();
    await driver.findElement(By.xpath("//li[@title='Bindo']")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[@title='China']")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'确 认')]")),4000).click();
    await driver.sleep(3000);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(publicdata.apppath)),4000);
    // await getname.click();
    const appname = getname.getText()
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000).click();
    await driver.sleep(5000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'视图')]]")),4000).click();
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(appname)){
          console.info(true);}else
        {
          console.info('新建app检测面包屑失败');
        };
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    console.info('应用级app完成')
  } catch(error) {
    console.error(error)
  }

}

// 新建系统app
async function NewappSystem( driver, webdriver,) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始新建系统级app')
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),3000).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(publicdata.newappdata);
    await driver.sleep(500);
    await driver.findElement(By.xpath("//div[contains(@class,'ant-select-selection__rendered')]")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(),'系统')]")),3000).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='icon_obj']")).click();
    await driver.findElement(By.xpath("//li[@title='Bindo']")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[@title='HK']")),2000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'确 认')]")),4000).click();
    await driver.sleep(3000);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(publicdata.newappdata)),4000);
    const appname = getname.getText()
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000).click();
    await driver.sleep(5000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'视图')]]")),4000).click();
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(appname)){
          console.info(true);}else
        {
          console.info('新建app检测面包屑失败');
        };
        // console.info(textValue);
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    console.info('系统级app新建完成')
  }catch(error) {
    console.error(error)
  }
}

// 新建企业app
async function Newappcompany(driver, webdriver,) {
  const {
    By,
    until,
  } = webdriver;
  try {
    console.info('开始新建企业级app')
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),3000).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(publicdata.newappdata);
    await driver.sleep(500);
    await driver.findElement(By.xpath("//div[contains(@class,'ant-select-selection__rendered')]")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(),'企业')]")),3000).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//input[@id='icon_obj']")).click();
    await driver.findElement(By.xpath("//li[@title='Antd']")).click();
    await driver.findElement(By.xpath("//li[@title='Form']")).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'确 认')]")),7000).click();
    await driver.sleep(3000);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(publicdata.apppath)),4000);
    // await getname.click();
    const appname = getname.getText()
    await driver.sleep(3000);
    const button5 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button5.click();
    await driver.sleep(5000);
    const buttonedits1 = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'视图')]]")),4000);
    await buttonedits1.click();
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(appname)){
          console.info(true);}else
        {
          console.info('新建app检测面包屑失败');
        };
        // console.info(textValue);
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    console.info('企业级app新建完成')
  } catch(error) {
    console.error(error)
  }

}

module.exports = {
  NewappAppstore,
  NewappSystem,
  Newappcompany,
};

