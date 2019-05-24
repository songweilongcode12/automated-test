async function foremview(driver, webdriver){
  const {
    By,
  }=webdriver;
  try {
    console.info('enter formview ')
    await driver.sleep(2000);
    await driver.findElement(By.xpath('(//li[@data="[object Object]"])[last()]')).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//div[@class='bg-r-module-views-item-title' and contains(text(),'表单视图')]")).click();
    await driver.sleep(2000);
    console.info('forview enter success')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  foremview,
};
