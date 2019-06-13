const {
  imagecontrol,
}
=require('./basic-control/Imagecontrol')

async function test(driver, webdriver,params ) {
  await imagecontrol(driver,webdriver,params)
}
module.exports = test;
