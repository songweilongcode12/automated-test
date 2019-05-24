import React, { Component } from 'react';
import { Modal, Form, Button } from 'antd';
import lodash from 'lodash';
import reduxKey from '../../../constants/reduxKey'
import { createFormItem } from '../components/NodeParsers/ParserFactory';
import {
  parseModuleFormData,
} from '../../../utils/galaxy';

@Form.create()
class SchedulerModuleFormModal extends Component {
  handleOk = () => {
    const {
      form,
      relationRecords = {},
      dispatch,
      moduleID,
      storeID,
      appID,
      moduleParent,
      module,
      onSave,
      record,
    } = this.props;

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      const moduleRelationRecords = relationRecords[moduleID] || {};

      // 需要把moduleParent插入到module里
      if (!lodash.isEmpty(moduleParent)) {
        module.moduleParent = moduleParent;
      }

      const data = parseModuleFormData({
        data: values,
        sourceData: record,
        module,
        props: this.props,
        storeID,
        appID,
        moduleRelationRecords,

      });
      onSave(data);
    });
  }

  handleDelete = () => {
    const {
      resetParentState,
    } = this.props;
    resetParentState();
  }

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
      t,
      form,
      editableData,
      record,
      moduleID,
      action,
      appID,
      storeID,
      relationRecords = {},
      onCancel,
      dispatch,
      module,
      moduleParent,
      storesAppsModulesMap,
      storesAppsMap,
    } = this.props;

    const {
      id,
    } = record || {};

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
      <Modal
        visible={true}
        centered={true}
        closable={false}
        width="60%"
        title={
          <div style={{ textAlign: 'center' }}>
            {`${id ? t('common:edit') : t('common:new')}`}
          </div>
        }
        bodyStyle={{ padding: '12px 24px' }}
        footer={[
          <Button key="cancel" onClick={onCancel}>{t('common:cancel')}</Button>,
          ...(id ? [<Button key="delete" type='danger' onClick={this.handleDelete}>{t('common:delete')}</Button>] : []),
          <Button key="ok" type="primary" onClick={this.handleOk}>{t('common:ok')}</Button>,
        ]}
      >
        <Form
          style={{ padding: '10px' }}
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
      </Modal>
    );
  }
}

export default SchedulerModuleFormModal;
