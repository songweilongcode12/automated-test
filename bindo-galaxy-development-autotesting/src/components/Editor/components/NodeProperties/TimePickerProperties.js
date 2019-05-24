import React, { Component } from 'react';
import moment from 'moment';
import { Select, TimePicker } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

/* eslint-disable */
const timeFormats = [
  // 'HH',
  'HH:mm',
  'HH:mm:ss',
  // 'hh A',
  // 'hh:mm A',
  // 'hh:mm:ss A',
];
/* eslint-enable */

@hocProperties()
class TimePickerProperties extends Component {
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
      format = 'HH:mm:ss',
    } = view || {};

    let defaultValue;
    if (field.defaultValue) {
      defaultValue = moment(field.defaultValue, format);
    }

    let use12Hours = false;
    if (format.search(/a/i) > -1) {
      use12Hours = true;
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
              timeFormats.map(item =>
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
          <TimePicker
            use12Hours={use12Hours}
            format={format}
            defaultValue={defaultValue}
            onChange={this.handleDefaultValueChange}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default TimePickerProperties;
