import React, { Component } from 'react'
import { Input } from 'antd'
import hocNode from './hocNode'

@hocNode()
class SeqNoNode extends Component {
  render() {
    const {
      field,
    } = this.props;

    const {
      readOnly = false,
    } = field;

    const nodeProps = {
      disabled: readOnly,
    };

    return (
      <Input {...nodeProps} />
    );
  }
}

export default SeqNoNode;
