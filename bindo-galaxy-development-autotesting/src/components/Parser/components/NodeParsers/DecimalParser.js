import React, { Component } from 'react'
import { Form, InputNumber } from 'antd'
import hocParser from './hocParser'

@hocParser()
class DecimalParser extends Component {
  render() {
    const {
      view,
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      field,
      getFormItemProps,
    } = this.props;

    const {
      name,
    } = field;

    const {
      maxValue,
      minValue,
      step = 1,
      precision = 1,
    } = view || {};

    const viewProps = {
      step,
      precision,
      max: maxValue,
      min: minValue,
      ...getViewProps(),
    };

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <InputNumber {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default DecimalParser;
