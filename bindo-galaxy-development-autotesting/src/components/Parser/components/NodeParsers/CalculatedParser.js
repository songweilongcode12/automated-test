import React, { Component } from 'react'
import { Form, Input } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'
import { runFormula } from '../../../../data/MqlParser'

@hocParser()
class CalculatedParser extends Component {

  getValue = () => {
    const {
      view,
      getFieldValue,
    } = this.props;

    const {
      formula = '',
    } = view || {};

    let formulaValue = '';
    if (lodash.isString(formula) && formula.length > 0) {
      formulaValue = runFormula(formula, {
        selfFieldCallback: fieldName => getFieldValue(fieldName) || '',
      });
    }

    return formulaValue;
  }

  render() {
    const {
      getViewProps,
      getFormItemProps,
    } = this.props;

    const formItemProps = {
      ...getFormItemProps(),
    };

    const viewProps = {
      ...getViewProps(),
      disabled: true,
      value: this.getValue(),
    };

    return (
      <Form.Item {...formItemProps}>
        <Input {...viewProps} />
      </Form.Item>
    );
  }
}

export default CalculatedParser;
