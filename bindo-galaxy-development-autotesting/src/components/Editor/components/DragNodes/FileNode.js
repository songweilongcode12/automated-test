import React, { Component } from 'react'
import { Button, Icon } from 'antd';
import hocNode from './hocNode'

@hocNode()
class FileNode extends Component {

  render () {
    const { view } = this.props;
    const {
      buttonText = '',
      width = 86,
      height = 86,
    } = view || {};

    return (
      <Button size='default' style={{ minWidth: width, height }}>
        <Icon type="upload" />
        {buttonText}
      </Button>
    );
  }
}

export default FileNode;
