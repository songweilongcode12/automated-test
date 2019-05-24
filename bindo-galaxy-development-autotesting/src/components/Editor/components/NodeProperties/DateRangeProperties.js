import React, { Component } from 'react';
import { Select } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import ActionInput from '../ActionInput';

/* eslint-disable */
const dateFormats = [
  'YYYY',
  'YYYY-MM',
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm',
  // 'YYYY/MM',
  // 'YYYY/MM/DD',
];
/* eslint-enable */

@hocProperties()
class DateRangeProperties extends Component {

  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      format = 'YYYY-MM-DD',
    } = view || {};

    return (
      <BaseProperties {...this.props}>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.format')}
          </div>
          <Select
            value={format}
            style={{width: '100%'}}
            onChange={value => onViewPropsChange('format', value)}
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
            {t('common:editor.placeholder')}
          </div>
          <ActionInput
            value={view.startDatePlaceholder}
            placeholder={t('common:editor.startDatePlaceholder')}
            style={{flex: 1, marginTop: 3}}
            onOkClick={value => onViewPropsChange('startDatePlaceholder', value)}
          />
          <ActionInput
            value={view.endDatePlaceholder}
            placeholder={t('common:editor.endDatePlaceholder')}
            style={{flex: 1, marginTop: 3}}
            onOkClick={value => onViewPropsChange('endDatePlaceholder', value)}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default DateRangeProperties;
