import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Modal, Form } from 'antd';
import { createFormItem } from './NodeParsers/ParserFactory';
import {
  parseModuleFormData,
} from '../../../utils/galaxy';

@translate()
@Form.create()
class ModuleFormModal extends Component {
  handleOk = () => {
    const {
      form,
      onSave,
      onEdit,
      module,
      moduleID,
      storeID,
      appID,
      recordData,
      relationRecords = {},
    } = this.props;
    if (typeof onSave !== 'function') {
      return;
    }

    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      try {
        const { id, $id } = recordData || {};
        const moduleRelationRecords = relationRecords[moduleID] || {};
        const newData = parseModuleFormData({
          data: values,
          sourceData: recordData,
          module,
          props: this.props,
          storeID,
          appID,
          moduleRelationRecords,
        });
        if (id && typeof onEdit === 'function') {
          onEdit(newData);
        } else if (!id && typeof onSave === 'function') {
          if ($id) {
            newData.key = $id;
            newData.$id = $id;
          }
          onSave(newData);
        }
      } catch (error) {
        log.error(error)
      }
    });
  }

  render () {
    const {
      t,
      title = '',
      form,
      storeID,
      appID,
      moduleID,
      module,
      moduleParent,
      recordData,
      relationRecords = {},
      dispatch,
      onCancel,
      disabled,
      uniqueFieldNamesSet = new Set(),
      storesAppsModulesMap = new Map(),
      storesAppsMap = new Map(),
    } = this.props;
    const { id, $id } = recordData || {};
    // const { fields = [], template = {} } = module || {};
    // const { form: formViews = [] } = template || {};

    const action = (id || $id) ? 'edit' : 'new';

    const {
      fields: baseFields = [],
      template = [],
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
    log.info('formViews', formViews)
    log.info('fields', fields)

    return (
      <Modal
        visible={true}
        centered={true}
        closable={false}
        width="60%"
        title={
          <div style={{ textAlign: 'center' }}>
            {`${(id || $id) ? t('common:edit') : t('common:new')} ${title}`}
          </div>
        }
        onOk={this.handleOk}
        bodyStyle={{ padding: '12px 24px' }}
        onCancel={onCancel}
      >
        <Form style={{ padding: '0 10px' }}>
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
                editableData: !disabled,
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
        </Form>
      </Modal>
    );
  }
}

export default ModuleFormModal;
