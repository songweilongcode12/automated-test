import React, { Component } from 'react'
import { Divider } from 'antd';
import hocParser from './hocParser'

@hocParser()
class DividerParser extends Component {
  render() {
    const {
      view,
      getFormItemProps,
    } = this.props;

    const {
      label,
    } = {
      ...getFormItemProps(),
    }

    const {
      orientation = 'center',
      dashed = false,
    } = view || {};

    let viewProps= {};
    // orientation == center时不要传入，传入时样式会错位
    if(orientation === 'center'){
      viewProps = {
        dashed,
      };
    } else {
      viewProps = {
        dashed,
        orientation,
      };
    }

    return (
      <Divider {...viewProps}>{label}</Divider>
    );
  }
}

export default DividerParser;
