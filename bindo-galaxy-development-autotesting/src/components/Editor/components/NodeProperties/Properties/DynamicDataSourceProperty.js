import React, { Component } from 'react'
import { Button, Modal, Select, Icon as AntdIcon } from 'antd'
import lodash from 'lodash'
import StarLabel from '../../StarLabel'
import { createUuid } from '../../../../../utils'
import { isBindingExistingTable } from '../../../../../utils/module'
import { filterOption } from '../../../../../utils/galaxy'

class DynamicDataSourceProperty extends Component {
  state = {
    editExportFields: false,
    exportFields: [],
  }

  handleOk = () => {
    const {
      exportFields = [],
    } = this.state;

    const {
      field: {
        allowValue = {},
      } = {},
      onAllowValueChange,
    } = this.props;

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    onAllowValueChange('dynamicItemSource', {
      ...dynamicItemSource,
      exportFields,
    });
    this.setState({
      editExportFields: false,
      exportFields: [],
    });
  }

  handleTypeChange = evt => {
    const { onAllowValueChange } = this.props;
    onAllowValueChange('type', evt.target.value);
  }

  handleDynamicDataSourceChange = (key, value) => {
    const {
      field: {
        allowValue = {},
      } = {},
      onAllowValueChange,
    } = this.props;

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    onAllowValueChange('dynamicItemSource', {
      ...dynamicItemSource,
      [key]: value,
    });
  }

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
        allowValue = {},
      },
    } = this.props;

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    let {
      exportFields, // 后台传入默认值为null, 需转换为[]
    } = dynamicItemSource || {};

    if(lodash.isEmpty(exportFields)){
      exportFields = [];
    }

    this.setState({
      editExportFields: true,
      exportFields: [ ...exportFields ],
    });
  }

  render() {
    const {
      t,
      field,
      prefix,
      selectModule,
      getExistingFields,
      handleFieldsDisable,
    } = this.props;

    const {
      allowValue = {},
    } = field;

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    const {
      moduleID,
      displayField,
      valueField,
    } = dynamicItemSource || {};

    const {
      existingModules,
      relatedModuleFields,
    } = this.getRelatedModuleAndFields();

    const existingFields = getExistingFields();
    const relatedFields = this.getRelatedFields();

    const {
      editExportFields = false,
      exportFields = [],
    } = this.state;

    const disabled = handleFieldsDisable()

    return (
      <div>
        {
          selectModule &&
          <div className={prefix}>
            <div className={`${prefix}-label`}>
              <StarLabel label={t('common:editor.selectExistingModule')} />
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleDynamicDataSourceChange('moduleID', value)}
              value={moduleID}
              style={{ width: '100%' }}
              disabled={handleFieldsDisable()}
            >
              {
                existingModules.map(item =>
                  <Select.Option key={item.id} value={item.id} disabled={handleFieldsDisable()}>{item.name}</Select.Option>
                )
              }
            </Select>
          </div>
        }
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            <StarLabel label={t('common:editor.selectIdentificationField')} />
          </div>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            onChange={value => this.handleDynamicDataSourceChange('valueField', value)}
            value={valueField}
            style={{ width: '100%' }}
            disabled={handleFieldsDisable()}
          >
            {
              relatedModuleFields.map(item =>
                <Select.Option key={item.name} value={item.name} disabled={handleFieldsDisable()}>
                  {item.label}
                </Select.Option>
              )
            }
          </Select>
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            <StarLabel label={t('common:editor.selectDisplayField')} />
          </div>
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={filterOption}
            onChange={value => this.handleDynamicDataSourceChange('displayField', value)}
            value={displayField}
            style={{ width: '100%' }}
            disabled={handleFieldsDisable()}
          >
            {
              relatedModuleFields.map(item =>
                <Select.Option key={item.name} value={item.name} disabled={handleFieldsDisable()}>
                  {item.label}
                </Select.Option>
              )
            }
          </Select>
        </div>
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
                  >
                    {
                      existingFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name} disabled={disabled}>
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
                  >
                    {
                      relatedFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name} disabled={disabled}>
                          {fieldItem.label}
                        </Select.Option>
                      )
                    }
                  </Select>
                  <Button
                    style={{ padding: '0 8px' }}
                    onClick={() => this.handleDeleteExportFields(item.uuid)}
                    disabled={disabled}
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
                disabled={disabled}
              />
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default DynamicDataSourceProperty;
