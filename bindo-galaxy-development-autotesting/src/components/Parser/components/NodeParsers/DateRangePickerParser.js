import React, {Component} from 'react';
import { Form, DatePicker } from 'antd';
import moment from 'moment'
import lodash from 'lodash'
import hocParser from './hocParser'

@hocParser()
class DateRangePickerParser extends Component {

  hasShowTime = () => {
    const {
      view,
    } = this.props;

    const {
      format = 'YYYY-MM-DD',
    } = view || {};

    if (
      format === 'YYYY-MM-DD' ||
      format === 'YYYY-MM' ||
      format === 'YYYY'
    ) {
      return false
    } else {
      return true;
    }
  }

  render () {
    const {
      field,
      view,
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getFormItemProps,
    } = this.props;

    const {
      name,
      defaultValue,
    } = field;

    const {
      startDatePlaceholder,
      endDatePlaceholder,
      format = 'YYYY-MM-DD',
    } = view || {};

    const viewProps = {
      ...getViewProps(),
      style: {
        width: '100%',
      },
      format,
      showTime: this.hasShowTime(),
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
        viewProps.placeholder = values;
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
        viewProps.defaultValue = values;
      }
    }

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <DatePicker.RangePicker
            {...viewProps}
          />
        )}
      </Form.Item>
    );
  }
}

export default DateRangePickerParser
