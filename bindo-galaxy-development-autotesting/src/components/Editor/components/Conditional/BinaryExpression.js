import React, { Component } from 'react'
import { Select, InputNumber, DatePicker, Icon as AntdIcon } from 'antd'
import lodash from 'lodash'
import moment from 'moment'
import ConditionalContext from './ConditionalContext'
import Operator from '../../../../constants/operator'
import widgets from '../../../../constants/widgets'
import mqlKind from '../../../../constants/mqlKind'
import { filterOption } from '../../../../utils/galaxy'

const multiValueOperation = new Set([
  Operator.IN,
  Operator.NOT_IN,
  Operator.CONTAIN,
  Operator.NOT_CONTAIN,
]);

const unaryOperation = new Set([
  Operator.IS_NULL,
  Operator.NOT_NULL,
]);

class BinaryExpression extends Component {
  handleNameChange = (value, context) => {
    const {
      data,
    } = this.props;

    const {
      uuid,
    } = data;

    context.updateLogical({
      uuid,
      data: {
        ...data,
        left: {
          ...data.left,
          value,
        },
      },
    })
  }

  handleOperatorChange = (value, context) => {
    const {
      data,
    } = this.props;

    const {
      uuid,
      right: {
        value: rightValue,
      } = {},
    } = data;

    let values;
    if (multiValueOperation.has(value)) {
      if (lodash.isArray(rightValue)) {
        values = rightValue;
      } else if (rightValue) {
        values = [rightValue];
      } else {
        values = []
      }
    }
    if (!multiValueOperation.has(value)) {
      if (!lodash.isArray(rightValue)) {
        values = rightValue;
      } else if (rightValue.length > 0) {
        [values] = rightValue;
      } else {
        values = '';
      }
    }

    context.updateLogical({
      uuid,
      data: {
        ...data,
        operator: value,
        right: {
          ...data.right,
          type: mqlKind.LITERAL,
          value: values,
        },
      },
    });
  }

  handleParamsChange = (value, context) => {
    const {
      data,
    } = this.props;

    const {
      uuid,
      operator,
    } = data;

    let values = value;
    if (!multiValueOperation.has(operator)) {
      if (lodash.isArray(values) && value.length > 0) {
        [values] = value;
      }
    }

    context.updateLogical({
      uuid,
      data: {
        ...data,
        right: {
          ...data.right,
          value: values,
        },
      },
    });
  }

  getOperators = () => {
    const { t } = this.props;

    return [{
      label: t('common:editor.eq'),
      value: Operator.EQ,
    }, {
      label: t('common:editor.notEq'),
      value: Operator.NOT_EQ,
    }, {
      label: t('common:editor.gt'),
      value: Operator.GT,
    }, {
      label: t('common:editor.egt'),
      value: Operator.EGT,
    }, {
      label: t('common:editor.lt'),
      value: Operator.LT,
    }, {
      label: t('common:editor.elt'),
      value: Operator.ELT,
    }, {
      label: t('common:editor.in'),
      value: Operator.IN,
    // }, {
    //   label: t('common:editor.notIn'),
    //   value: Operator.NOT_IN,
    }, {
      label: t('common:editor.contain'),
      value: Operator.CONTAIN,
    }, {
      label: t('common:editor.notContain'),
      value: Operator.NOT_CONTAIN,
    }, {
      label: t('common:editor.isNull'),
      value: Operator.IS_NULL,
    }, {
      label: t('common:editor.notNull'),
      value: Operator.NOT_NULL,
    }];
  }

  getParamsArrayValue = () => {
    const value = this.getParamsValue();

    let values = value;
    if (!lodash.isArray(values)) {
      values = [];
      if (value) {
        values = [value]
      }
    }

    return values || [];
  }

  getParamsDateValue = () => {
    const value = this.getParamsValue();

    if (value) {
      return this.getDateValue(value, 'YYYY-MM-DD HH:mm:ss');
    }

    return;
  }

  getParamsValue = () => {
    const {
      data,
    } = this.props;

    const {
      right: {
        value,
      } = {},
    } = data;

    return value;
  }

  getDateValue = (value, format) => {
    let dateValue;
    if (value.indexOf('T') > -1) {
      dateValue = moment(value, moment.ISO_8601);
    } else {
      dateValue = moment(value, format);
    }

    return dateValue;
  }

  getInputView = (context) => {

    const fields = context.fields || [];

    const {
      data,
    } = this.props;

    const {
      left: {
        value: fieldName,
      } = {},
    } = data;

    let fieldViewType = null;
    if (lodash.isArray(fields) && fieldName) {
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (field.name === fieldName) {
          fieldViewType = field.viewType;
          break;
        }
      }
    }

    if (fieldViewType === widgets.INTEGER_NUMBER || fieldViewType === widgets.DECIMAL_NUMBER) {
      return (
        <InputNumber
          style={{flex: 1}}
          value={this.getParamsValue()}
          onChange={value => this.handleParamsChange(value, context)}
        />
      );
    } else if (fieldViewType === widgets.DATE) {
      return (
        <DatePicker
          style={{flex: 1}}
          value={this.getParamsDateValue()}
          format="YYYY-MM-DD HH:mm:ss"
          onChange={value => {
            if (value) {
              value = value.toISOString();
            }
            this.handleParamsChange(value, context)
          }}
        />
      );
    } else {
      return (
        <Select
          mode="tags"
          style={{flex: 1}}
          value={this.getParamsArrayValue()}
          onChange={value => this.handleParamsChange(value, context)}
        />
      );
    }

  }

  render() {
    const {
      t,
      prefix,
      data,
      index,
      parentUuid,
      parentOperator,
    } = this.props;

    const {
      uuid,
      operator,
      left: {
        value: fieldName,
      } = {},
    } = data;

    let operatorTep = Operator.AND;
    if (parentOperator === Operator.AND) {
      operatorTep = Operator.OR
    }

    return (
      <ConditionalContext.Consumer>
        {
          (context) => (
            <div style={{display: 'flex', marginTop: '5px'}}>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                placeholder={t('common:module.tableFieldPlaceholder')}
                style={{flex: 1}}
                onChange={value => this.handleNameChange(value, context)}
                value={fieldName}
              >
                {
                  context.fields.map(field =>
                    <Select.Option key={field.name} value={field.name}>{field.label || field.name}</Select.Option>
                  )
                }
              </Select>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                placeholder={t('common:module.tableFieldPlaceholder')}
                style={{width: '100px', margin: '0 3px'}}
                onChange={value => this.handleOperatorChange(value, context)}
                value={operator}
              >
                {
                  this.getOperators().map(item =>
                    <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                  )
                }
              </Select>
              {
                !unaryOperation.has(operator) && this.getInputView(context)
              }
              {
                unaryOperation.has(operator) &&
                <div style={{flex: 1}} />
              }
              <AntdIcon
                type="close"
                style={{marginLeft: '8px'}}
                className={`${prefix}-binary-btn`}
                onClick={() => context.removeLogical({uuid})}
              />
              <AntdIcon
                type="plus-circle"
                className={`${prefix}-binary-btn add`}
                onClick={() => context.insertLogical({
                  uuid: parentUuid,
                  index: index+1,
                  type: 'BinaryExpression',
                })}
              />
              <AntdIcon
                type="dash"
                className={`${prefix}-binary-btn`}
                onClick={() => context.insertLogical({
                  uuid: parentUuid,
                  index: index+1,
                  operator: operatorTep,
                  type: 'LogicalExpression',
                })}
              />
            </div>
          )
        }
      </ConditionalContext.Consumer>
    );
  }
}

export default BinaryExpression;
