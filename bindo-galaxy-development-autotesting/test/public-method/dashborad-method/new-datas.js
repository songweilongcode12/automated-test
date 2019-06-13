// const Alert = require('selenium-webdriver/lib/webdriver')
// const input = require('selenium-webdriver/lib/input')
const publicdata = require('../../basic-control/publicdata')

async function newdata( driver, webdriver,type,publicpath1,publicpath2,publicpath3) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始新建数据')
    await driver.sleep(2000);
    const newbutton = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'新 建')]]")),2500);
    await newbutton.click();
    await driver.sleep(2000)
    const datatimes = (`v1.0.0_${new Date().getTime()}`);
    const intesger= (`${new Date().getTime()}`)
    await driver.findElement(By.xpath("//input[@type='text']")).clear();
    await driver.sleep(2000)
    await driver.findElement(By.xpath("//input[@type='text']")).sendKeys(datatimes);
    await driver.sleep(3000)
    const save = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")).click();
    // console.info(save)
    await driver.sleep(2000)
    // console.info(save)
    if (save===null ){
      console.info('文本控件必填属性设置成功')
      if(type==='A' && publicpath1!==null){
        console.info('执行A方案')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).click();
      }else{
        console.info('不执行A方案')
      }
      if(type==='B' && publicpath1!==null){
        console.info('执行B方案')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),20000).clear();
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(datatimes);
      }else{
        console.info('不执行B方案')
      }
      if(type==='C' && publicpath1!==null && publicpath2!==null){
        console.info('执行C方案')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).click();
        await driver.sleep(2000);
        await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).click();
      }else{
        console.info('不执行C方案')
      }
      if (type==='D' && publicpath1!==null && publicpath2!==null){
        console.info('不执行D方案')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys()
        await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).sendKeys()
      }else{
        console.info('不执行D方案')
      }
      if(type==='E' && publicpath1!==null){
        console.info('执行整数控件的操作')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(intesger);
      }else{
        console.info('不执行E方案')
      }
      if(type==='F' && publicpath1!==null && publicpath2!==null && publicpath3!==null){
        console.info('执行F方案')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).click();
        await driver.wait(until.elementLocated(By.xpath(publicpath2)),5000).sendKeys('2013-03-23');
        await driver.wait(until.elementLocated(By.xpath(publicpath3)),5000).click();
      }else{
        console.info('不执行F方案')
      }
      if(type==='G' && publicpath1!==null){
        console.info('执行图片上传')
        await driver.sleep(8000)
        // await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).click();
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys('/common-file/image/tooopen_sy_161967094653.jpg');
        await driver.sleep(8000)
        // const alert = new Alert.TargetLocator().alert()
        // await driver.switchTo.alert().Alert()
        // await driver.sleep(3000)
        // await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).sendKeys(input.Key.CANCEL);
      }else{
        console.info('不执行图片上传')}
      if(type==='H' && publicpath1!==null ){
        console.info('执行小数控件数据')
        await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).sendKeys(publicdata.decimal);
      }else{
        console.info('不执行小数控件')
      }
      // if(type==='I' && publicpath1!==null){
      //   console.info('执行多行文本控件数据')
      //   await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).sendKeys(publicdata.decimal);
      // }else{
      //   console.info('不执行多行文本控件数据')
      // }
      // console.info('test_data')
      await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")),5000).click();
      await driver.sleep(5000);
    }else{
      console.info('不执行任何控件')
    }
    console.info('新建数据完成')

  } catch(error) {
    console.error(error)
  }
}

module.exports={
  newdata,
}
