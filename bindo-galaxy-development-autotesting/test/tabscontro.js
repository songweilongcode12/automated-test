const Actions = require('selenium-webdriver/lib/actions');
const assert = require('assert')
// const aa = require('selenium-webdriver/testing/')
// const {
//   switchmode,
// }
// =require
const switchmode = require('./switchmode');
const newdatas = require('./new-datas');

async function tabs(driver, webdriver){
  const {
    By,
    until,
  }=webdriver;
  try {
    console.info('执行tabs控件操作：')
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bg-c-editor-formview-components-node-source'][contains(.,'选项卡')]"));
    // const end = await driver.findElement(By.xpath("//div[@class='bindo-galaxy-module-breadcrumb ant-breadcrumb']"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(2000);
    // await driver.executeScript('arguments[0].scrollIntoView();',local);
    // await driver.executeAsyncScript("")
    await driver.sleep(3000);
    // action.mouseMove(start);
    // action.dragAndDrop(start,local).build(driver).perform();
    // action.perform();
    action.mouseMove(start).mouseDown().mouseMove(local).mouseUp().perform()
    await driver.sleep(1000);
    // await driver.findElement(By.xpath("//span[@class='ant-checkbox' and ./input[@type='checkbox']]")).click();
    // await driver.findElement(By.xpath("//div[@role='tab'][contains(.,'属性')]")).click();
    // await driver.sleep(3000);
    // const clearmsg = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @value='New Tab']")),3000);
    // await clearmsg.clear();
    // const tablsname = await driver.wait(until.elementLocated(By.xpath("//input[@type='text' and @value='New Tab']")),3000);
    // await tablsname.sendKeys('Testing msg');
    // await driver.sleep(3000);
    // await driver.findElement(By.xpath("(//input[contains(@type,'text')])[3]")).sendKeys('Running automated tests');
    await driver.findElement(By.xpath("//div[@role='tab'][contains(.,'视图')]")).click();
    // console.info('test element');
    await driver.sleep(2000);
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[2]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[3]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[4]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[5]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[6]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[7]")).click();
    // await driver.findElement(By.xpath("(//input[@type='checkbox'])[8]")).click();
    await driver.wait(until.elementLocated(By.xpath("//button[contains(.,'保 存')]")),5000).click();
    await driver.sleep(3000);
    // await driver.findElement(By.xpath("//button[contains(.,'保 存')]")).click();
    await switchmode.switchmode(driver, webdriver);
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[contains(.,'导 出')]"))
      .getText().then(textValue => {
        assert.equal('导 出', textValue,['控件导出属性设置失败']);
      });
    await driver.findElement(By.xpath("//button[contains(.,'导 入')]"))
      .getText().then(textValue => {
        assert.equal('导 入', textValue,['控件入属性设置失败']);
      });
    await driver.findElement(By.xpath("//button[contains(.,'新 建')]"))
      .getText().then(textValue => {
        assert.equal('新 建', textValue,['控件新建属性设置失败']);
      });
    // await driver.executeScript('window.location.reload();');
    await driver.sleep(5000);
    await newdatas.newdata(driver,webdriver)
    await driver.sleep(3000);
    // await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]"))
    const button4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button4.click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'查看')]]"))
      .getText().then(textValue => {
        assert.equal('查看', textValue,['控件查看属性设置失败']);
      });
    await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]"))
      .getText().then(textValue => {
        assert.equal('编辑', textValue,['控件编辑属性设置失败']);
      });
    await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'删除')]]"))
      .getText().then(textValue => {
        assert.equal('删除', textValue,['控件删除属性设置失败']);
      });
    await driver.sleep(2000);
    console.info('tabs控件设置完成')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  tabs,
};
