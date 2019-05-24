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
const datatimes = (`v1.0.0_${new Date().getTime()}`);
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
  datatimes,
}
