import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import {
  Form,
  Select,
  Checkbox,
  message,
  Button,
} from 'antd'
import ModuleGeneralBtnSettings from '../components/ModuleGeneralBtnSettings'
import {
  findNode,
} from '../../../utils'
import {
  filterOption,
} from '../../../utils/galaxy'
import {
  findModuleByID,
} from '../../../utils/module'
import reduxKey from '../../../constants/reduxKey';
import widgets from '../../../constants/widgets';
import ColorConfiguration from './ColorConfiguration'
// import common from '../../../constants/common';

const prefix = 'bindo-galaxy-editor-rightside';

const groupByViewType = new Set([
  widgets.SELECTION,
  widgets.RADIO,
  widgets.CHECKBOX,
  widgets.MANY_TO_ONE,
])

@translate()
class ViewPanel extends Component {
  state = {
    showColorConfigModal: false,
  }

  static contextTypes = {
    updateState: PropTypes.func,
  }

  handleInsertOrEditFuncBtn = (data, viewType, operate) => {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editFuncBtn: {
          operate,
          viewType,
          data,
        },
      },
    });
  }

  handleSchedulerChange = (key, value) => {
    if(
      (key === 'displayFieldNameLeft' || key === 'displayFieldNameRight') &&
      Array.isArray(value) &&
      value.length > 2
    ){
      message.warning('Only support 2 items');
      return;
    }
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editScheduler: {
          [key]: value,
        },
      },
    });
  }

  handleObjectFieldChange = (value, fields) => {
    if (!Array.isArray(fields)) {
      return;
    }

    const field = findNode(fields, 'name', value);

    if (field && field.name) {
      const {
        dispatch,
      } = this.props;

      dispatch({
        type: reduxKey.UPDATE_MODULE_ENTITY,
        payload: {
          editScheduler: {
            objectField: {
              uuid: field.uuid,
              name: field.name,
              viewType: field.viewType,
            },
            canGroupBy: false,
            objectDisplayFields: [],
            startFieldName: '',
            endFieldName: '',
            groupByFieldName: '',
          },
        },
      });
    }
  }

  handleObjectDisplayFieldChange = (value, fields) => {
    if (!Array.isArray(value) || !Array.isArray(fields)) {
      return;
    }

    const nameSet = new Set(value);

    const displayFields = [];
    fields.forEach(field => {
      if (nameSet.has(field.name)) {
        displayFields.push({
          uuid: field.uuid,
          name: field.name,
          viewType: field.viewType,
        })
      }
    })

    this.handleSchedulerChange(
      'objectDisplayFields',
      displayFields
    )
  }

  getOptionalObjectFields = (fields) => {
    const optional = [];

    if (Array.isArray(fields)) {
      fields.forEach(item => {
        if (item.viewType === widgets.MANY_TO_ONE) {
          optional.push(item);
        }
      })
    }

    return optional;
  }

  getDateFields = (fields) => {
    const optional = [];

    if (Array.isArray(fields)) {
      fields.forEach(item => {
        if (item.viewType === widgets.DATE) {
          optional.push(item);
        }
      })
    }

    return optional;
  }

  getGroupByFields = (fields) => {
    const optional = [];

    if (Array.isArray(fields)) {
      fields.forEach(item => {
        if (groupByViewType.has(item.viewType)) {
          optional.push(item);
        }
      })
    }

    return optional;
  }

  getObjectFieldModuleFields = (objectField, fields) => {
    const {
      name,
    } = objectField || {};

    const field = findNode(fields, 'name', name);

    if (!field) {
      return [];
    }

    const {
      allowValue: {
        dynamicItemSource,
      } = {},
    } = field;

    if (!dynamicItemSource) {
      return [];
    }

    const {
      moduleID,
    } = dynamicItemSource || {};

    const {
      storeID,
    } = this.props;

    const module = findModuleByID({
      props: this.props,
      storeID,
      moduleID,
    });

    const {
      fields: moduleFields = [],
    } = module || {};

    return moduleFields;
  }

  saveColorConfigs = () => {
    this.setState({
      showColorConfigModal: false,
    })
  }

  render () {
    const {
      moduleEntity,
    } = this.props;
    const {
      showColorConfigModal = false,
    } = this.state;

    const {
      template,
      fields = [],
    } = moduleEntity || {};

    const {
      funcBtns = {},
      scheduler = {},
    } = template || {};

    const {
      objectField = {},
      canGroupBy = false,
      objectDisplayFields = [],
      startFieldName,
      endFieldName,
      displayFieldNameLeft,
      displayFieldNameRight,
      groupByFieldName,
    } = scheduler || {};

    const {
      name: objectFieldName,
    } = objectField || {};

    const fieldModuleFields = this.getObjectFieldModuleFields(objectField, fields);

    return (
      <div style={{ padding: '0 25px' }}>
        <div style={{ marginTop: '20px' }}>General Settings</div>
        <Form>
          <ModuleGeneralBtnSettings
            data={funcBtns}
            onChange={this.handleInsertOrEditFuncBtn}
          />
          <Form.Item className={`${prefix}-function`}>
            <div className={`${prefix}-function-title`}>
              Scheduler View Settings
            </div>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              Object Field
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={(value) => this.handleObjectFieldChange(value, fields)}
              value={objectFieldName}
              style={{ width: '100%' }}
            >
              {
                this.getOptionalObjectFields(fields).map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`}>
              Object Displaying Field
            </div>
            <Select
              mode='multiple'
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={(value) => this.handleObjectDisplayFieldChange(value, fieldModuleFields)}
              value={objectDisplayFields.map(item => item.name)}
              style={{ width: '100%' }}
            >
              {
                fieldModuleFields.map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              Scheduler Displaying Field(Left)
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSchedulerChange('displayFieldNameLeft', value)}
              value={displayFieldNameLeft}
              style={{ width: '100%' }}
              mode="multiple"
            >
              {
                fields.map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              Scheduler Displaying Field(Right)
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSchedulerChange('displayFieldNameRight', value)}
              value={displayFieldNameRight}
              style={{ width: '100%' }}
              mode="multiple"
            >
              {
                fields.map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              Start Field
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSchedulerChange('startFieldName', value)}
              value={startFieldName}
              style={{ width: '100%' }}
            >
              {
                this.getDateFields(fields).map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              End Field
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSchedulerChange('endFieldName', value)}
              value={endFieldName}
              style={{ width: '100%' }}
            >
              {
                this.getDateFields(fields).map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <Checkbox
              checked={canGroupBy === true}
              onChange={({target}) => {
                const {
                  checked = false,
                } = target || {};

                this.handleSchedulerChange('canGroupBy', checked);
              }}
            >
              Can Group By
            </Checkbox>
            <div className={`${prefix}-function-title`}>
              Grouped by
            </div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={value => this.handleSchedulerChange('groupByFieldName', value)}
              value={groupByFieldName}
              style={{ width: '100%' }}
            >
              {
                this.getGroupByFields(fieldModuleFields).map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <div className={`${prefix}-function-title`} style={{marginTop: '10px'}}>
              Color Configuration
            </div>
            <Button
              style={{width: '100%'}}
              type='primary'
              onClick={() => this.setState({showColorConfigModal: true})}
            >
              Color Configuration
            </Button>
            {
              showColorConfigModal &&
              <ColorConfiguration
                title='Color Configuration'
                onCancel={() => this.setState({showColorConfigModal: false})}
                onOk={this.saveColorConfigs}
                colorConfigFields={this.getGroupByFields(fields)}
              />
            }
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default ViewPanel
