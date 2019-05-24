import React, {Component} from 'react';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
import hocParser from './hocParser';

@hocParser()
class TimePickerParser extends Component {

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
      format = 'HH:mm:ss',
    } = view || {};

    const {
      name,
      defaultValue,
    } = field;
    const initials= getInitialValue();
    let initialValue;
    if(initials === undefined || initials === null){
      initialValue= null;
    } else {
      initialValue = moment(initials, format)||null;
    }
    const viewProps = {
      format,
      style: {
        width: '100%',
      },
      ...getViewProps(),
    };

    if (defaultValue) {
      viewProps.defaultValue = moment(defaultValue, format);
    }

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <TimePicker {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default TimePickerParser
