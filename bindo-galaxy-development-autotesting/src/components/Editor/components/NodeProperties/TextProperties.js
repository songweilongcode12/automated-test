import React, { Component } from 'react';
import { Select } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class TextProperties extends Component {
  render () {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
      handleFieldsDisable,
    } = this.props;

    return (
      <BaseProperties {...this.props} defaultValue placeholder unique>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.addonBefore')}
          </div>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={view.addonBefore || []}
            onChange={values => onViewPropsChange('addonBefore', values)}
            disabled={handleFieldsDisable()}
          />
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.addonAfter')}
          </div>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={view.addonAfter || []}
            onChange={values => onViewPropsChange('addonAfter', values)}
            disabled={handleFieldsDisable()}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default TextProperties;
