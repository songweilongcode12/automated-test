import React,{ Component } from 'react'
import { Form, Select } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'
import common from '../../../../constants/common'
import filtersConstant from '../../../../constants/filters'
import { createUuid } from '../../../../utils'
import { queryRecords } from '../../../../data/graphql/record'
import { filterOption } from '../../../../utils/galaxy'
import { runFormula } from '../../../../data/MqlParser'

let timeout;
let searchKey;

@hocParser()
class SelectionParser extends Component {
  state = {
    dynamicItems: [],
  }

  componentDidMount() {
    const {
      field,
      storeID,
    } = this.props;

    const {
      allowValue: {
        type,
      } = {},
    } = field;

    if (type === common.DYNAMIC) {
      this.loadRecords(storeID, field);
    }
  }

  loadRecords = async (storeID, field, filters = [], callback) => {
    const {
      allowValue: {
        dynamicItemSource = {},
      } = {},
      listens = [],
    } = field || {};

    const formulas = [];

    listens.forEach(item => {
      if (item && item.type === common.FILTER) {
        formulas.push({
          formula: item.formula,
        })
      }
    });

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
            formulas,
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
        field,
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

  render () {
    const {
      field = {},
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getFormItemProps,
    } = this.props;
    const viewProps = {
      ...getViewProps(),
      style: {
        width: '100%',
      },
    };

    const {
      name,
      allowMultiValue,
      allowValue: {
        type,
        staticItems = [],
        dynamicItemSource,
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
      viewProps.onSearch = this.handleSearch;
      if (Array.isArray(dynamicItems)) {
        dynamicItems.forEach(item => options.push({
          label: item.label,
          value: item.value,
          uuid: item.uuid,
        }));
      }
    }

    if (allowMultiValue) {
      viewProps.mode = common.MULTIPLE;
    }

    let initialValue = getInitialValue();
    if (type === common.DYNAMIC && lodash.isObject(initialValue) && lodash.isObject(initialValue.record)) {
      const {
        valueField,
      } = dynamicItemSource || {};
      const initValueTemp = {
        ...initialValue,
        ...initialValue.record,
      }
      initialValue = initValueTemp[valueField]
    }

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <Select
            showSearch
            {...viewProps}
            optionFilterProp="children"
            filterOption={filterOption}
          >
            {
              options.map(item => (
                <Select.Option key={item.uuid} value={item.value}>
                  {item.label}
                </Select.Option>
              ))
            }
          </Select>
        )}
      </Form.Item>
    );
  }
}

export default SelectionParser
