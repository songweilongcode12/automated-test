import React, { Component } from 'react'
import { Form, Checkbox, Tooltip, Icon as AntdIcon } from 'antd'
import hocParser from './hocParser'

@hocParser()
class BooleanParser extends Component {
  render() {
    const {
      field,
      getViewProps,
      view,
      prefix,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getFieldValue,
      getFormItemProps,
    } = this.props;

    const viewProps = {
      ...getViewProps(),
    };
    let checked = getFieldValue(field.name);

    const initialValue = !!getInitialValue();
    if (checked === undefined) {
      checked = initialValue;
    }
    viewProps.checked = checked || false;

    const {
      label,
      name,
    } = field;

    const {
      helpTooltip = '',
    } = view;

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
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <Checkbox {...viewProps}>
            { labelView }
          </Checkbox>
        )}
      </Form.Item>
    );
  }
}

export default BooleanParser;
