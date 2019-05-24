import React, { Component } from 'react'
import { InputNumber } from 'antd'
import lodash from 'lodash'
import hocNode from './hocNode'

@hocNode()
class DecimalNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      maxValue,
      minValue,
      step = 1,
      precision = 1,
      placeholder = '',
    } = view || {};

    const {
      defaultValue,
      readOnly = false,
    } = field;

    const nodeProps = {
      step,
      precision,
      placeholder,
      disabled: readOnly,
    };

    if (lodash.isNumber(defaultValue)) {
      nodeProps.defaultValue = defaultValue;
    }
    if (lodash.isNumber(maxValue)) {
      nodeProps.max = maxValue;
    }
    if (lodash.isNumber(minValue)) {
      nodeProps.min = minValue;
    }

    return (
      <InputNumber {...nodeProps} />
    );
  }
}

export default DecimalNode;
