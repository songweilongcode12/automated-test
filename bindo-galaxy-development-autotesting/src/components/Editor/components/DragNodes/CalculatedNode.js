import React, { Component } from 'react'
import { Input } from 'antd'
import hocNode from './hocNode'

@hocNode()
class CalculatedNode extends Component {
  render() {
    const { view } = this.props;
    const {
      placeholder = '',
    } = view || {};

    const nodeProps = {
      placeholder,
      disabled: true,
    };

    return (
      <Input {...nodeProps} />
    );
  }
}

export default CalculatedNode;
