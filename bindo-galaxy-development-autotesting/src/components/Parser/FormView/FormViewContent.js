
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Form,
} from 'antd';
import lodash from 'lodash';
import { createFormItem } from '../components/NodeParsers/ParserFactory';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import {
  findModule,
  findModuleByID,
} from '../../../utils/module';
import routes from '../../../constants/routes';
import {
  queryRecords,
  queryRecord,
} from '../../../data/graphql/record';
import common from '../../../constants/common';
import widgets from '../../../constants/widgets';
import reduxKey from '../../../constants/reduxKey';

const galaxyPrefix = 'bg-galaxy';
const fromPrefix = 'bg-c-parser-formview';

class ListViewContent extends Component {

  componentDidMount () {
    const {
      moduleType,
      onResetState,
    } = this.props;
    let {
      editableData = false,
    } = this.props;
    const { action } = parseParams(this.props);

    if (moduleType === common.SETTING) {
      this.loadRecords(this.props);
    } else {
      editableData = action === 'edit' || action === 'new';
      this.loadRecord(this.props);
    }

    onResetState({
      editableData,
    });
  }

  shouldComponentUpdate (nextProps) {
    const {
      moduleType,
      onResetState,
    } = this.props;
    let {
      editableData = false,
    } = this.props;
    const { moduleID } = parseParams(this.props);
    const { moduleID: nextModuleID, action } = parseParams(nextProps);
    if (moduleID !== nextModuleID) {
      if (moduleType === common.SETTING) {
        this.loadRecords(nextProps);
      } else {
        editableData = action === 'edit' || action === 'new';
        this.loadRecord(nextProps);
      }

      onResetState({
        editableData,
      });
    }

    return true;
  }

  loadRecord = async (props) => {
    const {
      storeID,
      moduleID,
      recordID,
      appID,
    } = parseParams(props);
    const {
      dispatch,
      onResetState,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    if (storeID) {
      let record = {};
      const {
        module,
        moduleParent,
      } = this.getModuleAndParent({
        props,
        storeID,
        appID,
        moduleID,
      });
      if (recordID) {
        const recordData = await queryRecord({
          storeID,
          moduleID,
          recordID,
          associates: ['*'],
        });

        record = this.getInitRecord(recordData, module);
      }

      onResetState({
        record,
        module,
        moduleParent,
      });

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: false,
        },
      });
    }
  }

  loadRecords = async (props) => {
    const {
      moduleID,
      storeID,
      appID,
    } = parseParams(props);
    const {
      dispatch,
      onResetState,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    if (storeID) {
      let record = {};
      const {
        module,
        moduleParent,
      } = this.getModuleAndParent({
        props,
        storeID,
        appID,
        moduleID,
      });

      try {
        const {
          recordLists = [],
        } = await queryRecords({
          storeID,
          moduleID,
          search: {
            page: 1,
            perPage: 10,
          },
          associates: ['*'],
        });

        if (recordLists.length > 0) {
          record = this.getInitRecord(recordLists[0], module);
        }

        onResetState({
          record,
          module,
          moduleParent,
        });
      } catch (error) {
        log.error(error)
      }
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  }

  getModuleAndParent = (props) => {
    const module = findModule(props) || {};
    const {
      moduleParentID = '',
    } = module;

    let moduleParent;
    if (lodash.isString(moduleParentID) && moduleParentID.length > 1) {
      moduleParent = findModuleByID({
        props: this.props,
        storeID: props.storeID,
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

    return {
      module,
      moduleParent,
    }
  }

  getInitRecord = (record, module) => {
    record = {
      id: record.id,
      key: record.id,
      moduleID: record.moduleID,
      ...record.record,
    };

    const {
      fields = [],
    } = module;
    fields.forEach(item => {
      const {
        viewType,
        name,
        allowValue = {},
      } = item || {};
      if (viewType === widgets.MANY_TO_ONE && name) {
        const {
          type: allowValueType,
          dynamicItemSource = {},
        } = allowValue || {}
        if (allowValueType === common.DYNAMIC) {
          let tempRecord = record[name];
          if (lodash.isObject(tempRecord) && lodash.isObject(tempRecord.record)) {
            tempRecord = {
              ...tempRecord,
              ...tempRecord.record,
            }

            const {
              exportFields = [],
              // valueField = '',
            } = dynamicItemSource || {};

            exportFields.forEach(exportField => {
              if (exportField.destField && exportField.fromField) {
                record[exportField.destField] = tempRecord[exportField.fromField];
              }
            });

            // record[name] = tempRecord[valueField];
          }
        }
      }
    })
    return record;
  };

  getUniqueFieldNamesSet = (module) => {
    const uniqueFieldNames = [];
    let {
      uniqueIndexes = [],
    } = module || {};
    uniqueIndexes = uniqueIndexes || [];
    uniqueIndexes.forEach(item => uniqueFieldNames.push(...(item.fields || [])))
    return new Set(uniqueFieldNames);
  }

  render () {
    const {
      form,
      moduleType,
      relationRecords = {},
      dispatch,
      module,
      moduleParent,
      editableData,
      record,
      storesAppsModulesMap,
      storesAppsMap,
    } = this.props;
    const {
      galaxyState,
      moduleID,
      action,
      storeID,
      appID,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      if (moduleType === common.SETTING) {
        return <Redirect to={createRouteUrl(routes.FORM_VIEW, {}, this.props)} />
      } else {
        return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
      }
    }

    const {
      fields: baseFields = [],
      template,
    } = module || {};

    const {
      fields: moduleParentFields = [],
      template: {
        form: moduleParentForm = [],
      } = {},
    } = moduleParent;

    const {
      form: baseViews = [],
    } = template || {};
    const formViews = [...moduleParentForm, ...baseViews]
    const fields = [...moduleParentFields, ...baseFields]

    return (
      <div className={`${galaxyPrefix}-content`}>
        <Form
          style={{ padding: '10px' }}
          className={`${fromPrefix}-form`}
        >
          {
            formViews.map(view =>
              createFormItem({
                view,
                form,
                recordData: record,
                fields,
                storeID,
                appID,
                moduleID,
                editableData,
                relationRecords,
                dispatch,
                action,
                uniqueFieldNamesSet: this.getUniqueFieldNamesSet(module),
                storesAppsModulesMap,
                storesAppsMap,
                prefix: 'bg-c-parser-node',
              })
            )
          }
        </Form>
      </div>
    );
  }
}

export default ListViewContent;
