import React from 'react';
import lodash from 'lodash';
import { Tag } from 'antd';
import operatorConstants from '../../../constants/operator';

const prefix = 'bg-c-parser-filterview-tag';

const operatorRef = {
  [operatorConstants.NOT_EQ]: '!=',
  [operatorConstants.EQ]: '==',
  [operatorConstants.GT]: '>',
  [operatorConstants.EGT]: '>=',
  [operatorConstants.LT]: '<',
  [operatorConstants.ELT]: '<=',
  [operatorConstants.IN]: 'common:editor.in',
  [operatorConstants.NOT_IN]: 'common:editor.notIn',
  [operatorConstants.CONTAIN]: 'common:editor.contain',
  [operatorConstants.NOT_CONTAIN]: 'common:editor.notContain',
  [operatorConstants.IS_NULL]: 'common:editor.isNull',
  [operatorConstants.NOT_NULL]: 'common:editor.notNull',
}

const parseOperator = (operator, t) => {
  let newOperator = '';

  if (!operator) {
    return newOperator;
  }

  newOperator = operatorRef[operator];

  if (lodash.isString(newOperator) && newOperator.indexOf('common:' > -1)) {
    newOperator = t(newOperator);
  }

  return newOperator || operator;
}

export default (props) => {
  const {
    t,
    data = {},
    onClose = () => { },
    mode,
  } = props;

  const {
    left: {
      value: leftValue = '',
    } = {},
    operator = '',
    right: {
      value: rightValue = '',
    } = {},
    uuid,
  } = data || {};

  const title = `${leftValue} ${rightValue && parseOperator(operator, t)}`

  return (
    <span className={`${prefix} ${mode}`}>
      <div className={`${prefix}-title`}>{title}</div>
      <Tag
        closable
        onClose={() => onClose(uuid)}
      >
        <span>{rightValue || parseOperator(operator, t)}</span>
      </Tag>
    </span>
  );
}
