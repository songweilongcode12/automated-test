import React, { Component } from 'react'
import { Select } from 'antd'
import hocNode from './hocNode'

@hocNode()
class RelatedFieldNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
    } = view || {};

    const {
      readOnly = true,
      allowValues: {
        items = [],
      } = {},
    } = field;

    const nodeProps = {
      placeholder,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

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

export default RelatedFieldNode;
