import React, { Component } from 'react'
import { Form, Radio } from 'antd'
import lodash from 'lodash';
import hocParser from './hocParser'
import common from '../../../../constants/common'
import { createUuid } from '../../../../utils'
import { queryRecords } from '../../../../data/graphql/record'
import { runFormula } from '../../../../data/MqlParser'

@hocParser()
class RadioParser extends Component {
  state = {
    dynamicItems: [],
  }

  componentDidMount () {
    const {
      field,
      storeID,
    } = this.props;

    const {
      allowValue: {
        type,
        dynamicItemSource = {},
      } = {},
    } = field;

    if (type === common.DYNAMIC) {
      this.loadRecords(storeID, dynamicItemSource);
    }
  }

  loadRecords = async (storeID, dynamicItemSource) => {
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
          },
        });
        if (Array.isArray(recordLists)) {
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

          this.setState({ dynamicItems });
        }
      }
    } catch (error) {
      console.error(error)
    }
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
      field,
      getViewProps,
      getFieldDecorator,
      getInitialValue,
      getRules,
      getFormItemProps,
    } = this.props;

    const {
      name,
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
        }))
      }
    }

    const viewProps = {
      ...getViewProps(),
      options,
      style: {
        width: '100%',
      },
    };

    return (
      <Form.Item {...getFormItemProps()}>
        {getFieldDecorator(name, {
          initialValue: getInitialValue(),
          rules: getRules(),
        })(
          <Radio.Group {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default RadioParser;
