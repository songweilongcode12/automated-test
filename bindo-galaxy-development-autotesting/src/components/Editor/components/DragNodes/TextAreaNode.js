import React, { Component } from 'react'
import { Input } from 'antd'
import lodash from 'lodash'
import hocNode from './hocNode'

@hocNode()
class TextAreaNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      visibleRows = 3,
    } = view || {};

    const {
      defaultValue = '',
      readOnly = false,
    } = field;

    const nodeProps = {
      placeholder,
      disabled: readOnly,
      autosize: {
        minRows: visibleRows,
        maxRows: visibleRows,
      },
    };

    if (lodash.isString(defaultValue)) {
      nodeProps.defaultValue = defaultValue;
    }

    return (
      <Input.TextArea {...nodeProps} />
    );
  }
}

export default TextAreaNode;
