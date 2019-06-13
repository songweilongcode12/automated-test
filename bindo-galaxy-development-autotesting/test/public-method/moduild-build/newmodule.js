const publicdata = require('../../basic-control/publicdata')

// 新建普通module
async function Newmodule( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    console.info('开始新建module')
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    const moduklename = await driver.wait(until.elementLocated(By.xpath("//input[@id='name']")),1000);
    await moduklename.sendKeys(publicdata.newmoduledata);
    await driver.sleep(1000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.findElement(By.xpath("(//li[@aria-selected='true'])[1]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//div[@class='ant-select-selection__rendered'][contains(.,'新建模块')]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).sendKeys(publicdata.newmoduledata);
    await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000).click();
    await driver.sleep(5000);
    console.info('module 新建完成')
    // 刷新后会获取权限
  }catch (error){
    console.error(error)
  }
}

// 新建Menufolder
async function NewmoduleMenufolder( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;

  try {
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(publicdata.newmoduledata);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//li[contains(.,'菜单目录')]")).click();
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom1 = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom1.click();
    // const getmodulename = await driver.findElement(By.xpath(publicdata.moduelpath))
    // const modulename = getmodulename.getText()
    // await getmodulename.click()
    // await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
    //   .getText().then(textValue => {
    //     if(textValue.match(modulename)){
    //       console.info('新建module检测面包屑成功');}else
    //     {
    //       console.info('新建module检测面包屑失败');
    //     };
    //     console.info(textValue);
    //   });
    // await driver.findElement(By.xpath( publicdata.backmodulepath)).click();
    // await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    await driver.sleep(8000);
  }catch (error) {
    console.error(error)
  }

}

// 新建Newmodule EMbedde
async function NewmoduleEMbedde( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(publicdata.newappdata);
    await driver.sleep(3000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.findElement(By.xpath("//li[contains(.,'嵌入')]")).click();
    await driver.findElement(By.xpath("//div[@class='ant-select-selection__rendered'][contains(.,'新建模块')]")).click();
    await driver.findElement(By.xpath("(//li[contains(@role,'option')])[6]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//textarea[@class='ant-input']")).sendKeys('https://drive.google.com/drive/folders/1eWTnDvohcDlaKKaSB9cBekwVskBxfIZS');
    await driver.sleep(1000);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const getmodulename = await driver.wait(until.elementLocated(By.xpath(publicdata.moduelpath)),5000);
    const modulename = getmodulename.getText();
    await getmodulename.click()
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(modulename)){
          console.info('新建module检测面包屑成功');}else
        {
          console.info('新建module检测面包屑失败');
        };
        console.info(textValue);
      });
    await driver.findElement(By.xpath(publicdata.backmodulepath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  } catch(error) {
    console.error(error)

  }

}

// 新建setting
async function NewmoduleSetting( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(publicdata.newmoduledata);
    await driver.sleep(3000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.findElement(By.xpath("//li[contains(.,'设置')]")).click();
    await driver.findElement(By.xpath("//input[@id='moduleName']")).sendKeys(publicdata.newmoduledata)
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const getmodulename = await driver.findElement(By.xpath(publicdata.moduelpath))
    const modulename = getmodulename.getText()
    await getmodulename.click()
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(modulename)){
          console.info('新建module检测面包屑成功');}else
        {
          console.info('新建module检测面包屑失败');
        };
        console.info(textValue);
      });
    await driver.findElement(By.xpath(publicdata.backmodulepath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
  } catch (error) {
    console.error(error)
  }

}
// 新建wiki only
async function NewmoduleWikionly( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(publicdata.newmoduledata);
    await driver.sleep(3000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click()
    await driver.findElement(By.xpath("//li[contains(.,'Wiki Only')]")).click()
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const getmodulename = await driver.findElement(By.xpath(publicdata.moduelpath))
    const modulename = getmodulename.getText()
    await getmodulename.click()
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(modulename)){
          console.info('新建module检测面包屑成功');}else
        {
          console.info('新建module检测面包屑失败');
        };
        console.info(textValue);
      });
    await driver.findElement(By.xpath(publicdata.backmodulepath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
    // await driver.findElement(By.xpath('//a[@href="/builder/slugs/j8f/apps"]')).click();
    // await driver.sleep(3000);

  } catch(error) {
    console.error(error)
  }
}

// 新建继承module
async function inheritmodule( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(publicdata.newmoduledata);
    await driver.sleep(1000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("(//li[@aria-selected='true'])[1]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//div[@title='新建模块']")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//li[@style='user-select: none;' and contains(text(),'继承自其它模块')]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("(//div[contains(@class,'ant-select-selection__rendered')])[4]")).click();
    await driver.sleep(4000);
    await driver.findElement(By.xpath("//li[contains(@aria-selected,'false')][8]")).click();
    await driver.sleep(1000);
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).sendKeys(publicdata.newmoduledata);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const getmodulename = await driver.findElement(By.xpath(publicdata.moduelpath))
    const modulename = getmodulename.getText()
    await getmodulename.click()
    await driver.findElement(By.className('bindo-galaxy-module-breadcrumb ant-breadcrumb'))
      .getText().then(textValue => {
        if(textValue.match(modulename)){
          console.info('新建module检测面包屑成功');}else
        {
          console.info('新建module检测面包屑失败');
        };
        console.info(textValue);
      });
    await driver.findElement(By.xpath(publicdata.backmodulepath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);

  }catch (error) {
    console.error(error)
  }
}

module.exports = {
  Newmodule,
  NewmoduleMenufolder,
  NewmoduleEMbedde,
  NewmoduleSetting,
  NewmoduleWikionly,
  inheritmodule,
};

