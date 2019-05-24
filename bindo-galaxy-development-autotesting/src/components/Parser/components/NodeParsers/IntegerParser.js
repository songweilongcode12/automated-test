import React, { Component } from 'react'
import { Form, InputNumber } from 'antd'
import hocParser from './hocParser';

@hocParser()
class IntegerParser extends Component {
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
    } = view || {};

    const viewProps = {
      step,
      max: maxValue,
      min: minValue,
      ...getViewProps(),
      precision: 0,
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

export default IntegerParser;
