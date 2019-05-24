import recast from 'recast'
import lodash from 'lodash'
import operatorConstants from '../constants/operator'
import mqlKindConstants from '../constants/mqlKind'

const operatorRef = {
  '+': operatorConstants.ADD,
  '-': operatorConstants.SUB,
  '*': operatorConstants.MULTI,
  '/': operatorConstants.DIVISION,
  '==': operatorConstants.EQ,
  '===': operatorConstants.EQ,
  '>': operatorConstants.GT,
  '>=': operatorConstants.EGT,
  '<': operatorConstants.LT,
  '<=': operatorConstants.ELT,
  '!=': operatorConstants.NOT_EQ,
  '!==': operatorConstants.NOT_EQ,
  'in': operatorConstants.IN,
  '&&': operatorConstants.AND,
  '||': operatorConstants.OR,
}

const logicalOperator = new Set([
  operatorConstants.AND,
  operatorConstants.OR,
])

const operatorRef2 = {
  [operatorConstants.ADD]: '+',
  [operatorConstants.SUB]: '-',
  [operatorConstants.MULTI]: '*',
  [operatorConstants.DIVISION]: '/',
  [operatorConstants.EQ]: '==',
  [operatorConstants.GT]: '>',
  [operatorConstants.EGT]: '>=',
  [operatorConstants.LT]: '<',
  [operatorConstants.ELT]: '<=',
  [operatorConstants.NOT_EQ]: '!=',
  [operatorConstants.IN]: 'in',
  [operatorConstants.AND]: '&&',
  [operatorConstants.OR]: '||',
}

const mqlKind = {
  [operatorConstants.EQ]: mqlKindConstants.BINARY,
  [operatorConstants.NOT_EQ]: mqlKindConstants.BINARY,
  [operatorConstants.GT]: mqlKindConstants.BINARY,
  [operatorConstants.EGT]: mqlKindConstants.BINARY,
  [operatorConstants.LT]: mqlKindConstants.BINARY,
  [operatorConstants.ELT]: mqlKindConstants.BINARY,
  [operatorConstants.AND]: mqlKindConstants.LOGICAL,
  [operatorConstants.OR]: mqlKindConstants.LOGICAL,
  [operatorConstants.ADD]: mqlKindConstants.MATH,
  [operatorConstants.SUB]: mqlKindConstants.MATH,
  [operatorConstants.MULTI]: mqlKindConstants.MATH,
  [operatorConstants.DIVISION]: mqlKindConstants.MATH,
}

// String to MQL

const parseExpression = expression => {
  try {
    const { type } = expression;
    // eslint-disable-next-line
    return astParser[`parse${type}`](expression)
  } catch (error) {
    log.error(error);
  }
}

const parseLiteral = literal => ({
  kind: mqlKindConstants.LITERAL,
  value: literal.value,
})

const parseIdentifier = identifier => ({
  kind: mqlKindConstants.IDENTIFIER,
  value: identifier.name,
})

const parseMemberObject = memberObject => {
  const {
    object,
    property,
    name,
  } = memberObject;

  if (lodash.isObject(object)) {
    return [...parseMemberObject(object), property.name];
  } else {
    return [name];
  }
}

const parseMemberExpression = memberExpression => {
  const memberArr = parseMemberObject(memberExpression);
  let value = '';
  if (lodash.isArray(memberArr)) {
    value = memberArr.join('.');
  }

  return {
    kind: mqlKindConstants.VARIABLE,
    value,
  }
}

const parseBinaryExpression = binaryExpression => {
  const {
    left,
    operator,
    right,
  } = binaryExpression;

  const oper = operatorRef[operator];

  return {
    kind: mqlKind[oper],
    left: parseExpression(left),
    operator: oper,
    right: parseExpression(right),
  }
}

const parseSequenceExpression = sequenceExpression => {
  const {
    expressions,
  } = sequenceExpression;

  const sequences = [];
  if (lodash.isArray(expressions)) {
    expressions.forEach(item => {
      sequences.push(parseExpression(item))
    })
  }

  return sequences;
}

const parseArrayExpression = arrayExpression => {
  const {
    elements,
  } = arrayExpression;

  const array = [];
  if (lodash.isArray(elements)) {
    elements.forEach(item => {
      array.push(parseExpression(item))
    })
  }

  return {
    kind: mqlKindConstants.ARRAY,
    elements: array,
  };
}

