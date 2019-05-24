import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import hocNode from './hocNode'

@hocNode()
class DatePickerNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      placeholder = '',
      format = 'YYYY-MM-DD',
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
      <DatePicker {...nodeProps} />
    );
  }
}

export default DatePickerNode;
