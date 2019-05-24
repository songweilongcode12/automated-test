import React, { Component } from 'react'
import { Tooltip, Icon as AntdIcon } from 'antd';
import hocNode from './hocNode'

@hocNode()
class LabelNode extends Component {
  render() {
    const { view, prefix } = this.props;
    const {
      label = '',
      fontWeight = 500,
      fontSize = 14,
      helpTooltip = '',
    } = view || {};

    const nodeProps = {
      style: {
        verticalAlign: 'middle',
        display: 'inline-block',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        fontWeight,
        fontSize,
      },
    };

    const labelView = [<span key="label">{label}</span>];
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

    return (
      <div {...nodeProps}>{labelView}</div>
    );
  }
}

export default LabelNode;
