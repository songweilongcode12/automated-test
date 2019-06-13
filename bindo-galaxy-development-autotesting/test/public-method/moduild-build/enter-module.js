// 进入新建module view
async function entermodule( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    console.info('进入module路径')
    // await driver.executeScript('window.location.reload();');
    await driver.sleep(2000);
    await driver.executeScript( 'window.scrollTo(0,document.body.scrollHeight);');
    const button4 = await driver.wait(until.elementLocated(By.xpath("(//div[@class='bg-galaxy-dropdown-action ant-dropdown-trigger'])[last()]")), 8000);
    await button4.click();
    const buttonview = await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and ./span[contains(text(),'视图')]]")),6000);
    await buttonview.click();
    await driver.sleep(4000);
    console.info('成功进入module路径')
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  entermodule,
}
