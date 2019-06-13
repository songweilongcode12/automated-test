// Switch mode
async function switchmode( driver, webdriver,) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('开始从dashboard模式切换到module build模式')
    const switchbutton = await driver.wait(until.elementLocated(By.xpath("//button[contains(@class,'ant-btn bg-c-header-node-galaxy-state-icon')]")),3000);
    await switchbutton.click();
    await driver.sleep(3000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(10000);
    // console.info('test3:模式切换结束')
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  switchmode,

};
