import React,{ Component } from 'react'
import { Form, Select } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'
import filtersConstant from '../../../../constants/filters'
import common from '../../../../constants/common'
import { createUuid } from '../../../../utils'
import { queryRecords } from '../../../../data/graphql/record'
import { filterOption } from '../../../../utils/galaxy'

let timeout;
let searchKey;

@hocParser()
class ManyToOneParser extends Component {
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
        dynamicItemSource = {},
      } = {},
    } = field;

    this.loadRecords(storeID, dynamicItemSource);
  }

  loadRecords = async (storeID, dynamicItemSource, filters = [], callback) => {
    const {
      moduleID,
      displayField,
      valueField,
    } = dynamicItemSource || {};
    console.info(dynamicItemSource)

    const {
      getInitialValue,
    } = this.props;

    // 获取当前数据
    const initialValue = getInitialValue();

    // if (lodash.isObject(initialValue) && lodash.isObject(initialValue.record)) {
    //   const initValueTemp = {
    //     ...initialValue,
    //     ...initialValue.record,
    //   }
    //   initialValue = initValueTemp[valueField]
    // }

    if (storeID && moduleID) {
      const { recordLists = [] } = await queryRecords({
        storeID,
        moduleID,
        search: {
          page: 1,
          perPage: 50,
          filters,
        },
      });

      // 判断当前数据是否在recordLists 50条里 若不存在则把当前的数据push到recordLists里
      if (lodash.isObject(initialValue) && lodash.isObject(initialValue.record)) {
        const tempIDs = []
        recordLists.forEach(item => {
          tempIDs.push(item.id)
        })
        const tempIDsSet = new Set(tempIDs);

        if (!tempIDsSet.has(initialValue.id)) {
          recordLists.push(initialValue);
        }
      }

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
            ...item,
            $label: item[displayField],
            $value: item[valueField],
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
  }

  selectOnchange= (value) => {
    const { dynamicItems } = this.state;
    const {
      field,
      setFieldsValue,
    } = this.props

    const {
      allowValue: {
        dynamicItemSource: {
          exportFields = [],
          valueField,
        },
      } = {},
    } = field;

    let relatedData
    dynamicItems.forEach(item => {
      if(item[valueField] === value) {
        relatedData = item
      }
    })

    if (!lodash.isObject(relatedData)) return;

    const temp ={}
    for (let i = 0; i < exportFields.length; i++) {
      const {destField, fromField} = exportFields[i];
      let tempValue =relatedData[fromField];
      if (lodash.isObject(tempValue)) { // 是manytoone 或者 onetomany 则为object
        tempValue = tempValue.id;
      }
      temp[destField] = tempValue;
    }
    setFieldsValue(temp)
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

  render() {
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
      allowValue: {
        type,
        dynamicItemSource: {
          valueField,
        } = {},
      } = {},
    } = field;

    let initialValue = getInitialValue();
    if (type === common.DYNAMIC && lodash.isObject(initialValue) && lodash.isObject(initialValue.record)) {
      const initValueTemp = {
        ...initialValue,
        ...initialValue.record,
      }
      initialValue = initValueTemp[valueField]
    }

    const {
      dynamicItems,
    } = this.state;

    const options = [];
    let items = [];

    items = dynamicItems;
    viewProps.onSearch = this.handleSearch;
    if (Array.isArray(items)) {
      items.forEach(item => options.push({
        label: item.$label,
        value: item.$value,
        uuid: item.uuid,
      }));
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
            onChange={value => this.selectOnchange(value)}
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

export default ManyToOneParser
