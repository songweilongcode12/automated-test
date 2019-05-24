import React, { Component }from 'react'
import {
  Select,
} from 'antd'
import lodash from 'lodash'
import common from '../../../../../constants/common'
import { queryRecords } from '../../../../../data/graphql/record'
import { createUuid } from '../../../../../utils'
import filtersConstant from '../../../../../constants/filters'
import { runFormula } from '../../../../../data/MqlParser'

let timeout;
let searchKey;

class SelectDefaultProperty extends Component {
  state = {
    dynamicItems: [],
  }

  handleOnFocus = () => {
    const {
      field,
      storeID,
    } = this.props;

    const {
      allowValue={},
    } = field;

    const {
      type,
      dynamicItemSource = {},
    } = allowValue;

    if (type === common.DYNAMIC) { // 若是动态数据
      this.loadRecords(storeID, dynamicItemSource);
    }
  }

  loadRecords = async (storeID, dynamicItemSource, filters = [], callback) => {
    const {
      moduleID,
      displayField,
      valueField,
    } = dynamicItemSource || {};

    try {
      if (storeID && moduleID) {
        const { recordLists = [] } = await queryRecords({
          storeID,
          moduleID,
          search: {
            page: 1,
            perPage: 20,
            filters,
          },
        });
        if (lodash.isArray(recordLists)) {
          const dynamicItems = [];
          recordLists.forEach(item => {
            if (item.record) {
              item = {
                ...item,
                ...item.record,
              }
            }

            dynamicItems.push({
              label: item[displayField],
              value: item[valueField],
              uuid: createUuid(),
            })
          });
          if (typeof callback === 'function') {
            callback(dynamicItems);
          } else {
            this.setState({ dynamicItems });
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  handleSearch = (value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    searchKey = value;
    timeout = setTimeout(() => {
      const {
        field,
        storeID,
      } = this.props;

      const {
        allowValue: {
          dynamicItemSource = {},
        } = {},
      } = field;

      const {
        displayField,
      } = dynamicItemSource || {};

      const filters = [{
        fieldName: `${displayField}`,
        fieldType: 'string',
        condition: filtersConstant.LIKE,
        values: [value],
      }];

      this.loadRecords(
        storeID,
        dynamicItemSource,
        filters,
        dynamicItems => {
          if (searchKey === value) {
            this.setState({ dynamicItems });
          }
        },
      );
    }, 300);
  }

  getStaticOptions = (staticItems) => {
    const options = [];
    const {
      getFieldValue,
    } = this.props;

    if (!Array.isArray(staticItems)) {
      return options;
    }

    staticItems.forEach(item => {
      const {
        formula = '',
      } = item;

      let formulaValue = true;
      if (lodash.isString(formula) && formula.length > 0) {
        formulaValue = runFormula(formula, {
          selfFieldCallback: fieldName => getFieldValue(fieldName),
        });
      }

      if (formulaValue) {
        options.push({
          label: item.value,
          value: item.key,
          uuid: item.uuid,
        });
      }
    });

    return options;
  }

  render() {
    const {
      t,
      prefix,
      field,
      onFieldPropsChange,
    } = this.props;

    const {
      allowValue: {
        type,
        staticItems = [],
      } = {},
    } = field;

    const {
      dynamicItems,
    } = this.state;

    const options = [];

    if (type === common.STATIC) {
      if (Array.isArray(staticItems)) {
        options.push(...this.getStaticOptions(staticItems));
      }
    } else if (type === common.DYNAMIC) {
      if (Array.isArray(dynamicItems)) {
        dynamicItems.forEach(item => options.push({
          label: item.label,
          value: item.value,
          uuid: item.uuid,
        }));
      }
    }

    return (
      <div className={prefix}>
        <div className={`${prefix}-label`}>
          {t('common:editor.defaultValue')}
        </div>
        <Select
          value={field.defaultValue}
          onChange={value => onFieldPropsChange('defaultValue', value)}
          style={{flex: 1, marginTop: 3, width: '100%'}}
          onFocus={this.handleOnFocus}
          showSearch
          allowClear={true}
        >
         {
            options.map(item => (
              <Select.Option key={item.uuid} value={item.value}>
                {item.label}
              </Select.Option>
            ))
          }
        </Select>
      </div>
    );
  }
}
export default SelectDefaultProperty;
