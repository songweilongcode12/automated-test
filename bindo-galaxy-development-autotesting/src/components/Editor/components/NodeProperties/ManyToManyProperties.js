import React, { Component } from 'react'
import { Select } from 'antd'
import hocProperties from './hocProperties'
import BaseProperties from './BaseProperties'
import { isBindingExistingTable } from '../../../../utils/module'
import { filterOption } from '../../../../utils/galaxy'

@hocProperties()
class ManyToManyProperties extends Component {
  getRelatedFields = () => {
    const {
      field: {
        relation = {},
      },
      getExistingModules,
    } = this.props;

    const {
      relatedModuleID,
    } = relation || {};
    const existingModules = getExistingModules();

    for (let i = 0; i < existingModules.length; i++) {
      const module = existingModules[i];
      if (module.id === relatedModuleID) {
        const newFields = [...module.fields];
        if (!isBindingExistingTable(module)) {
          newFields.unshift({
            uuid: 'id',
            label: 'ID',
            name: 'id',
          });
        }

        return newFields;
      }
    }

    return [];
  }

  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      searchableFields = [],
    } = view;

    const relatedFields = this.getRelatedFields();

    return (
      <BaseProperties
        {...this.props}
        placeholder
        selectModule
        required={false}
      >
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.searchableFields')}
          </div>
          <Select
            value={searchableFields}
            mode="multiple"
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            style={{width: '100%', flex: 1, margin: '0 3px'}}
            onChange={values => onViewPropsChange('searchableFields', values)}
          >
            {
              relatedFields.map(fieldItem =>
                <Select.Option key={fieldItem.uuid} value={fieldItem.name}>
                  {fieldItem.label}
                </Select.Option>
              )
            }
          </Select>
        </div>
      </BaseProperties>
    );
  }
}

export default ManyToManyProperties;
