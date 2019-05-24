import React from 'react';
import ActionInput from '../../ActionInput';

export default props => {
  const {
    t,
    view,
    prefix,
    onViewPropsChange,
    handleFieldsDisable,
  } = props;

  return (
    <div className={prefix}>
      <div className={`${prefix}-label`}>
        {t('common:editor.placeholder')}
      </div>
      <ActionInput
        value={view.placeholder}
        onOkClick={value => onViewPropsChange('placeholder', value)}
        style={{flex: 1, marginTop: 3}}
        disabled={handleFieldsDisable()}
      />
    </div>
  );
}
