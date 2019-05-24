import lodash from 'lodash'
import operatorConstants from '../constants/operator'
import mqlKindConstants from '../constants/mqlKind'
import { createUuid } from '../utils'
import { mqlToFormula, formulaToMql } from './MqlParser';

const arrayParamSet = new Set([
  operatorConstants.IN,
  operatorConstants.NOT_IN,
]);

const stringParamSet = new Set([
  operatorConstants.CONTAIN,
  operatorConstants.NOT_CONTAIN,
]);

export const mqlToCst = (mql, operator, children) => {
  if (!lodash.isObject(mql)) {
    return;
  }

  const cst = {}
  if (mql.kind === mqlKindConstants.VARIABLE) {
    cst.type = mql.kind;
    cst.viewType = '';

    if (lodash.isString(mql.value)) {
      cst.value = mql.value.replace('$.self.', '');
    }
    return cst;
  }

  if (mql.kind === mqlKindConstants.LITERAL) {
    cst.type = mql.kind;
    cst.value = mql.value;

    return cst;
  }

  if (
    mql.kind === mqlKindConstants.CALL
    && lodash.isObject(mql.callee)
    && lodash.isString(mql.callee.value)
    && lodash.isArray(mql.arguments)
    && mql.arguments.length > 0
  ) {
    cst.operator = mql.callee.value;
    cst.type = mqlKindConstants.BinaryExpression;
    cst.uuid = createUuid();
    const fieldMql = mql.arguments.shift();

    if (
      lodash.isObject(fieldMql)
      && fieldMql.kind === mqlKindConstants.VARIABLE
      && lodash.isString(fieldMql.value)
    ) {
      cst.left = {
        type: mqlKindConstants.VARIABLE,
        value: fieldMql.value.replace('$.self.', ''),
        viewType: '',
      }
    }

    if (arrayParamSet.has(mql.callee.value)) {
      cst.right = {
        type: mqlKindConstants.LITERAL,
        value: [],
      };

      const paramsMql = mql.arguments.shift();

      if (
        lodash.isObject(paramsMql)
        && paramsMql.kind === mqlKindConstants.ARRAY
        && lodash.isArray(paramsMql.elements)
      ) {
        for (let i = 0; i < paramsMql.elements.length; i++) {
          const item = paramsMql.elements[i];
          cst.right.value.push(item.value);
        }
      }
    }

    if (stringParamSet.has(mql.callee.value)) {
      cst.right = {
        type: mqlKindConstants.LITERAL,
        value: '',
      };

      const paramsMql = mql.arguments.shift();

      if (
        lodash.isObject(paramsMql)
        && paramsMql.kind === mqlKindConstants.LITERAL
      ) {
        cst.right.value = paramsMql.value;
      }
    }

    return cst;
  }

  if (mql.kind === mqlKindConstants.BINARY) {
    cst.uuid = createUuid();
    cst.operator = mql.operator;
    cst.type = mqlKindConstants.BinaryExpression;

    if (mql.left && lodash.isObject(mql.left)) {
      cst.left = mqlToCst(mql.left);
    }

    if (mql.right && lodash.isObject(mql.right)) {
      cst.right = mqlToCst(mql.right);
    }

    return cst;
  }

  if (mql.kind === mqlKindConstants.LOGICAL) {
    cst.uuid = createUuid();
    cst.operator = mql.operator;
    cst.type = mqlKindConstants.LogicalExpression;
  }

  let isReturn = false;
  if (mql.left && lodash.isObject(mql.left)) {
    if (mql.operator === operator && lodash.isArray(children)) {
      const newConditional = mqlToCst(mql.left, mql.operator, children);
      if (newConditional) {
        children.push(newConditional)
      }
    }

    if (mql.operator !== operator) {
      isReturn = true;
      if (!cst.children) {
        cst.children = [];
      }
      const newConditional = mqlToCst(mql.left, mql.operator, cst.children)
      if (newConditional) {
        cst.children.push(newConditional)
      }
    }
  }

  if (mql.right && lodash.isObject(mql.right)) {
    if (mql.operator === operator && lodash.isArray(children)) {
      const newConditional = mqlToCst(mql.right, mql.operator, children)
      if (newConditional) {
        children.push(newConditional)
      }
    }

    if (mql.operator !== operator) {
      isReturn = true;
      if (!cst.children) {
        cst.children = [];
      }
      const newConditional = mqlToCst(mql.right, mql.operator, cst.children)
      if (newConditional) {
        cst.children.push(newConditional)
      }
    }
  }

  if (isReturn) {
    return cst;
  }
}