const parseCallExpression = callExpression => {
  const {
    arguments: args,
    callee,
  } = callExpression;

  const argsMql = [];
  if (lodash.isArray(args)) {
    args.forEach(item => {
      argsMql.push(parseExpression(item))
    })
  }

  const calleeMql = parseExpression(callee);
  if (lodash.isObject(calleeMql)) {
    calleeMql.kind = mqlKindConstants.CALL_LITERAL
  }
  const callMql = {
    kind: 'CALL',
    callee: calleeMql,
    arguments: argsMql,
  }

  return callMql;
}

const astParser = {
  parseLiteral,
  parseBinaryExpression,
  parseIdentifier,
  parseMemberExpression,
  parseSequenceExpression,
  parseLogicalExpression: parseBinaryExpression,
  parseCallExpression,
  parseArrayExpression,
}

export const formulaToMql = formula => {
  formula = formula || '';
  const ast = recast.parse(formula);
  let programBody = [];
  if (ast && ast.program && lodash.isArray(ast.program.body)) {
    programBody = ast.program.body;
  }

  if (programBody.length > 0) {
    const { expression } = programBody[0];
    return parseExpression(expression);
  } else {
    return {};
  }
}

// MQL to String

const parseLITERAL = literal => {
  let {
    value,
  } = literal;

  if (lodash.isString(value)) {
    value = `'${value}'`;
  }

  return [value];
}

const parseIDENTIFIER = identifier => {
  const {
    value,
  } = identifier;

  return [value];
}

const parseCALLLITERAL = literal => {
  const {
    value,
  } = literal;

  return value;
}

const parseVARIABLE = variable => {
  const {
    value,
  } = variable;

  return [value];
}

const parseARRAY = array => {
  const {
    elements = [],
  } = array;

  const formulaNode = ['['];

  const params = [];
  if (lodash.isArray(elements)) {
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i];
      // eslint-disable-next-line
      params.push(...mqlParser[`parse${item.kind}`](item));
    }
  }

  if (params.length > 1) {
    formulaNode.push(params.join(', '));
  } else if (params.length > 0) {
    formulaNode.push(...params);
  }

  formulaNode.push(']');

  return [formulaNode.join('')];
}

const parseLOGICAL = logical => {
  const {
    left,
    operator,
    right,
  } = logical;

  return [
    logicalOperator.has(operator) ? '(' : '',
    // eslint-disable-next-line
    ...mqlParser[`parse${left.kind}`](left),
    operatorRef2[operator],
    // eslint-disable-next-line
    ...mqlParser[`parse${right.kind}`](right),
    logicalOperator.has(operator) ? ')' : '',
  ];
};

const parseCALL = call => {
  const formulaNode = [];
  const params = [];

  const {
    callee,
    arguments: args = [],
  } = call;

  let operator;
  if (lodash.isObject(callee) && callee.kind) {
    // eslint-disable-next-line
    operator = mqlParser[`parse${callee.kind}`](callee);
  }

  if (lodash.isString(operator) && operator.length > 0) {
    formulaNode.push(operator);
    formulaNode.push('(');

    if (lodash.isArray(args)) {
      // const rightArr = [];
      for (let i = 0; i < args.length; i++) {
        const item = args[i];
        // eslint-disable-next-line
        params.push(...mqlParser[`parse${item.kind}`](item));
      }
      // params.push(rightArr);
    }

    if (params.length > 1) {
      formulaNode.push(params.join(', '));
    } else if (params.length > 0) {
      formulaNode.push(...params);
    }

    formulaNode.push(')');
  }

  return [formulaNode.join('')];
}

const mqlParser = {
  parseLOGICAL,
  parseLITERAL,
  parseVARIABLE,
  parseBINARY: parseLOGICAL,
  parseCALL,
  parseCALL_LITERAL: parseCALLLITERAL,
  parseARRAY,
  parseIDENTIFIER,
}

export const mqlToFormula = mql => {
  if (!lodash.isObject(mql)) {
    return ''
  }

  const {
    kind,
  } = mql;
  const arr = mqlParser[`parse${kind}`](mql)

  if (lodash.isArray(arr)) {
    if (arr.length > 0 && arr[0] === '(') {
      arr.pop();
      arr.shift();
    }
    return arr.join('')
  }

  return '';
}

// run MQL

const hasOperatorSet = new Set([
  mqlKindConstants.BINARY,
  mqlKindConstants.LOGICAL,
  mqlKindConstants.MATH,
]);

const notOperatorSet = new Set([
  mqlKindConstants.VARIABLE,
  mqlKindConstants.LITERAL,
  mqlKindConstants.CALL,
]);

