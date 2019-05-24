const {
  login,
}
= require('./login');
const {
  switchlanguage,
}
=require('./switchlanguage')
// // const {
// //   loginout,
// // }
// // = require('./login-out');

// const {
//   resetpassword,
// }
// = require('./reset-password');
const {
  switchshop,
}
= require('./switchshop');
// const {
//   // NewappAppstore,
//   // NewappSystem,
//   Newappcompany,
// }
// = require('./newapp');
// const {
//   EditApp,
// }
// =require('./editapp');
// const {
//   delectdata,

// }=require('./delectdata');
const {
  entermodule,
}=require('./enter-module');

// const {
//   Newmodule,
//   // NewmoduleMenufolder,
//   // NewmoduleEMbedde,
//   // NewmoduleSetting,
//   // NewmoduleWikionly,
//   // inheritmodule,

// }
// = require('./newmodule');

// const {
//   editmodule,
// //  moduleMenufolder,
//   // eitmoduleEMbedde,
//   // editmoduleSetting,
//   // editmoduleWikionly,
// }
// =require('./editmodule');

const {
  switchmode,
}
=require('./switchmode');

const {
  switchpath,
}
=require('./switchpath');

// const {
//   athorization,
// }
// =require('./permisson');

// const {
//   newdata,
// }
// =require('./new-datas');
const {
  foremview,
}
=require('./enter-formview')
// const {
//   tabs,
// }
// =require('./tabscontro')
// const {
//   notecontrol,
// }
// =require('./notecontrol')
// const {
//   lablscontrol,
// }
// =require('./labelcontrol')
// const {
//   textcontrol,
// }
// =require('./textcontrol')
// const {
//   multilinktext,
// }
// =require('./multi-linktext')
// const {
//   intergercontrol,
// }
// =require('./intergercontrol')

// const {
//   decimalcontrol,
// }
// =require('./decimalcontrol')
// const {
//   dropcontrol,
// }
// =require('./dropdowncontrol')
const {
  manydropcontrol,
}
=require('./manydropcontrol')

async function test(driver, webdriver, params) {
  await login(driver, webdriver, params)
  await switchlanguage(driver, webdriver)
  await switchshop(driver, webdriver, params)
  await switchmode(driver, webdriver)
  await switchpath(driver, webdriver)
  // await Newappcompany(driver, webdriver)
  // await switchpath(driver, webdriver, params)
  // await NewappAppstore(driver, webdriver, params)
  // await Newappcompany(driver, webdriver,params)
  // await EditApp(driver, webdriver, params)
  await entermodule(driver, webdriver)
  // await Newmodule(driver, webdriver, params)
  await foremview(driver, webdriver)
  // await dropcontrol(driver,webdriver)
  await manydropcontrol(driver, webdriver)
  // await textcontrol(driver,webdriver)
  // await multilinktext(driver,webdriver)
  // await intergercontrol(driver,webdriver)
  // await decimalcontrol(driver, webdriver)
  // await notecontrol(driver,webdriver)
  // await tabs(driver, webdriver)
  // await Newmodule(driver, webdriver, params)
  // await editmodule(driver, webdriver, params)
  // await switchmode(driver, webdriver, params)
  // await athorization(driver, webdriver, params)
  // await switchmode(driver, webdriver, params)
  // await switchmode(driver, webdriver, params)
  // await newdata(driver, webdriver, params)
  // await NewmoduleMenufolder(driver,webdriver, params)
  // await editmoduleMenufolder(driver, webdriver, params)
  // await delectdata(driver, webdriver, params)
  // await switchmode(driver, webdriver, params)
  // await switchpath(driver, webdriver, params)
  // await delectdata(driver, webdriver, params)
  // await loginout(driver, webdriver)
  // await resetpassword(driver, webdriver)
  // await athorization(driver, webdriver, params)
  // await switchmode(driver, webdriver, params)
  // await switchpath(driver, webdriver, params)
  // await entermodule(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await switchpath(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await NewmoduleEMbedde(driver,webdriver, params)s
  // await deitmoduleEMbedde(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await editmoduleSetting(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await NewmoduleWikionly(driver,webdriver, params)
  // await editmoduleWikionly(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await inheritmodule(driver, webdriver, params)
  // await editmodule(driver, webdriver, params)
  // await delect(driver, webdriver, params)
  // await NewappSystem(driver,webdriver,params)
  // await EditApp(driver, webdriver, params)
  // await entermodule(driver, webdriver, params)
  // await Newmodule(driver, webdriver, params)
  // await NewmoduleMenufolder(driver,webdriver, params)
  // await NewmoduleEMbedde(driver,webdriver, params)
  // await NewmoduleSetting(driver,webdriver, params)
  // await NewmoduleWikionly(driver,webdriver, params)
  // await Newappcompany(driver, webdriver, params)
  // await EditApp(driver, webdriver, params)
  // await entermodule(driver, webdriver, params)
  // await Newmodule(driver, webdriver, params)
  // await NewmoduleMenufolder(driver,webdriver, params)
  // await NewmoduleEMbedde(driver,webdriver, params)
  // await NewmoduleSetting(driver,webdriver, params)
  // await NewmoduleWikionly(driver,webdriver, params)
  // await delectApp(driver, webdriver, params)

}
module.exports = test;
