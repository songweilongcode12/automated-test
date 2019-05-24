import React, { Component } from 'react'
import { Select } from 'antd'
import hocNode from './hocNode'
import common from '../../../../constants/common';

@hocNode()
class SelectionNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      mode = common.RADIO,
    } = view || {};

    // 在编辑器模式下不展示默认值
    const {
      // defaultValue,
      readOnly = false,
      allowValue: {
        staticItems = [],
      } = {},
    } = field;

    const nodeProps = {
      // defaultValue,
      placeholder,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

    if (mode === common.MULTIPLE || mode === common.TAGS) {
      // 当前默认值为string
      // if (Array.isArray(defaultValue)) {
      //   nodeProps.defaultValue = [];
      // }

      nodeProps.mode = mode;
    }

    return (
      <Select {...nodeProps}>
        {
          staticItems.map(item =>
            <Select.Option
              key={item.uuid}
              value={item.key}
            >
              {item.value}
            </Select.Option>
          )
        }
      </Select>
    );
  }
}

export default SelectionNode;
