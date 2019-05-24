// 删除app
async function delectdata( driver, webdriver,) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(3000);
    const lastrows4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")),4500);
    await lastrows4.click();
    await driver.sleep(3000);
    const delectbuttom = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'删除')]]")),3000);
    await delectbuttom.click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-danger']")).click();
    await driver.sleep(4000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(6000);4
  }catch(error){
    console.error(error)
  }
}

module.exports = {
  delectdata,
};