const getRunKey = (mql) => {
  let key = null;
  if (lodash.isObject(mql)) {
    if (hasOperatorSet.has(mql.kind)) {
      key = mql.operator;
    } else if (notOperatorSet.has(mql.kind)) {
      key = mql.kind;
    }
  }

  return key;
}

const runVARIABLE = (mql, props = {}) => {
  if (
    lodash.isObject(mql)
    && mql.kind === mqlKindConstants.VARIABLE
    && lodash.isString(mql.value)
    && lodash.isFunction(props.selfFieldCallback)
  ) {
    if (mql.value.indexOf('$.self.') > -1) {
      return props.selfFieldCallback(mql.value.replace('$.self.', ''));
    }
  }

  return;
}

const runLITERAL = (mql) => {
  if (
    lodash.isObject(mql)
    && mql.kind === mqlKindConstants.LITERAL
    // eslint-disable-next-line
    && mql.hasOwnProperty('value')
  ) {
    return mql.value;
  }

  return;
}

const runBinary = (mql, props = {}) => {
  if (
    lodash.isObject(mql)
    && lodash.isObject(mql.left)
    && lodash.isObject(mql.right)
  ) {
    let leftValue;
    let rightValue;

    const leftKey = getRunKey(mql.left);
    if (leftKey) {
      // eslint-disable-next-line
      leftValue = mqlExecuter[`run${leftKey}`](mql.left, props);
    }

    const rightKey = getRunKey(mql.right);
    if (rightKey) {
      // eslint-disable-next-line
      rightValue = mqlExecuter[`run${rightKey}`](mql.right, props);
    }

    if (mql.operator === operatorConstants.EQ) {
      // eslint-disable-next-line
      return leftValue == rightValue;
    } else if (mql.operator === operatorConstants.NOT_EQ) {
      // eslint-disable-next-line
      return leftValue != rightValue;
    } else if (mql.operator === operatorConstants.GT) {
      // eslint-disable-next-line
      return leftValue > rightValue;
    } else if (mql.operator === operatorConstants.EGT) {
      // eslint-disable-next-line
      return leftValue >= rightValue;
    } else if (mql.operator === operatorConstants.LT) {
      // eslint-disable-next-line
      return leftValue < rightValue;
    } else if (mql.operator === operatorConstants.ELT) {
      // eslint-disable-next-line
      return leftValue <= rightValue;
    }
  }

  return false;
}

const runMATH = (mql, props = {}) => {
  if (
    lodash.isObject(mql)
    && lodash.isObject(mql.left)
    && lodash.isObject(mql.right)
  ) {
    let leftValue;
    let rightValue;

    const leftKey = getRunKey(mql.left);
    if (leftKey) {
      // eslint-disable-next-line
      leftValue = mqlExecuter[`run${leftKey}`](mql.left, props);
    }

    const rightKey = getRunKey(mql.right);
    if (rightKey) {
      // eslint-disable-next-line
      rightValue = mqlExecuter[`run${rightKey}`](mql.right, props);
    }

    if (mql.operator === operatorConstants.ADD) {
      // eslint-disable-next-line
      return leftValue + rightValue;
    } else if (mql.operator === operatorConstants.SUB) {
      // eslint-disable-next-line
      return leftValue - rightValue;
    } else if (mql.operator === operatorConstants.MULTI) {
      // eslint-disable-next-line
      return leftValue * rightValue;
    } else if (mql.operator === operatorConstants.DIVISION) {
      // eslint-disable-next-line
      return leftValue / rightValue;
    }
  }

  return false;
}

const runLogical = (mql, props = {}) => {
  if (
    lodash.isObject(mql)
    && lodash.isObject(mql.left)
    && lodash.isObject(mql.right)
  ) {
    let leftValue;
    let rightValue;

    const leftKey = getRunKey(mql.left);
    if (leftKey) {
      // eslint-disable-next-line
      leftValue = mqlExecuter[`run${leftKey}`](mql.left, props);
    }

    const rightKey = getRunKey(mql.right);
    if (rightKey) {
      // eslint-disable-next-line
      rightValue = mqlExecuter[`run${rightKey}`](mql.right, props);
    }

    if (mql.operator === operatorConstants.OR) {
      // eslint-disable-next-line
      return leftValue || rightValue;
    } else if (mql.operator === operatorConstants.AND) {
      // eslint-disable-next-line
      return leftValue && rightValue;
    }
  }

  return false;
}

