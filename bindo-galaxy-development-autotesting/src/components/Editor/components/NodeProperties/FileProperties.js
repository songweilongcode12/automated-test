import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import ActionInput from '../ActionInput';

@hocProperties()
class FileProperties extends Component {
  render () {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    return (
      <BaseProperties {...this.props}>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.buttonText')}
          </div>
          <ActionInput
            value={view.buttonText}
            style={{ flex: 1, marginTop: 3 }}
            onOkClick={value => onViewPropsChange('buttonText', value)}
          />
        </div>
      </BaseProperties>
    );
  }
}

export default FileProperties;
