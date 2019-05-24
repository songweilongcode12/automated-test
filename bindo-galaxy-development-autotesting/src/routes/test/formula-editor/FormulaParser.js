import recast from 'recast'
import lodash from 'lodash'

const operatorRef = {
  '+': 'ADD',
  '-': 'SUB',
  '*': 'MULTI',
  '/': 'DIVISION',
  '==': 'EQ',
  '===': 'EQ',
  '>': 'GT',
  '>=': 'EGT',
  '<': 'LT',
  '<=': 'ELT',
  '!=': 'NOT',
  '!==': 'NOT',
  'in': 'IN',
  '&&': 'AND',
  '||': 'OR',
}

const operatorRef2 = {
  'ADD': '+',
  'SUB': '-',
  'MULTI': '*',
  'DIVISION': '/',
  'EQ': '==',
  'GT': '>',
  'EGT': '>=',
  'LT': '<',
  'ELT': '<=',
  'NOT': '!=',
  'IN': 'in',
  'AND': '&&',
  'OR': '||',
}

const mqlKind = {
  'EQ': 'BINARY',
  'NOT': 'BINARY',
  'GT': 'BINARY',
  'EGT': 'BINARY',
  'LT': 'BINARY',
  'ELT': 'BINARY',
  'AND': 'LOGICAL',
  'OR': 'LOGICAL',
  'ADD': 'MATH',
  'SUB': 'MATH',
  'MULTI': 'MATH',
  'DIVISION': 'MATH',
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
  kind: 'LITERAL',
  value: literal.value,
})

const parseIdentifier = identifier => ({
  kind: 'VARIABLE',
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
    kind: 'VARIABLE',
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

  const calleeMql = parseMemberExpression(callee);
  const {
    value = '',
  } = calleeMql;

  const values = value.split('.');
  const operator = values.pop() || '';
  const leftValue = values.join('.');

  return {
    kind: 'CALL',
    left: {
      kind: 'VARIABLE',
      value: leftValue,
    },
    operator,
    right: argsMql,
  }
}

const astParser = {
  parseLiteral,
  parseBinaryExpression,
  parseIdentifier,
  parseMemberExpression,
  parseSequenceExpression,
  parseLogicalExpression: parseBinaryExpression,
  parseCallExpression,
}

export const stringToMql = str => {
  str = str || '';
  const ast = recast.parse(str);
  log.info(ast);
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
  const {
    value,
  } = literal;

  return value;
}

const parseVARIABLE = variable => {
  const {
    value,
  } = variable;

  return value;
}

const parseLOGICAL = logical => {
  const {
    left,
    operator,
    right,
  } = logical;
  return [
    // eslint-disable-next-line
    mqlParser[`parse${left.kind}`](left),
    operatorRef2[operator],
    // eslint-disable-next-line
    mqlParser[`parse${right.kind}`](right),
  ];
};

const mqlParser = {
  parseLOGICAL,
  parseLITERAL,
  parseVARIABLE,
}

export const mqlToString = mql => {
  const {
    kind,
  } = mql;

  const arr = mqlParser[`parse${kind}`](mql)

  if (lodash.isArray(arr)) {
    return arr.join(' ')
  }

  return '';
}
