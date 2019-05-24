
// const assert = require('assert');
const switchpath = require('./switchpath');
// 新建普通app
async function NewappAppstore( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try{
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),2500).click();
    await driver.sleep(3000)
    const datatimes = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(datatimes);
    await driver.wait(until.elementLocated(By.xpath("//div[contains(@class,'ant-select-selection__rendered')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("//li[contains(text(),'应用商店')]")),2000).click();
    await driver.wait(until.elementLocated(By.xpath("//input[@id='icon_obj']")),1000).click();
    await driver.findElement(By.xpath("//li[@title='Bindo']")).click();
    await driver.wait(until.elementLocated(By.xpath("//li[@title='China']")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'确 认')]")),4000).click();
    await driver.sleep(3000);
    const arr = [
      "//td[contains(.,'",
      datatimes,
      "')]",
    ];
    const path1 = arr.join('');
    console.info(path1);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(path1)),4000);
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
        console.info(textValue);
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();')
    // await driver.sleep(3000);
    // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    // await driver.sleep(3000);
    // const loaclrows = await driver.wait(until.elementLocated(By.xpath("//td[contains(.,'"+datatimes+"')]")),4100);
    // await loaclrows.click();
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
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),3000).click();
    await driver.sleep(3000);
    const datatimes1 = (`v1.0.s${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(datatimes1);
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
    const arr = [
      "//td[contains(.,'",
      datatimes1,
      "')]",
    ];
    const path1 = arr.join('');
    console.info(path1);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(path1)),4000);
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
        console.info(textValue);
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(3000);
    // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
    // await driver.sleep(3000);
    // var loacl_rows1 = await driver.wait(until.elementLocated(By.xpath("//td[contains(.,'"+datatimes1+"')]")),4100);
    // await loacl_rows1.click();
    // await driver.sleep(5000);
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
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),3000).click();
    await driver.sleep(3000);
    const datatimes2 = (`v1.0.c${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@class='ant-input']")).sendKeys(datatimes2);
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
    const arr = [
      "//td[contains(.,'",
      datatimes2,
      "')]",
    ];
    const path1 = arr.join('');
    console.info(path1);
    await driver.sleep(3000);
    const getname = await driver.wait(until.elementLocated(By.xpath(path1)),4000);
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
        console.info(textValue);
      });
    await switchpath.switchpath(driver, webdriver);
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');// 刷新浏览器
    // await driver.sleep(3000);
  // await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');
  // await driver.sleep(3000);
  // var loacl_rows2 = await driver.wait(until.elementLocated(By.xpath("//td[contains(.,'"+datatimes2+"')]")),4100);
  // await loacl_rows2.click();
  // await driver.sleep(5000);
  } catch(error) {
    console.error(error)
  }

}

module.exports = {
  NewappAppstore,
  NewappSystem,
  Newappcompany,
};

