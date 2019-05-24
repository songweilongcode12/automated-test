import React, { Component } from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'
import lodash from 'lodash'
import hocNode from './hocNode'

@hocNode()
class DateRangeNode extends Component {
  render() {
    const { view, field } = this.props;
    const {
      startDatePlaceholder,
      endDatePlaceholder,
      format = 'YYYY-MM-DD',
    } = view || {};

    const {
      defaultValue,
      readOnly = false,
    } = field;

    const nodeProps = {
      format,
      disabled: readOnly,
      style: {
        width: '100%',
      },
    };

    if (startDatePlaceholder || endDatePlaceholder) {
      const values = [];
      if (startDatePlaceholder && startDatePlaceholder.length > 0) {
        values.push(startDatePlaceholder);
      }
      if (endDatePlaceholder && endDatePlaceholder.length > 0) {
        if (values.length < 1) {
          values.push('');
        }
        values.push(endDatePlaceholder);
      }
      if (values.length > 0) {
        nodeProps.placeholder = values;
      }
    }

    if (defaultValue && Array.isArray(defaultValue)) {
      const values = [];
      if (defaultValue.length > 0 && lodash.isString(defaultValue[0])) {
        values.push(moment(defaultValue[0], format));
      }
      if (defaultValue.length > 1 && lodash.isString(defaultValue[1])) {
        values.push(moment(defaultValue[1], format));
      }
      if (values.length > 0) {
        nodeProps.defaultValue = values;
      }
    }

    return (
      <DatePicker.RangePicker {...nodeProps} />
    );
  }
}

export default DateRangeNode;
