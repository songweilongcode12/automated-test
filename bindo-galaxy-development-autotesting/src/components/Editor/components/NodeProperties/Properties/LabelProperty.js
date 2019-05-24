import React from 'react';
import { Checkbox } from 'antd';
import StarLabel from '../../StarLabel';
import ActionInput from '../../ActionInput';

export default props => {
  const {
    t,
    field,
    view,
    prefix,
    onFieldPropsChange,
    onViewPropsChange,
    handleFieldsDisable,
  } = props;

  return (
    <div className={prefix}>
      <div className={`${prefix}-label`}>
        <StarLabel label={t('common:editor.label')} />
        <Checkbox
          checked={view.hiddenLabel || false}
          className={`${prefix}-label-display`}
          onChange={evt => onViewPropsChange('hiddenLabel', evt.target.checked)}
          disabled={handleFieldsDisable()}
        >
          {t('common:editor.hidden')}
        </Checkbox>
      </div>
      <ActionInput
        value={field.label}
        onOkClick={value => onFieldPropsChange('label', value)}
        style={{flex: 1, marginTop: 3}}
        disabled={handleFieldsDisable()}
      />
    </div>
  );
}
