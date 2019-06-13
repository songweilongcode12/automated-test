// 新建dashboard数据
const publicdata = require('../../basic-control/publicdata')

async function editdata(driver, webdriver,type,publicpath1,publicpath2,publicpath3) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始编辑数据')
    const datatimes = (`E_001${new Date().getTime()}`);
    const intesger = (`${new Date().getTime()}`);
    // await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[1]")),5000).click()
    await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000).click();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@type='text']")).clear();
    await driver.findElement(By.xpath("//input[@type='text']")).sendKeys(`E023${datatimes}`);
    await driver.sleep(2000);
    if(type==='A' && publicpath1!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).click();
    }else{
      console.info('不执行A方案')
    }
    if(type==='B' && publicpath1!==null){
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),20000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(datatimes);
      await driver.sleep(2000)
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
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys();
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).sendKeys();
    }else{
      console.info('不执行D方案')
    }
    if(type==='E' && publicpath1!==null){
      console.info('执行整数控件的操作')
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),2000).sendKeys(intesger);
    }else{
      console.info('不执行F方案')
    }
    if(type==='F' && publicpath1!==null && publicpath2!==null && publicpath3!==null){
      console.info('执行F方案')
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).click();
      // await driver.wait(until.elementLocated(By.xpath(publicpath2)),5000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),5000).click();
      await driver.wait(until.elementLocated(By.xpath(publicpath3)),5000).click();
    }else{
      console.info('不执行F方案')
    }
    if(type==='G' && publicpath1!==null && publicpath2!==null){
      console.info('执行图片上传')
      // await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).click();
      await driver.sleep(5000)
      await driver.wait(until.elementLocated(By.xpath(publicpath2)),2000).sendKeys('/common-file/image/tooopen_sy_161967094653.jpg')
      await driver.sleep(5000);
    }else{
      console.info('不执行图片上传')
    }
    if(type==='H' && publicpath1!==null ){
      console.info('执行整数控件数据')
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).clear();
      await driver.wait(until.elementLocated(By.xpath(publicpath1)),5000).sendKeys(publicdata.decimal);
    }else{
      console.info('不执行整数控件')
    }
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")),5000).click();
    await driver.sleep(5000);
    console.info('数据编辑结束')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  editdata,
}
