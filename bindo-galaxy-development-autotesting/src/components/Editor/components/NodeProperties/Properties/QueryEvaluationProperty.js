import React, { Component } from 'react'
import { Button, Modal, Select, Icon as AntdIcon } from 'antd'
import lodash from 'lodash'
import { createUuid } from '../../../../../utils'
import { isBindingExistingTable } from '../../../../../utils/module'
import { filterOption } from '../../../../../utils/galaxy'
import common from '../../../../../constants/common';

class QueryEvaluationProperty extends Component {

  state = {
    editExportFields: false,
    exportFields: [],
  }

  handleOk = () => {
    const {
      exportFields = [],
    } = this.state;

    const {
      onQueryEvaluationChange,
    } = this.props;

    onQueryEvaluationChange('exportFields', exportFields);
    this.setState({
      editExportFields: false,
      exportFields: [],
    });
  }

  getRelatedFields = () => {
    const {
      getExistingModules,
      getRelatedModuleID,
    } = this.props;
    const relatedModuleID = getRelatedModuleID();
    const existingModules = getExistingModules();

    for (let i = 0; i < existingModules.length; i++) {
      const module = existingModules[i];
      if (module.id === relatedModuleID) {
        const newFields = [...module.fields];
        if (!isBindingExistingTable(module)) {
          newFields.push({
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

  handleSelectFieldsChange = (values) => {
    const {
      onQueryEvaluationChange,
    } = this.props;

    let selectFields = [];
    if (lodash.isArray(values)) {
      selectFields = values;
    } else if (lodash.isString(values)) {
      selectFields = [values];
    }

    onQueryEvaluationChange('selectFields', selectFields)
  }

  handleAddExportFields = () => {
    const {
      exportFields = [],
    } = this.state;

    this.setState({
      exportFields: [
        ...exportFields,
        {
          uuid: createUuid(),
        },
      ],
    });
  }

  handleEditExportFields = (uuid, key, value) => {
    const {
      exportFields = [],
    } = this.state;

    const newItems = [];
    exportFields.forEach(item => {
      if (item.uuid === uuid) {
        newItems.push({
          ...item,
          [key]: value,
        });
      } else {
        newItems.push(item);
      }
    });

    this.setState({
      exportFields: newItems,
    });
  }

  handleDeleteExportFields = uuid => {
    const {
      exportFields = [],
    } = this.state;

    const newItems = [];
    exportFields.forEach(item => {
      if (item.uuid !== uuid) {
        newItems.push(item);
      }
    })

    this.setState({
      exportFields: newItems,
    });
  }

  handleEditExportFieldsClick = () => {
    const {
      field: {
        queryEvaluation = {},
      },
    } = this.props;

    const {
      exportFields = [],
    } = queryEvaluation || {};

    this.setState({
      editExportFields: true,
      exportFields: [ ...exportFields ],
    });
  }

  render() {
    const {
      t,
      prefix,
      field,
      onQueryEvaluationChange,
      getExistingFields,
      uneditableType,
      multiple = true,
      selectDisplayField = true,
      handleFieldsDisable,
    } = this.props;

    const {
      queryEvaluation = {},
    } = field;

    const {
      type,
      selectFields = [],
    } = queryEvaluation || {};

    const existingFields = getExistingFields();
    const relatedFields = this.getRelatedFields();

    const multipleProps = {};
    if (multiple) {
      multipleProps.mode = 'multiple';
    }

    const {
      editExportFields = false,
      exportFields = [],
    } = this.state;

    const disabled = handleFieldsDisable()

    return (
      <div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.evaluationType')}
          </div>
          <Select
            value={type}
            style={{width: '100%', marginTop: 10}}
            disabled={uneditableType || handleFieldsDisable()}
            onChange={value => onQueryEvaluationChange('type', value)}
          >
            <Select.Option key="plain" value={common.PLAIN}>
              {t('common:editor.plain')}
            </Select.Option>
            <Select.Option key="aggregate" value={common.AGGREGATE}>
              {t('common:editor.aggregate')}
            </Select.Option>
          </Select>
        </div>
        {
          selectDisplayField &&
          <div className={prefix}>
            <div className={`${prefix}-label`}>
              {t('common:editor.selectDisplayField')}
            </div>
            <Select
              {...multipleProps}
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              style={{width: '100%'}}
              placeholder={t('common:module.moduleFieldsPlaceholder')}
              onChange={this.handleSelectFieldsChange}
              value={selectFields}
              disabled={handleFieldsDisable()}
            >
              {
                relatedFields.map(fieldItem => (
                  <Select.Option key={fieldItem.uuid} value={fieldItem.name}>
                    {fieldItem.label}
                  </Select.Option>
                ))
              }
            </Select>
          </div>
        }
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.exportFields')}
          </div>
          <Button
            type="primary"
            block
            onClick={this.handleEditExportFieldsClick}
          >
            {t('common:editor.editExportFields')}
          </Button>
        </div>
        {
          editExportFields &&
          <Modal
            visible={true}
            title={t('common:editor.editExportFields')}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={this.handleOk}
            onCancel={() => this.setState({
              editExportFields: false,
            })}
            width="520px"
            bodyStyle={{ padding: 10 }}
            okButtonProps={{disabled}}
          >
            {
              exportFields.length > 0 &&
              <div style={{ display: 'flex' }}>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.destField')}
                </div>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.fromField')}
                </div>
                <span style={{width: 32}} />
              </div>
            }
            {
              exportFields.map(item => (
                <div key={item.uuid} style={{ display: 'flex', margin: '5px 0' }}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    value={item.destField}
                    style={{width: '100%', flex: 1, margin: '0 3px'}}
                    onChange={value => this.handleEditExportFields(item.uuid, 'destField', value)}
                    disabled={handleFieldsDisable()}
                  >
                    {
                      existingFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name} disabled={handleFieldsDisable()}>
                          {fieldItem.label}
                        </Select.Option>
                      )
                    }
                  </Select>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    value={item.fromField}
                    style={{width: '100%', flex: 1, margin: '0 3px'}}
                    onChange={value => this.handleEditExportFields(item.uuid, 'fromField', value)}
                    disabled={handleFieldsDisable()}
                  >
                    {
                      relatedFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name} disabled={handleFieldsDisable()}>
                          {fieldItem.label}
                        </Select.Option>
                      )
                    }
                  </Select>
                  <Button
                    style={{ padding: '0 8px' }}
                    onClick={() => this.handleDeleteExportFields(item.uuid)}
                    disabled={handleFieldsDisable()}
                  >
                    <AntdIcon
                      type="delete"
                      theme="twoTone"
                      twoToneColor="#eb2f96"
                    />
                  </Button>
                </div>
              ))
            }
            <div style={{ display: 'flex' }}>
              <Button
                icon="plus"
                onClick={this.handleAddExportFields}
                disabled={handleFieldsDisable()}
              />
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default QueryEvaluationProperty;
