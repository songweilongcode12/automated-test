import React, { Component } from 'react';
import moment from 'moment';
import { Select, DatePicker } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

/* eslint-disable */
const dateFormats = [
  'YYYY',
  'YYYY-MM',
  'YYYY-MM-DD',
  // 'YYYY-MM-DD HH',
  'YYYY-MM-DD HH:mm',
  'YYYY-MM-DD HH:mm:ss',
  // 'YYYY/MM',
  // 'YYYY/MM/DD',
  // 'YYYY/MM/DD HH',
  // 'YYYY/MM-DD HH:mm',
  // 'YYYY/MM/DD HH:mm:ss',
];
/* eslint-enable */

@hocProperties()
class DatePickerProperties extends Component {
  handleDefaultValueChange = (time, timeString) => {
    if (!timeString) {
      timeString = undefined;
    }
    const { onFieldPropsChange } = this.props;
    onFieldPropsChange('defaultValue', timeString);
  }

  handleFormatChange = (value) => {
    const { field, onViewPropsChange, onFieldPropsChange } = this.props;
    onViewPropsChange('format', value);
    if (field.defaultValue) {
      onFieldPropsChange('defaultValue', moment(field.defaultValue, value).format(value));
    }
  }

  render() {
    const {
      t,
      field,
      view,
      prefix,
      // onFieldPropsChange,
      // onViewPropsChange,
    } = this.props;

    const {
      format = 'YYYY-MM-DD',
    } = view || {};

    let defaultValue;
    if (field.defaultValue) {
      defaultValue = moment(field.defaultValue, format);
    }

    let showTime = false;
    if (format.search(/H/i) > -1) {
      showTime = {
        format: format.replace(/YYYY-MM-DD |YYYY\/MM\/DD /, ''),
      };
    }

    return (
      <BaseProperties {...this.props} placeholder>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.format')}
          </div>
          <Select
            value={format}
            style={{width: '100%'}}
            onChange={this.handleFormatChange}
          >
            {
              dateFormats.map(item =>
                <Select.Option
                  key={item}
                  value={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.defaultValue')}
          </div>
          <DatePicker
            format={format}
            showTime={showTime}
            defaultValue={defaultValue}
            onChange={this.handleDefaultValueChange}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default DatePickerProperties;
