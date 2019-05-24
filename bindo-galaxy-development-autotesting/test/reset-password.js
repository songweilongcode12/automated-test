async function resetpassword(driver, webdriver){
  const {
    By,
  }=webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//a[@href='/password/forgot']")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@id='email']")).sendKeys('grant.song@bindo.com');
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//button[@type='submit']")).click();
    // const actions = driver.actions();
    // await Actions(driver).move(singout).perform();
    // const action = new Actions(driver);
    // action.moveToElement(singout).click().perform();
    // await instance.mouseMove(singout).perform();
    // await driver(actions());
  } catch(error) {
    console.error(error)
  }
}

module.exports={
  resetpassword,
};
