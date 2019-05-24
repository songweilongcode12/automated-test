const Actions = require('selenium-webdriver/lib/actions');
const assert = require('assert')
// const aa = require('selenium-webdriver/testing/')
// const {
//   switchmode,
// }
// =require
const switchmode = require('./switchmode');
// const newdatas = require('./new-datas');

async function notecontrol(driver, webdriver){
  const {
    By,
    until,
  }=webdriver;
  try {
    await driver.sleep(4000);
    console.info('执行note控件操作：')
    const action = new Actions.LegacyActionSequence(driver);
    const start = await driver.findElement(By.xpath("//div[@class='bindo-galaxy-editor-widgets-option-text' and contains(text(),'笔记')]"));
    const local = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]"))
    await driver.sleep(3000);
    action.dragAndDrop(start,local).perform();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),3000).click();
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//i[contains(@class,'fa fa-expand')]")),3000).click();
    await driver.wait(until.elementLocated(By.xpath("//div[@contenteditable='true']")),4000).sendKeys('(Module build automated test input test for the note control, do not delete, thank you for your cooperation module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作)!  (module build自动化测试对note控件输入测试，请勿删除，谢谢合作! Module build automated test input test for the note control, do not delete, thank you for your cooperation module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作 module build自动化测试对note控件输入测试，请勿删除，谢谢合作!)');
    await driver.sleep(2000);
    await driver.wait(until.elementLocated(By.xpath("//i[contains(@class,'fa fa-compress')]")),2000).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'OK')]")).click();
    await driver.sleep(2000);
    const controlname = await driver.findElement(By.xpath("(//input[contains(@type,'text')])[2]"))
    await controlname.sendKeys('Testing note!');
    const field = [
      'test_note_',
      Math.ceil(Math.random()*10000),
    ];
    const path1 = field.join('');
    console.info(path1);
    await driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(path1)
    await driver.findElement(By.xpath("(//input[@type='text'])[4]")).sendKeys('this is Testing!')
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'保 存')]")),3000).click();
    // await driver.sleep(4000);
    await driver.sleep(5000);
    await switchmode.switchmode(driver,webdriver);
    await driver.sleep(6000);
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
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button'][contains(.,'新 建')]")),2000).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//div[@class='fr-element fr-view fr-disabled']")).getText().then(textValue => {
      if(textValue.match('Module build automated test')){
        console.info('note内容与属性输入的一致');}else
      {
        console.info('note内容与属性输入的不相符');
      };
      console.info(textValue);
    });
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'取 消')]")).click();

  } catch(error) {
    console.error(error)
  }
}

module.exports={
  notecontrol,
};
