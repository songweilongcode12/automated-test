// const intergercontrol = require('./intergercontrol')
// await interger
// 新建dashboard数据
async function newdata( driver, webdriver,type,publicpath1,publicpath2) {
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
    const save = await driver.findElement(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")).click()
    await driver.sleep(2000)
    if(save==null){
      console.info('文本控件必填属性设置成功')
    }else{
      console.info('文本控件必填属性设置失败')
    }
    if(type==='A' && publicpath1!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).click();
    }else{
      console.info('不执行A方案')
    }
    if(type==='B' && publicpath1!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),20000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(datatimes);
    }else{
      console.info('不执行B方案')
    }
    if(type==='C' && publicpath1!==null && publicpath2!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).click();
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).click();
    }else{
      console.info('不执行C方案')
    }
    if (type==='D' && publicpath1!==null && publicpath2!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys()
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).sendKeys()
    }else{
      console.info('不执行D方案')
    }
    if(type==='E' && publicpath1!==null){
      console.info('执行整数控件的操作')
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(intesger);
    }else{
      console.info('不执行F方案')
    }
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")),5000).click();
    await driver.sleep(2000);
    // await intergercontrol.intergercontrol()；
    console.info('新建数据完成')
  } catch(error) {
    console.error(error)
  }

}

module.exports={
  newdata,
}
