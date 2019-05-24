import React, { Component } from 'react'
import { Input, Select } from 'antd'
import lodash from 'lodash'
import hocNode from './hocNode'

@hocNode()
class TextNode extends Component {
  getAddon = data => {
    if (!data || data.length < 1) return null;

    if (data.length > 1) {
      return (
        <Select defaultValue={data[0]} style={{ maxWidth: 120 }}>
          {
            data.map(item =>
              <Select.Option key={item} value={item}>{item}</Select.Option>
            )
          }
        </Select>
      );
    } else {
      return data[0];
    }
  }

  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      addonBefore = [],
      addonAfter = [],
    } = view || {};

    const {
      defaultValue = '',
      readOnly = false,
    } = field;

    const nodeProps = {
      placeholder,
      disabled: readOnly,
    };

    if (lodash.isString(defaultValue)) {
      nodeProps.defaultValue = defaultValue;
    }
    if (Array.isArray(addonBefore) && addonBefore.length > 0) {
      nodeProps.addonBefore = this.getAddon(addonBefore);
    }
    if (Array.isArray(addonAfter) && addonAfter.length > 0) {
      nodeProps.addonAfter = this.getAddon(addonAfter);
    }

    return (
      <Input {...nodeProps} />
    );
  }
}

export default TextNode;
