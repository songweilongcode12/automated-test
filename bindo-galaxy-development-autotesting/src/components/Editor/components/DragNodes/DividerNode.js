import React, { Component } from 'react'
import { Divider, Tooltip, Icon as AntdIcon } from 'antd';
import hocNode from './hocNode'

@hocNode()
class DividerNode extends Component {
  render() {
    const { view, prefix } = this.props;
    const {
      label = '',
      helpTooltip = '',
      orientation = 'center',
      dashed = false,
    } = view || {};

    const nodeProps = {
      dashed,
    };

    if (orientation === 'left' || orientation === 'right') {
      nodeProps.orientation = orientation;
    }

    let labelView;
    if (label && label.length > 0) {
      labelView = [<span key="label">{label}</span>];
      if (helpTooltip && helpTooltip.length > 0) {
        labelView.push(
          <Tooltip key="tooltip" title={helpTooltip}>
            <AntdIcon
              type="info-circle"
              className={`${prefix}-help-tooltip`}
            />
          </Tooltip>
        );
      }
    }

    return (
      <Divider {...nodeProps}>{labelView}</Divider>
    );
  }
}

export default DividerNode;
