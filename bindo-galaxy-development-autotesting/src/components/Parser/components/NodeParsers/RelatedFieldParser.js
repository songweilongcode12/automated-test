import React, { Component } from 'react'
import { Form, Input } from 'antd'
import hocParser from './hocParser'

@hocParser()
class RelatedFieldParser extends Component {
  render() {
    const {
      getFieldDecorator,
      getInitialValue,
      field = {},
      getViewProps,
      getRules,
      getFormItemProps,
    } = this.props;

    const {
      name,
    } = field;

    const viewProps = {
      ...getViewProps(),
      disabled: true,
    };

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <Input {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default RelatedFieldParser;
