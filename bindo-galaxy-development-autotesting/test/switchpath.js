// Switch mode
async function switchpath( driver, webdriver,) {
  const {
    By,
    until,
  } = webdriver;
  try{
    console.info('切换到应用路径')
    const enterapppath = await driver.wait(until.elementLocated(By.xpath("//a[contains(.,'应用')]")),8000);
    await enterapppath.click();
    await driver.sleep(3000);
    console.info('应用切换结束')
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  switchpath,
};
