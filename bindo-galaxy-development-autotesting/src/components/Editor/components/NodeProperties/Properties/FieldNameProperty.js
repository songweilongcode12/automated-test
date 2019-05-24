import React from 'react';
import { Checkbox, Select } from 'antd';
import StarLabel from '../../StarLabel';
import ActionInput from '../../ActionInput';
import { filterOption } from '../../../../../utils/galaxy'

export default props => {
  const {
    t,
    field,
    prefix,
    isBindTable,
    isNewField,
    onFieldPropsChange,
    getUnboundFields,
  } = props;

  return (
    <div className={prefix}>
      <div className={`${prefix}-label`}>
        <StarLabel label={t('common:editor.fieldName')} />
        {
          isBindTable &&
          <Checkbox
            checked={field.isBindField}
            disabled={!isNewField}
            className={`${prefix}-label-display`}
            onChange={evt => onFieldPropsChange('isBindField', evt.target.checked)}
          >
            {t('common:editor.bindExistingField')}
          </Checkbox>
        }
      </div>
      {
        !field.isBindField &&
        <ActionInput
          value={field.name}
          disabled={!isNewField}
          onOkClick={value => {
            const name = value.replace(/\s/g, '');
            onFieldPropsChange('name', name);
          }}
        />
      }
      {
        field.isBindField &&
        <Select
          showSearch
          placeholder={t('common:module.tableFieldPlaceholder')}
          optionFilterProp="children"
          style={{width: '100%'}}
          onChange={value => {
            const name = value.replace(/\s/g, '');
            onFieldPropsChange('name', name);
          }}
          value={field.name}
          filterOption={filterOption}
        >
          {
            getUnboundFields().map(model =>
              <Select.Option disabled={!isNewField} key={model.name} value={model.name}>{model.label || model.name}</Select.Option>
            )
          }
        </Select>
      }
    </div>
  );
}
