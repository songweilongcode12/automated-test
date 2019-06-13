// testdata
// intergercontrol
const step ='2';
const minvalues = '0';
const maxvalues = '1000000000000';
// Decimaldata
const ccuracy = '0.5'
const decimalstep = '1.5'
const decimalmin = '-1.5'
const decimalmax = '1500000000000'
const parames = [
  Math.ceil(Math.random()*10000),
]
const controlname = parames.join('')
const parames1 = [
  'monkey',
  Math.ceil(Math.random()*100),
]
const showname1 = parames1.join('')
const parames2 = [
  'pandaes',
  Math.ceil(Math.random()*100),
]
const showname2 = parames2.join('')
// 新建app所用数据
const newappdata = (`v1.0.0_${new Date().getTime()}`);
// 编辑app数据所用的数据
const editappdata = (`E1.0.0${new Date().getTime()}`);
// 新建module数据所用的数据
const newmoduledata = (`v1.0.0${new Date().getTime()}`);
// 编辑module数据所用的数据
const editmoduledata = (`E1.0.0${new Date().getTime()}`);
// 拼接app的路径，为验证新建app的name在面包屑的正确位置上，
const arr = [
  "//td[contains(.,'",
  newappdata,
  "')]",
];
const apppath = arr.join('');
// 拼接进入form view视图的途径
const swithmodulepath = [
  "//a[contains(.,'",
  editmoduledata,
  "')]",
]
const moduelpath = swithmodulepath.join('');
// 拼接从form view 进入新建module页面的路径，为编辑module做准备
const swithmodule = [
  "//a[contains(.,'",
  editappdata,
  "')]",
]
const backmodulepath = swithmodule.join('');
// 控件名称参数
const parame = [
  Math.ceil(Math.random()*10000),
]
const controlsname = parame.join('')
// 控件字段
const field = (`testingname_${new Date().getTime()}`);
// 小数控件新建数据参数
const paramedecimal = [
  Math.ceil(Math.random()*1000.5),
]
const decimal = paramedecimal.join('')

module.exports={
  step,
  minvalues,
  maxvalues,
  ccuracy,
  decimalstep,
  decimalmin,
  decimalmax,
  controlname,
  showname1,
  showname2,
  newappdata,
  editappdata,
  newmoduledata,
  editmoduledata,
  apppath,
  moduelpath,
  backmodulepath,
  controlsname,
  field,
  decimal,
}
