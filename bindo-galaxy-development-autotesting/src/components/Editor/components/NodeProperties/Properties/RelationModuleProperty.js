import React, { Component } from 'react';
import {
  Select,
} from 'antd';
import StarLabel from '../../StarLabel';
import { isBindingExistingTable } from '../../../../../utils/module';
import { filterOption } from '../../../../../utils/galaxy';

class RelationModuleProperty extends Component {

  getRelatedModuleAndFields = () => {
    const {
      field: {
        allowValue = {},
      },
      getExistingModules,
    } = this.props;

    const {
      dynamicItemSource,
    } = allowValue || {};

    const {
      moduleID,
    } = dynamicItemSource || {};
    const existingModules = getExistingModules() || [];

    for (let i = 0; i < existingModules.length; i++) {
      const module = existingModules[i];
      if (module.id === moduleID) {
        const newFields = [...module.fields];
        if (!isBindingExistingTable(module)) {
          newFields.push({
            uuid: 'id',
            label: 'ID',
            name: 'id',
          });
        }

        return {existingModules, relatedModuleFields: newFields};
      }
    }

    return {existingModules, relatedModuleFields: []};
  }

  render () {

    const {
      t,
      prefix,
      // handleFieldsDisable,
      field,
    } = this.props;

    const {
      relation = {},
    } = field;

    const {
      relatedModuleID,
    } = relation || {};

    const {
      existingModules,
    } = this.getRelatedModuleAndFields();

    return (
      <div className={prefix}>
        <div className={`${prefix}-label`}>
          <StarLabel label={t('common:editor.selectExistingModule')} />
        </div>
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          value={relatedModuleID}
          style={{ width: '100%' }}
          disabled={true}
        >
          {
            existingModules.map(item =>
              <Select.Option key={item.id} value={item.id} disabled={true}>{item.name}</Select.Option>
            )
          }
        </Select>
      </div>
    )
  }
}

export default RelationModuleProperty;

