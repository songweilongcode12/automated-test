import React, { Component } from 'react';
import { InputNumber } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class TextAreaProperties extends Component {
  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    return (
      <BaseProperties {...this.props} defaultValue placeholder>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.visibleRows')}
          </div>
          <InputNumber
            min={1}
            style={{width: '100%'}}
            value={view.visibleRows || 3}
            onChange={value => onViewPropsChange('visibleRows', value)}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default TextAreaProperties;
