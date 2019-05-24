import React, { Component } from 'react'
import { Checkbox, Tooltip, Icon as AntdIcon } from 'antd'
import lodash from 'lodash'
import hocNode from './hocNode'

@hocNode()
class CheckboxNode extends Component {
  render() {
    const { field, view, prefix } = this.props;

    const {
      label,
      defaultValue,
      readOnly = false,
    } = field;

    const {
      helpTooltip = '',
    } = view;

    const nodeProps = {
      defaultChecked: defaultValue,
      disabled: readOnly,
    };

    if (!lodash.isBoolean(defaultValue)) {
      nodeProps.defaultChecked = false;
    }

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
      <Checkbox {...nodeProps}>
        { labelView }
      </Checkbox>
    );
  }
}

export default CheckboxNode;
