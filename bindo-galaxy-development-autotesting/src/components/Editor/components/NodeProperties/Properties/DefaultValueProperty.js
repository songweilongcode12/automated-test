import React from 'react';
import ActionInput from '../../ActionInput';

export default props => {
  const {
    t,
    field,
    prefix,
    onFieldPropsChange,
    handleFieldsDisable,
  } = props;

  return (
    <div className={prefix}>
      <div className={`${prefix}-label`}>
        {t('common:editor.defaultValue')}
      </div>
      <ActionInput
        value={field.defaultValue}
        onOkClick={value => onFieldPropsChange('defaultValue', value)}
        style={{flex: 1, marginTop: 3}}
        disabled={handleFieldsDisable()}
      />
    </div>
  );
}
