import React, { Component } from 'react'
import { Checkbox } from 'antd'
import hocNode from './hocNode'

@hocNode()
class CheckboxNode extends Component {
  render() {
    const { field } = this.props;

    const {
      defaultValue,
      readOnly = false,
      allowValue: {
        staticItems = [],
      } = {},
    } = field;

    const options = [];
    if (Array.isArray(staticItems)) {
      staticItems.forEach(item => options.push({
        label: item.value,
        value: item.key,
      }));
    }

    const nodeProps = {
      defaultValue,
      options,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

    if (!Array.isArray(defaultValue)) {
      nodeProps.defaultValue = [];
    }

    return (
      <Checkbox.Group {...nodeProps} />
    );
  }
}

export default CheckboxNode;
