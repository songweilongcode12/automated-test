import React, { Component } from 'react';
import { Form, Input } from 'antd';
import hocParser from './hocParser';

@hocParser()
class TextAreaParser extends Component {
  render() {
    const {
      view,
      field,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getViewProps,
      getFormItemProps,
    } = this.props;

    const {
      visibleRows = 3,
    } = view || {};

    const {
      name,
    } = field;

    const viewProps = {
      autosize: {
        minRows: visibleRows,
        maxRows: visibleRows,
      },
      ...getViewProps(),
    };

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <Input.TextArea {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default TextAreaParser;
