import React, { Component } from 'react'
import { TimePicker } from 'antd'
import moment from 'moment'
import hocNode from './hocNode'

@hocNode()
class TimePickerNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      format = 'HH:mm:ss',
    } = view || {};

    const {
      defaultValue,
      readOnly = false,
    } = field;

    const nodeProps = {
      placeholder,
      format,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

    if (defaultValue) {
      nodeProps.defaultValue = moment(defaultValue, format);
    }

    return (
      <TimePicker {...nodeProps} />
    );
  }
}

export default TimePickerNode;
