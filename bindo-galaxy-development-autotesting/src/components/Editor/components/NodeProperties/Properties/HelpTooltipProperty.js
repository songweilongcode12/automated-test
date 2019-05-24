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
        {t('common:editor.helpTooltip')}
      </div>
      <ActionInput
        value={view.helpTooltip}
        onOkClick={value => onViewPropsChange('helpTooltip', value)}
        style={{flex: 1, marginTop: 3}}
        disabled={handleFieldsDisable()}
      />
    </div>
  );
}
