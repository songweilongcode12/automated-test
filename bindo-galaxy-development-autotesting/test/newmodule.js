
// 新建普通module
async function Newmodule( driver, webdriver) {
  const {
    By,
    until,
  } = webdriver;
  try {
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    const newdatas1 = (`v1.0.0${new Date().getTime()}`);
    // await driver.findElement(By.xpath("//input[@id='name']")).sendKeys('M_'+params.createUuid());
    const moduklename = await driver.wait(until.elementLocated(By.xpath("//input[@id='name']")),1000);
    await moduklename.sendKeys(`N_${newdatas1}`);
    await driver.sleep(1000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.findElement(By.xpath("(//li[@aria-selected='true'])[1]")).click();
    // await driver.findElement(By.xpath("(//div[@class='ant-select-selection__rendered'])[3]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//div[@class='ant-select-selection__rendered'][contains(.,'新建模块')]")).click();
    await driver.sleep(3000);
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).sendKeys(`N_${newdatas1}`);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    await driver.sleep(2000);
    const entermodule = [
      "//td[contains(.,'",
      newdatas1,
      "')]",
    ];
    const path1 = entermodule.join('');
    await driver.sleep(3000)
    const getmodulename = await driver.wait(until.elementLocated(By.xpath(path1)),2000)
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas1,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');//刷新后会获取权限
    // await driver.sleep(8000)
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
    const newdatas2 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`N_${newdatas2}`);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.sleep(2000);
    await driver.findElement(By.xpath("//li[contains(.,'菜单目录')]")).click();
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom1 = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom1.click();
    const entermodule = [
      "//td[contains(.,'",
      newdatas2,
      "')]",
    ];
    const path1 = entermodule.join('');
    const getmodulename = await driver.findElement(By.xpath(path1))
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas2,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
    await driver.sleep(2000);
    // await driver.executeScript('window.location.reload();');
    // await driver.sleep(8000);
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
    const newdatas3 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//button[@type='button'][contains(.,'新 建')]")).click();
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`N_${newdatas3}`);
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
    const entermodule = [
      "//td[contains(.,'",
      newdatas3,
      "')]",
    ];
    const path1 = entermodule.join('');
    const getmodulename = await driver.findElement(By.xpath(path1))
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas3,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
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
    const newdatas4 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`N_${newdatas4}`);
    await driver.sleep(3000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click();
    await driver.findElement(By.xpath("//li[contains(.,'设置')]")).click();
    await driver.findElement(By.xpath("//input[@id='moduleName']")).sendKeys(`N_${newdatas4}`)
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const entermodule = [
      "//td[contains(.,'",
      newdatas4,
      "')]",
    ];
    const path1 = entermodule.join('');
    const getmodulename = await driver.findElement(By.xpath(path1))
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas4,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
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
    const newdatas5 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`N_${newdatas5}`);
    await driver.sleep(3000);
    await driver.findElement(By.xpath('//div[@title="模块"]')).click()
    await driver.findElement(By.xpath("//li[contains(.,'Wiki Only')]")).click()
    // await driver.findElement(By.xpath("//button[@class='ant-btn ant-btn-primary']")).click();
    // await driver.sleep(5000);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const entermodule = [
      "//td[contains(.,'",
      newdatas5,
      "')]",
    ];
    const path1 = entermodule.join('');
    const getmodulename = await driver.findElement(By.xpath(path1))
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas5,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
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
    const newdatas6 = (`v1.0.0${new Date().getTime()}`);
    await driver.findElement(By.xpath("//input[@id='name']")).sendKeys(`N_${newdatas6}`);
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
    await driver.findElement(By.xpath("//input[@placeholder='请输入模块名称']")).sendKeys(`N_${newdatas6}`);
    const savebuttom = await driver.wait(until.elementLocated(By.xpath("//button[@class='ant-btn ant-btn-primary']")),5000);
    await savebuttom.click();
    const entermodule = [
      "//td[contains(.,'",
      newdatas6,
      "')]",
    ];
    const path1 = entermodule.join('');
    const getmodulename = await driver.findElement(By.xpath(path1))
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
    const swithmodulepath = [
      "//a[contains(.,'",
      newdatas6,
      "')]",
    ]
    const moduelpath = swithmodulepath.join('');
    await driver.findElement(By.xpath(moduelpath)).click();
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

