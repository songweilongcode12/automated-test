// 新建dashboard数据
async function editdata(driver, webdriver,type,publicpath1,publicpath2) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始编辑数据')
    const datatimes = (`E_001${new Date().getTime()}`);
    const intesger = (`${new Date().getTime()}`);
    // await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[1]")),5000).click()
    const button4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button4.click();
    await driver.sleep(3000);
    const buttonview = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await buttonview.click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@type='text']")).clear();
    await driver.findElement(By.xpath("//input[@type='text']")).sendKeys(`E023${datatimes}`);
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
    // eslint-disable-next-line no-cond-assign
    // if(publicpath==null){
    //   console.info('不执行')}else
    // {await driver.wait(until.elementLocated(By.xpath(publicpath)),3000).clear();
    //   await driver.wait(until.elementLocated(By.xpath(publicpath)),3000).sendKeys(datatimes);
    // }
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")),5000).click();;
    await driver.sleep(5000);
    console.info('数据编辑结束')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  editdata,
}
