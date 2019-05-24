import React, { Component } from 'react'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Modal, Select, Input } from 'antd'
import SelectActions from './SelectActions'
import { createUuid } from '../../../../utils';
import common from '../../../../constants/common';

@translate()
class SetFuncBtnsModal extends Component {
  state = {
    funcBtnData: {
      icon: '',
      iconType: '',
      params: {
        preActions: [{
          uuid: createUuid(),
          scriptName: '',
        }],
        afterActions: [{
          uuid: createUuid(),
          scriptName: '',
        }],
      },
      scriptName: '',
      actionType: common.BIND_ACTION,
      status: common.ACTIVE,
      title: '',
      type: common.CUSTOM,
      uuid: createUuid(),
    },
  }

  handleOk = () => {
    const {
      onOk = () => {},
    } = this.props;

    const {
      funcBtnData,
    } = this.state;

    if (!funcBtnData.scriptName || !funcBtnData.title) {
      return;
    }

    const {
      preActions = [],
      afterActions = [],
    } = funcBtnData.params;
    let actions = [];
    preActions.forEach(item => {
      if (item && item.scriptName) {
        actions.push(item);
      }
    })

    if (actions.length > 0) {
      funcBtnData.params.preActions = actions;
    } else {
      delete funcBtnData.params.preActions;
    }

    actions = [];
    afterActions.forEach(item => {
      if (item && item.scriptName) {
        actions.push(item);
      }
    })

    if (actions.length > 0) {
      funcBtnData.params.afterActions = actions;
    } else {
      delete funcBtnData.params.afterActions;
    }

    onOk(funcBtnData);
  }

  handleFuncBtnDataChange = (key, value) => {
    const {
      funcBtnData = {},
    } = this.state;

    this.setState({
      funcBtnData: {
        ...funcBtnData,
        [key]: value,
      },
    })
  }

  handleParamsActionChange = (data, type) => {
    const {
      funcBtnData = {},
    } = this.state;

    const actions = funcBtnData.params[type] || [];

    const newActions = [];
    actions.forEach(item => {
      if (item.uuid === data.uuid) {
        newActions.push(data);
      } else {
        newActions.push(item);
      }
    });
    funcBtnData.params[type] = newActions;

    this.setState({
      funcBtnData: { ...funcBtnData },
    })
  }

  handleParamsActionAdd = (index, type) => {
    const {
      funcBtnData = {},
    } = this.state;

    const actions = funcBtnData.params[type] || [];

    actions.splice(
      index+1,
      0,
      {
        uuid: createUuid(),
        scriptName: '',
      }
    );

    this.setState({
      funcBtnData: { ...funcBtnData },
    })
  }

  handleParamsActionRemove = (uuid, type) => {
    const {
      funcBtnData = {},
    } = this.state;

    const actions = funcBtnData.params[type] || [];

    if (actions.length < 2) {
      return;
    }

    const newActions = [];
    actions.forEach(item => {
      if (item.uuid !== uuid) {
        newActions.push(item);
      }
    });
    funcBtnData.params[type] = newActions;

    this.setState({
      funcBtnData: { ...funcBtnData },
    })
  }

  render() {
    const {
      t,
      scriptList,
      singleViews,
      onCancel,
    } = this.props;

    const {
      funcBtnData = {},
    } = this.state;

    return (
      <Modal
        title={t('common:module.addNewBtn')}
        centered
        visible={true}
        onOk={this.handleOk}
        onCancel={onCancel}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
      >
        <p style={{ marginTop: '4px', marginBottom: '8px' }}>{t('common:module.chooseActionType')}</p>
        <Select
          value={funcBtnData.actionType}
          style={{ width: '100%' }}
          onChange={value => this.handleFuncBtnDataChange('actionType', value)}
        >
          <Select.Option value={common.BIND_ACTION}>
            {t('common:module.addNewBtnBind')}
          </Select.Option>
          <Select.Option value={common.BIND_TEMPLATE}>
            {t('common:module.bindTemplate')}
          </Select.Option>
        </Select>
        <p style={{ marginTop: '8px', marginBottom: '8px' }}>{t('common:module.addNewBtnLabel')}</p>
        <Input
          value={funcBtnData.title}
          onChange={({target}) => this.handleFuncBtnDataChange('title', target.value)}
        />
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          <p style={{ marginTop: '8px', marginBottom: '8px' }}>{t('common:module.addNewBtnBind')}</p>
        }
        {
          funcBtnData.actionType === common.BIND_TEMPLATE &&
          <p style={{ marginTop: '8px', marginBottom: '8px' }}>{t('common:module.bindTemplate')}</p>
        }
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          <Select
            value={funcBtnData.scriptName}
            style={{ width: '100%' }}
            onChange={value => this.handleFuncBtnDataChange('scriptName', value)}
          >
          {
            scriptList.length > 0 &&
            scriptList.map(
              item =>
                <Select.Option
                  key={item.id}
                  value={item.actionName}
                >
                  {item.actionName}
                </Select.Option>)
          }
          </Select>
        }
        {
          funcBtnData.actionType === common.BIND_TEMPLATE &&
          <Select
            value={funcBtnData.scriptName}
            style={{ width: '100%' }}
            onChange={value => this.handleFuncBtnDataChange('scriptName', value)}
          >
            {
              singleViews.length > 0 &&
              singleViews.map(
                item =>
                  <Select.Option
                    key={item.uuid}
                    value={item.actionName}
                  >
                    {item.name}
                  </Select.Option>)
            }
          </Select>
        }
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          <p style={{ marginTop: '8px', marginBottom: '8px' }}>Pre Actions</p>
        }
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          lodash.isArray(funcBtnData.params.preActions) &&
          funcBtnData.params.preActions.map((item, index) =>
            <SelectActions
              key={item.uuid}
              scriptList={scriptList}
              type='preActions'
              data={item}
              index={index}
              onChange={this.handleParamsActionChange}
              onAdd={this.handleParamsActionAdd}
              onRemove={this.handleParamsActionRemove}
            />
          )
        }
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          <p style={{ marginTop: '8px', marginBottom: '8px' }}>After Actions</p>
        }
        {
          funcBtnData.actionType === common.BIND_ACTION &&
          lodash.isArray(funcBtnData.params.afterActions) &&
          funcBtnData.params.afterActions.map((item, index) =>
            <SelectActions
              key={item.uuid}
              scriptList={scriptList}
              type='afterActions'
              data={item}
              index={index}
              onChange={this.handleParamsActionChange}
              onAdd={this.handleParamsActionAdd}
              onRemove={this.handleParamsActionRemove}
            />
          )
        }
      </Modal>
    );
  }
}

export default SetFuncBtnsModal;
