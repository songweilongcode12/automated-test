import React,{ Component } from 'react'
import { Form } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'
import {
  findModuleByID,
} from '../../../../utils/module'
import { createFormItem } from './ParserFactory';

@hocParser()
class OneToOneParser extends Component {
  state = {
    relatedModule: {},
    relatedModuleParent: {
      fields: [],
      template: {
        form: [],
      },
    },
  }

  componentDidMount() {
    this.loadRelationModule();
  }

  loadRelationModule = async () => {

    const {
      relatedModuleID,
    } = this.getFieldRelation();

    const {
      storeID,
    } = this.props;

    const module = findModuleByID({
      props: this.props,
      storeID,
      moduleID: relatedModuleID,
    })

    const {
      moduleParentID = '',
    } = module;

    let moduleParent;
    if (lodash.isString(moduleParentID) && moduleParentID.length > 1) {
      moduleParent = findModuleByID({
        props: this.props,
        storeID,
        moduleID: moduleParentID,
      })
    }

    if (lodash.isEmpty(moduleParent)) {
      moduleParent = {
        fields: [],
        template: {
          form: [],
        },
      }
    }

    this.setState({
      relatedModule: this.modifyModuleFields(module),
      relatedModuleParent: this.modifyModuleFields(moduleParent),
    });
  }

  modifyModuleFields = (module) => {
    const cloneModule = lodash.cloneDeep(module);
    const {
      fields = [],
    } = cloneModule;

    const {
      field,
    } = this.props;

    const {
      name,
      relation,
    } = field;

    const {
      relatedModuleID = '',
    } = relation;

    fields.forEach(item => {
      item.name = `${relatedModuleID}_${name}_${item.name}`
    });

    return cloneModule;
  }

  getFieldRelation = () => {
    const {
      field,
    } = this.props;
    const {
      relation = {},
    } = field || {};
    const {
      relatedModuleID,
    } = relation || {};

    return {
      relatedModuleID,
    };
  }

  getInitRecord = ({record, fieldName, moduleID}) => {
    if (!lodash.isObject(record) || !record.id) {
      return {};
    }
    let innerRecord = {}

    if (record && record.record) {
      innerRecord = record.record;
    }
    const newRecord = {};
    Object.keys(innerRecord).forEach(key => {
      newRecord[`${moduleID}_${fieldName}_${key}`] = innerRecord[key];
    })

    return {
      id: record.id,
      key: record.id,
      moduleID: record.moduleID,
      ...newRecord,
    }
  };

  render () {
    const {
      field,
      getFormItemProps,
      form,
      storeID,
      appID,
      moduleID,
      editableData,
      relationRecords,
      dispatch,
      action,
      initialValue,
      uniqueFieldNamesSet = new Set(),
      storesAppsModulesMap = new Set(),
      storesAppsMap = new Set(),
    } = this.props;

    const {
      name,
      relation,
    } = field || {};

    const {
      relatedModuleID = '',
    } = relation || {};

    const {
      relatedModule,
      relatedModuleParent,
    } = this.state;

    const {
      fields: relatedFields = [],
      template,
    } = relatedModule || {};

    const {
      fields: moduleParentFields = [],
      template: {
        form: moduleParentForm = [],
      },
    } = relatedModuleParent;

    const {
      form: relatedViews = [],
    } = template || {};
    const formViews = [ ...moduleParentForm , ...relatedViews]
    const fields = [ ...moduleParentFields, ...relatedFields ]
    const recordData = this.getInitRecord({
      record: initialValue,
      fieldName: name,
      moduleID: relatedModuleID,
    });

    return (
      <Form.Item {...getFormItemProps()}>
        {
          formViews.map(view =>
            createFormItem({
              view,
              form,
              recordData,
              fields,
              storeID,
              appID,
              moduleID,
              editableData,
              relationRecords,
              dispatch,
              action,
              uniqueFieldNamesSet,
              storesAppsModulesMap,
              storesAppsMap,
              prefix: 'bg-c-parser-node',
            })
          )
        }
      </Form.Item>
    );
  }
}

export default OneToOneParser
