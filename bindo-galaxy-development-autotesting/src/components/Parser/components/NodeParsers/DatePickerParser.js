import React, {Component} from 'react';
import { Form, DatePicker } from 'antd';
import hocParser from './hocParser'

@hocParser()
class DatePickerParser extends Component {

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
      view,
      field,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getViewProps,
      getFormItemProps,
    } = this.props;

    const {
      format = 'YYYY-MM-DD',
    } = view || {};

    const {
      name,
    } = field;

    const viewProps = {
      format,
      style: {
        width: '100%',
      },
      ...getViewProps(),
      showTime: this.hasShowTime(),
    };

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <DatePicker
            {...viewProps}
          />
        )}
      </Form.Item>
    );
  }
}

export default DatePickerParser
