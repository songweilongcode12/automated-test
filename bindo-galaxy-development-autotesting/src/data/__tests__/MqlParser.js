import { formulaToMql, mqlToFormula } from '../MqlParser';
import operatorConstants from '../../constants/operator'
import mqlKindConstants from '../../constants/mqlKind'

const astString1 = '1';
it(`AST to formula ' ${astString1} '`, () => {

  const mql = formulaToMql(astString1);
  expect(mql.value).toEqual(1);
});

const formulaAst1 = {
  kind: mqlKindConstants.LITERAL,
  value: 1,
};
it(`String to AST ' ${formulaAst1} '`, () => {

  const formula = mqlToFormula(formulaAst1);
  expect(formula).toEqual('1');
});

const astString2 = '$.self.name';
it(`AST to formula ' ${astString2} '`, () => {

  const mql = formulaToMql(astString2);
  expect(mql.value).toEqual('$.self.name');
});

const formulaAst2 = {
  kind: mqlKindConstants.VARIABLE,
  value: '$.self.name',
};
it(`String to AST ' ${formulaAst2} '`, () => {

  const formula = mqlToFormula(formulaAst2);
  expect(formula).toEqual('$.self.name');
});

const astString3 = '$.self.age > 18';
it(`AST to formula ' ${astString3} '`, () => {

  const mql = formulaToMql(astString3);
  expect(mql.kind).toEqual(mqlKindConstants.BINARY);
  expect(mql.operator).toEqual(operatorConstants.GT);
  expect(mql.left.kind).toEqual(mqlKindConstants.VARIABLE);
  expect(mql.left.value).toEqual('$.self.age');
  expect(mql.right.kind).toEqual(mqlKindConstants.LITERAL);
  expect(mql.right.value).toEqual(18);
});

const formulaAst3 = {
  kind: mqlKindConstants.BINARY,
  operator: operatorConstants.GT,
  left: {
    kind: mqlKindConstants.VARIABLE,
    value: '$.self.age',
  },
  right: {
    kind: mqlKindConstants.LITERAL,
    value: 18,
  },
};
it(`String to AST ' ${formulaAst3} '`, () => {

  const formula = mqlToFormula(formulaAst3);
  expect(formula).toEqual('$.self.age>18');
});

const astString4 = '$.self.age > 18 && $.self.count < 100 || total > 20';
it(`AST to formula ' ${astString4} '`, () => {

  const mql = formulaToMql(astString4);
  expect(mql.kind).toEqual(mqlKindConstants.LOGICAL);
  expect(mql.operator).toEqual(operatorConstants.OR);
  expect(mql.left.kind).toEqual(mqlKindConstants.LOGICAL);
  expect(mql.left.operator).toEqual(operatorConstants.AND);
});

const formulaAst4 = {
  kind: mqlKindConstants.LOGICAL,
  operator: operatorConstants.OR,
  left: {
    kind: mqlKindConstants.LOGICAL,
    operator: operatorConstants.AND,
    left: {
      kind: mqlKindConstants.BINARY,
      operator: operatorConstants.GT,
      left: {
        kind: mqlKindConstants.VARIABLE,
        value: '$.self.age',
      },
      right: {
        kind: mqlKindConstants.LITERAL,
        value: 18,
      },
    },
    right: {
      kind: mqlKindConstants.BINARY,
      operator: operatorConstants.LT,
      left: {
        kind: mqlKindConstants.VARIABLE,
        value: '$.self.count',
      },
      right: {
        kind: mqlKindConstants.LITERAL,
        value: 100,
      },
    },
  },
  right: {
    kind: mqlKindConstants.BINARY,
    operator: operatorConstants.GT,
    left: {
      kind: mqlKindConstants.VARIABLE,
      value: 'total',
    },
    right: {
      kind: mqlKindConstants.LITERAL,
      value: 20,
    },
  },
};
it(`String to AST ' ${formulaAst4} '`, () => {

  const formula = mqlToFormula(formulaAst4);
  expect(formula).toEqual('($.self.age>18&&$.self.count<100)||total>20');
});
