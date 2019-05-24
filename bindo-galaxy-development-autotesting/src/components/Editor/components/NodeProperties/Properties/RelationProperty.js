import React, { Component } from 'react'
import { Button, Modal, Select, Icon as AntdIcon } from 'antd'
import { createUuid } from '../../../../../utils'
// import { isBindingExistingTable } from '../../../../../utils/module'
import { filterOption } from '../../../../../utils/galaxy'

// 过滤系统设定数据,不应该映射

const filterFields = new Set([
  'id',
  'storeID',
  'updated_at',
  'created_at',
  '__is_global',
])

class RelationProperty extends Component {
  state = {
    editFieldMapping: false,
    fieldMapping: [],
  }

  handleOk = () => {
    const {
      fieldMapping = [],
    } = this.state;

    const {
      onRelationChange,
    } = this.props;

    onRelationChange('fieldMapping', fieldMapping);
    this.setState({
      editFieldMapping: false,
      fieldMapping: [],
    });
  }

  handleEditFieldMappingClick = () => {
    const {
      field: {
        relation = {},
      },
    } = this.props;

    const {
      fieldMapping = [],
    } = relation || {};

    this.setState({
      editFieldMapping: true,
      fieldMapping: [ ...fieldMapping ],
    });
  }

  handleAddFieldMapping = () => {
    const {
      fieldMapping = [],
    } = this.state;

    this.setState({
      fieldMapping: [
        ...fieldMapping,
        {
          uuid: createUuid(),
          field: '',
          relatedField: '',
        },
      ],
    });
  }

  handleEditFieldMapping = (uuid, key, value) => {
    const {
      fieldMapping = [],
    } = this.state;

    const newItems = [];
    fieldMapping.forEach(item => {
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
      fieldMapping: newItems,
    });
  }

  handleDeleteFieldMapping = uuid => {
    const {
      fieldMapping = [],
    } = this.state;

    const newItems = [];
    fieldMapping.forEach(item => {
      if (item.uuid !== uuid) {
        newItems.push(item);
      }
    })

    this.setState({
      fieldMapping: newItems,
    });
  }

  getRelatedFields = () => {
    const {
      field: {
        relation = {},
      },
      getExistingModules,
    } = this.props;

    const {
      relatedModuleID,
    } = relation || {};
    const existingModules = getExistingModules();

    for (let i = 0; i < existingModules.length; i++) {
      const module = existingModules[i];
      if (module.id === relatedModuleID) {
        let newFields = [...module.fields];
        // 过滤系统预留字段
        newFields = newFields.filter(item => !filterFields.has(item.name))
        // if (!isBindingExistingTable(module)) {
        //   // newFields.unshift({
        //   //   uuid: 'id',
        //   //   label: 'ID',
        //   //   name: 'id',
        //   // });
        // }
        return newFields;
      }
    }

    return [];
  }

  render() {
    const {
      t,
      getExistingFields,
    } = this.props;

    const {
      editFieldMapping = false,
      fieldMapping = [],
    } = this.state;

    const existingFields = getExistingFields();
    const relatedFields = this.getRelatedFields();

    return (
      <div style={{marginTop: 10}}>
        <Button
          type="primary"
          block
          onClick={this.handleEditFieldMappingClick}
        >
          {t('common:editor.editFieldMapping')}
        </Button>
        {
          editFieldMapping &&
          <Modal
            visible={true}
            title={t('common:editor.editFieldMapping')}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={this.handleOk}
            onCancel={() => this.setState({
              editFieldMapping: false,
            })}
            width="520px"
            bodyStyle={{ padding: 10 }}
          >
            {
              fieldMapping.length > 0 &&
              <div style={{ display: 'flex' }}>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.field')}
                </div>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.relatedField')}
                </div>
                <span style={{width: 32}} />
              </div>
            }
            {
              fieldMapping.map(item => (
                <div key={item.uuid} style={{ display: 'flex', margin: '5px 0' }}>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    value={item.field}
                    style={{width: '100%', flex: 1, margin: '0 3px'}}
                    onChange={value => this.handleEditFieldMapping(item.uuid, 'field', value)}
                  >
                    {
                      existingFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name}>
                          {fieldItem.label}
                        </Select.Option>
                      )
                    }
                  </Select>
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    value={item.relatedField}
                    style={{width: '100%', flex: 1, margin: '0 3px'}}
                    onChange={value => this.handleEditFieldMapping(item.uuid, 'relatedField', value)}
                  >
                    {
                      relatedFields.map(fieldItem =>
                        <Select.Option key={fieldItem.uuid} value={fieldItem.name}>
                          {fieldItem.label}
                        </Select.Option>
                      )
                    }
                  </Select>
                  <Button
                    style={{ padding: '0 8px' }}
                    onClick={() => this.handleDeleteFieldMapping(item.uuid)}
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
                onClick={this.handleAddFieldMapping}
              />
            </div>
          </Modal>
        }
      </div>
    );
  }
}

export default RelationProperty;
