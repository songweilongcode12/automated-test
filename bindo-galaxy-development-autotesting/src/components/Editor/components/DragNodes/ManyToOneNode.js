import React, { Component } from 'react'
import { Select } from 'antd'
import hocNode from './hocNode'
import common from '../../../../constants/common';

@hocNode()
class ManyToOneNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      mode = common.RADIO,
    } = view || {};

    const {
      defaultValue,
      readOnly = false,
      allowValues: {
        items = [],
      } = {},
    } = field;

    const nodeProps = {
      defaultValue,
      placeholder,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

    if (mode === common.MULTIPLE || mode === common.TAGS) {
      if (Array.isArray(defaultValue)) {
        nodeProps.defaultValue = [];
      }

      nodeProps.mode = mode;
    }

    return (
      <Select {...nodeProps}>
        {
          items.map(item =>
            <Select.Option
              key={item.uuid}
              value={item.value}
            >
              {item.label}
            </Select.Option>
          )
        }
      </Select>
    );
  }
}

export default ManyToOneNode;