const runIN = (args, props = {}) => {
  if (!lodash.isArray(args) || args.length < 2) {
    return false;
  }

  const fieldMql = args[0];
  let fieldValue;
  if (lodash.isObject(fieldMql) && fieldMql.kind === mqlKindConstants.VARIABLE) {
    // eslint-disable-next-line
    fieldValue = mqlExecuter[`run${fieldMql.kind}`](fieldMql, props);
  }

  const paramsMql = args[1];
  let elements = [];
  if (lodash.isObject(paramsMql) && paramsMql.kind === mqlKindConstants.ARRAY && lodash.isArray(paramsMql.elements)) {
    elements = [
      ...paramsMql.elements,
    ];
  }

  for (let i = 0; i < elements.length; i++) {
    const item = elements[i];
    // eslint-disable-next-line
    const itemValue = mqlExecuter[`run${item.kind}`](item, props);
    // eslint-disable-next-line
    if (fieldValue == itemValue) {
      return true;
    }
  }

  return false;
}

const runNOTIN = (args, props = {}) => !runIN(args, props);

const runCONTAIN = (args, props = {}) => {
  if (!lodash.isArray(args) || args.length < 2) {
    return false;
  }

  const fieldMql = args[0];
  let fieldValue;
  if (lodash.isObject(fieldMql) && fieldMql.kind === mqlKindConstants.VARIABLE) {
    // eslint-disable-next-line
    fieldValue = mqlExecuter[`run${fieldMql.kind}`](fieldMql, props);
  }

  const paramsMql = args[1];
  let paramValue = '';
  if (lodash.isObject(paramsMql) && paramsMql.kind === mqlKindConstants.LITERAL && lodash.isString(paramsMql.value)) {
    paramValue = paramsMql.value;
  }

  if (lodash.isString(fieldValue) && fieldValue.length > 0) {
    if (paramValue.length > 0) {
      return fieldValue.indexOf(paramValue) > -1;
    } else {
      return true;
    }
  }

  return false;
}

const runNOTCONTAIN = (args, props = {}) => !runCONTAIN(args, props);

const runISNULL = (args, props = {}) => {
  if (!lodash.isArray(args) || args.length < 1) {
    return true;
  }

  const fieldMql = args[0];
  let fieldValue;
  if (lodash.isObject(fieldMql) && fieldMql.kind === mqlKindConstants.VARIABLE) {
    // eslint-disable-next-line
    fieldValue = mqlExecuter[`run${fieldMql.kind}`](fieldMql, props);
  }

  if (
    fieldValue === undefined
    || fieldValue === null
    || (lodash.isString(fieldValue) && lodash.trim(fieldValue) === '')
  ) {
    return true;
  }

  return false;
}

const runNOTNULL = (args, props = {}) => !runISNULL(args, props);

const runCONCAT = (args, props = {}) => {
  let str = '';
  if (!lodash.isArray(args) || args.length < 1) {
    return str;
  }

  args.forEach(item => {
    if (lodash.isObject(item)) {
      if (item.kind === mqlKindConstants.VARIABLE || item.kind === mqlKindConstants.LITERAL) {
        // eslint-disable-next-line
        const temp = mqlExecuter[`run${item.kind}`](item, props) || '';
        str += temp;
      } else if (item.kind === mqlKindConstants.ARRAY && lodash.isArray(item.elements)) {
        str += runCONCAT(item.elements, props)
      }
    }
  });

  return str;
}

const runCALL = (mql, props = {}) => {
  const {
    callee = {},
    arguments: args = [],
  } = mql;

  let funName;
  if (lodash.isObject(callee) && lodash.isString(callee.value)) {
    funName = callee.value;
  }

  if (lodash.isString(funName)) {
    // eslint-disable-next-line
    return mqlExecuter[`run${funName}`](args, props);
  }

  return;
}

const mqlExecuter = {
  runEQ: runBinary,
  runNOT: runBinary,
  runGT: runBinary,
  runEGT: runBinary,
  runLT: runBinary,
  runELT: runBinary,
  runADD: runMATH,
  runSUB: runMATH,
  runMULTI: runMATH,
  runDIVISION: runMATH,
  runAND: runLogical,
  runOR: runLogical,
  runVARIABLE,
  runLITERAL,
  runCALL,
  runIN,
  runNOT_IN: runNOTIN,
  runCONTAIN,
  runNOT_CONTAIN: runNOTCONTAIN,
  runIS_NULL: runISNULL,
  runNOT_NULL: runNOTNULL,
  runCONCAT,
}

export const run = (mql, props = {}) => {
  const key = getRunKey(mql);

  if (key) {
    return mqlExecuter[`run${key}`](mql, props);
  }

  return;
}

export const runFormula = (formula, props = {}) => {
  const mql = formulaToMql(formula);

  if (lodash.isObject(mql)) {
    return run(mql, props);
  }

  return;
}
