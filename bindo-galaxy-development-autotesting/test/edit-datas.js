// 新建dashboard数据
async function new_data( driver, webdriver, params) {
  const {
    By,
    until,
  } = webdriver;
  try{
    const loacl_rows1 = await driver.wait(until.elementLocated(By.xpath(`//td[contains(.,'${datatimes}')]`)),4100);
    await loacl_rows1.click();
    const button4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 5000);
    await button4.click();
    await driver.sleep(3000);
    const button_view = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'编辑')]]")),4000);
    await button_view.click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@id='name']")).clear();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`E023${datatimes}`);
    const save_buttom = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'保 存')]]")),5000);
    await save_buttom.click();
    await driver.sleep(5000);
  } catch(new_data) {
    console.error(new_data)
  }

}

module.exports={
  new_data,
}
