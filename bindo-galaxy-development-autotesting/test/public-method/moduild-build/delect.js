// 删除app
async function delect( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    // console.info('开始删除数据')
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")),4500).click();
    await driver.sleep(3000);
    await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'删除')]]")),3000).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-danger']")).click();
    await driver.sleep(4000);
    // console.info('删除数据完成')
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(6000);
  }catch(error){
    console.error(error)
  }
}

module.exports = {
  delect,
};
