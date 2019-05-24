import React, { Component } from 'react'
import lodash from 'lodash'
import { Radio, Button, Modal, Icon as AntdIcon } from 'antd'
import DynamicDataSourceProperty from './DynamicDataSourceProperty'
import StarLabel from '../../StarLabel'
import ActionInput from '../../ActionInput'
import Conditional from '../../Conditional'
import { formulaToCst, cstToFormula } from '../../../../../data/CstParser'
import common from '../../../../../constants/common'
import { createUuid } from '../../../../../utils'

class DataSourceProperty extends Component {
  state = {
    editOptions: false,
    staticItems: [],
    errorMessage: null,
    cstData: null,
    editFormulaUuid: '',
    showConditional: false,
  }

  handleTypeChange = evt => {
    const { onAllowValueChange } = this.props;
    onAllowValueChange('type', evt.target.value);
  }

  getTypeOptions = () => {
    const { t } = this.props;

    return [{
      label: t('common:editor.staticData'),
      value: common.STATIC,
    }, {
      label: t('common:editor.dynamicData'),
      value: common.DYNAMIC,
    }]
  }

  checkOptions = (staticItems, checkDisplayName = true) => {
    const { t } = this.props;
    const idSet = new Set();
    let errorMessage = null;
    for (let i = 0; i < staticItems.length; i++) {
      const item = staticItems[i];
      if (lodash.isEmpty(item.key)) {
        errorMessage = t('common:editor.idIsEmpty');
        break;
      }
      if (checkDisplayName && lodash.isEmpty(item.value)) {
        errorMessage = t('common:editor.displayNameIsEmpty');
        break;
      }

      if (idSet.has(item.key)) {
        errorMessage = t('common:editor.idIsRepeated');
        break;
      }

      idSet.add(item.key);
    }

    return errorMessage;
  }

  handleOk = () => {
    const {
      staticItems = [],
    } = this.state;
    const errorMessage = this.checkOptions(staticItems);

    if (errorMessage) {
      this.setState({
        errorMessage,
      });
    } else {
      const { onAllowValueChange } = this.props;
      onAllowValueChange('staticItems', staticItems);
      this.setState({
        editOptions: false,
        errorMessage: null,
      });
    }
  }

  handleEditOptions = () => {
    const {
      field: {
        allowValue = {},
      },
    } = this.props;

    const {
      staticItems = [],
    } = allowValue || {};

    this.setState({
      editOptions: true,
      staticItems: [ ...staticItems ],
    });
  }

  handleAddOption = () => {
    const {
      staticItems = [],
    } = this.state;

    this.setState({
      staticItems: [
        ...staticItems,
        {
          uuid: createUuid(),
          key: '',
          value: '',
        },
      ],
    });
  }

  handleEditOption = (uuid, key, value) => {
    const {
      staticItems = [],
    } = this.state;

    const newState = {};

    const newItems = [];
    staticItems.forEach(item => {
      if (item.uuid === uuid) {
        newItems.push({
          ...item,
          [key]: value,
        });
      } else {
        newItems.push(item);
      }
    })

    if (key === 'key') {
      newState.errorMessage = this.checkOptions(newItems, false);
    }

    this.setState({
      ...newState,
      staticItems: newItems,
    });
  }

  handleDeleteOption = uuid => {
    const {
      staticItems = [],
    } = this.state;

    const newItems = [];
    staticItems.forEach(item => {
      if (item.uuid !== uuid) {
        newItems.push(item);
      }
    })

    this.setState({
      staticItems: newItems,
    });
  }

  handleOptionFormulaClick = uuid => {
    const {
      staticItems = [],
    } = this.state;

    let staticItem = {};
    for (let i = 0; i < staticItems.length; i++) {
      const item = staticItems[i];
      if (item.uuid === uuid) {
        staticItem = item;
        break;
      }
    }
    const {
      formula = '',
    } = staticItem || {};

    this.setState({
      cstData: formulaToCst(formula),
      editFormulaUuid: uuid,
      showConditional: true,
      editOptions: false,
    });
  }