const callSet = new Set([
  operatorConstants.IN,
  operatorConstants.NOT_IN,
  operatorConstants.IS_NULL,
  operatorConstants.NOT_NULL,
  operatorConstants.CONTAIN,
  operatorConstants.NOT_CONTAIN,
]);

const repaireMql = (mql) => {

  if (lodash.isObject(mql) && callSet.has(mql.operator)) {
    const args = [];
    if (lodash.isObject(mql.left)) {
      args.push(mql.left);
    }

    // eslint-disable-next-line no-prototype-builtins
    if (lodash.isObject(mql.right) && mql.right.hasOwnProperty('value')) {
      if (lodash.isArray(mql.right.value)) {
        const values = mql.right.value;
        const arrObj = {
          kind: mqlKindConstants.ARRAY,
          elements: [],
        }
        for (let i = 0; i < values.length; i++) {
          arrObj.elements.push({
            kind: mql.right.kind,
            value: values[i],
          });
        }
        args.push(arrObj);
      } else {
        args.push(mql.right);
      }
    }

    mql = {
      kind: mqlKindConstants.CALL,
      callee: {
        kind: mqlKindConstants.CALL_LITERAL,
        value: mql.operator,
      },
      arguments: args,
    }
  }

  return mql
}

export const cstToMql = cst => {
  if (!lodash.isObject(cst)) {
    return;
  }

  let mql = {};
  if (cst.type === mqlKindConstants.BinaryExpression) {
    mql.kind = mqlKindConstants.BINARY;
    mql.operator = cst.operator;

    if (lodash.isObject(cst.left)) {
      mql.left = {};

      // eslint-disable-next-line no-prototype-builtins
      if (cst.left.hasOwnProperty('type')) {
        mql.left.kind = cst.left.type;
      }

      // eslint-disable-next-line no-prototype-builtins
      if (cst.left.hasOwnProperty('value') && lodash.isString(cst.left.value)) {
        mql.left.value = `$.self.${cst.left.value}`;
      }
    }

    if (lodash.isObject(cst.right)) {
      mql.right = {};

      // eslint-disable-next-line no-prototype-builtins
      if (cst.right.hasOwnProperty('type')) {
        mql.right.kind = cst.right.type;
      }

      // eslint-disable-next-line no-prototype-builtins
      if (cst.right.hasOwnProperty('value')) {
        mql.right.value = cst.right.value;
      }
    }

    return repaireMql(mql);
  }

  if (cst.type === mqlKindConstants.LogicalExpression) {
    mql.kind = mqlKindConstants.LOGICAL;
    mql.operator = cst.operator;

    let tempMql = {};
    if (lodash.isArray(cst.children)) {
      const children = [...cst.children];
      while (children.length > 0) {
        const item = children.shift();
        const newMql = cstToMql(item);

        if (!newMql.kind) {
          // eslint-disable-next-line no-continue
          continue;
        }

        if (!tempMql.kind) {
          tempMql.kind = mqlKindConstants.LOGICAL;
          tempMql.operator = cst.operator;
        }

        if (!tempMql.left) {
          tempMql.left = newMql;
        } else if (!tempMql.right) {
          tempMql.right = newMql;
        } else {
          tempMql = {
            kind: mqlKindConstants.LOGICAL,
            operator: cst.operator,
            left: tempMql,
            right: newMql,
          }
        }
      }
    }

    if (tempMql.left && tempMql.right) {
      mql = tempMql;
    } else if (tempMql.left) {
      mql = tempMql.left;
    } else {
      mql = {};
    }

    return repaireMql(mql);
  }
}

export const formulaToCst = formula => {
  const mql = formulaToMql(formula || '');
  let cst = mqlToCst(mql);
  if (cst && cst.type && cst.type !== mqlKindConstants.LogicalExpression) {
    cst = {
      children: [cst],
      operator: operatorConstants.AND,
      type: mqlKindConstants.LogicalExpression,
      uuid: createUuid(),
    }
  }

  return cst;
}

export const cstToFormula = cst => {
  const mql = cstToMql(cst);
  const formula = mqlToFormula(mql);

  return formula || '';
}