  handleFormulaOk = (cst) => {
    const {
      editFormulaUuid,
    } = this.state;

    this.handleEditOption(editFormulaUuid, 'formula', cstToFormula(cst))

    this.setState({
      cstData: null,
      editFormulaUuid: '',
      showConditional: false,
      editOptions: true,
    })
  }

  // 目前已经不在relation内获取关联的moduleID
  // getRelatedModuleID = () => {
  //   const {
  //     field: {
  //       relation = {},
  //     },
  //   } = this.props;

  //   const {
  //     relatedModuleID,
  //   } = relation || {};

  //   return relatedModuleID;
  // }

  getRelatedModuleID = () => {
    const {
      field: {
        allowValue = {},
      },
    } = this.props;

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    const {
      moduleID,
    } = dynamicItemSource

    return moduleID;
  }

  render() {
    const {
      t,
      field,
      prefix,
      getExistingFields,
      handleFieldsDisable,
    } = this.props;

    const {
      allowValue = {},
    } = field;

    const {
      type = common.STATIC,
    } = allowValue || {};

    const {
      editOptions,
      staticItems = [],
      errorMessage = null,
      showConditional = false,
      cstData,
    } = this.state;

    const disabled = handleFieldsDisable()

    return (
      <div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            <StarLabel label={t('common:editor.dataSource')} />
          </div>
          <Radio.Group
            value={type}
            options={this.getTypeOptions()}
            onChange={this.handleTypeChange}
          />
          {
            type === common.STATIC &&
            <div style={{marginTop: 10}}>
              <Button
                type="primary"
                block
                onClick={this.handleEditOptions}
              >
                {t('common:editor.editOptions')}
              </Button>
            </div>
          }
        </div>
        {
          type === common.DYNAMIC &&
          <DynamicDataSourceProperty
            getRelatedModuleID={this.getRelatedModuleID}
            {...this.props}
            selectModule
          />
        }
        {
          editOptions &&
          <Modal
            visible={true}
            title={t('common:editor.editOptions')}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={this.handleOk}
            onCancel={() => this.setState({
              editOptions: false,
              errorMessage: null,
            })}
            width="520px"
            bodyStyle={{ padding: 10 }}
            okButtonProps={{disabled}}
          >
            {
              staticItems.length > 0 &&
              <div style={{ display: 'flex' }}>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.ID')}
                </div>
                <div style={{flex: 1, margin: '0 5px'}}>
                  {t('common:editor.displayName')}
                </div>
                <span style={{width: 32}} />
              </div>
            }
            {
              staticItems.map(item => (
                <div key={item.uuid} style={{ display: 'flex', margin: '5px 0' }}>
                  <ActionInput
                    value={item.key}
                    onOkClick={value => this.handleEditOption(item.uuid, 'key', value)}
                    style={{flex: 1, margin: '0 3px'}}
                    disabled={disabled}
                  />
                  <ActionInput
                    value={item.value}
                    onOkClick={value => this.handleEditOption(item.uuid, 'value', value)}
                    style={{flex: 1, margin: '0 3px'}}
                    disabled={disabled}
                  />
                  <Button
                    style={{ padding: '0 8px', margin: '0 3px' }}
                    onClick={() => this.handleOptionFormulaClick(item.uuid)}
                    disabled={disabled}
                  >
                    <AntdIcon
                      type="filter"
                      theme="twoTone"
                      twoToneColor="#1890ff"
                    />
                  </Button>
                  <Button
                    style={{ padding: '0 8px' }}
                    onClick={() => this.handleDeleteOption(item.uuid)}
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
                onClick={this.handleAddOption}
                disabled={disabled}
              />
              {
                errorMessage &&
                <div
                  style={{
                    flex: 1,
                    margin: '0 5px',
                    height: '32px',
                    lineHeight: '32px',
                    color: 'red',
                    textAlign: 'right',
                    fontWeight: 500,
                  }}
                >
                  {errorMessage}
                </div>
              }
            </div>
          </Modal>
        }
        {
          showConditional &&
          <Conditional
            getExistingFields={getExistingFields}
            onCancel={() => this.setState({
              cstData: null,
              editFormulaUuid: '',
              showConditional: false,
              editOptions: true,
            })}
            data={cstData}
            onSubmit={this.handleFormulaOk}
          />
        }
      </div>
    );
  }
}

export default DataSourceProperty;
