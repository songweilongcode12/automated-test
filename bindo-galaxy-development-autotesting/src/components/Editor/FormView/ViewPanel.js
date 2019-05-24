import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Form, Button, Select, Checkbox } from 'antd'
import { filterOption } from '../../../utils/galaxy'
import UniqueIndexesModal from '../components/UniqueIndexesModal/UniqueIndexesModal'
import ModuleGeneralBtnSettings from '../components/ModuleGeneralBtnSettings'
import SetFuncBtnsModal from '../components/SetFuncBtnsModal'
import common from '../../../constants/common';
import reduxKey from '../../../constants/reduxKey';

const prefix = 'bindo-galaxy-editor-rightside';

@translate()
class ViewPanel extends Component {
  state = {
    uniqueFieldsStatus: false,
    setListFuncBtnsStatus: false,
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

  handleFuncBtnsChange = (btnData, viewType) => {
    const {
      dispatch,
      moduleEntity,
    } = this.props;

    const {
      template,
    } = moduleEntity || {};

    const {
      funcBtns = {},
    } = template || {};

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        templateParams: {
          funcBtns: {
            ...funcBtns,
            [viewType]: btnData,
          },
        },
      },
    });

    this.setState({
      setListFuncBtnsStatus: false,
    })
  }

  handleDisplayName = (value) => {
    const {
      dispatch,
    } = this.props

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        templateParams: {
          displayName: value,
        },
      },
    });
  }

  handleUniqueChange = (data) => {
    const newData = [];
    data.forEach(item => {
      if(lodash.isArray(item.fields) && item.fields.length > 0){
        newData.push(item);
      }
    })

    const {
      dispatch,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        properties: {
          uniqueIndexes: newData,
        },
      },
    });

    this.setState({
      uniqueFieldsStatus: false,
    })
  }

  allowGlobalEntry = (e) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        properties: {
          globalEnabled: e.target.checked,
        },
      },
    });
  }

  render () {
    const {
      uniqueFieldsStatus = false,
      setListFuncBtnsStatus = false,
    } = this.state;
    const {
      t,
      fields = [],
      moduleEntity,
      moduleID,
      storeID,
    } = this.props;

    const {
      template,
      uniqueIndexes=[],
      globalEnabled = false,
    } = moduleEntity || {};

    const {
      displayName = 'name',
      funcBtns = {},
      singleViews = [],
    } = template || {};

    return (
      <div style={{ padding: '0 25px' }}>
        <div style={{ marginTop: '20px' }}>General Settings</div>
        <Form>
          <ModuleGeneralBtnSettings
            data={funcBtns}
            onChange={this.handleInsertOrEditFuncBtn}
          />
          <Form.Item className={`${prefix}-function`}>
            <div className={`${prefix}-function-title`}>{t('common:module.viewfuncBtnTitle')}</div>
            <Button
              className={`${prefix}-function-button`}
              onClick={() => {
                this.setState({
                  setListFuncBtnsStatus: true,
                })
              }}
            >
              {t('common:module.viewfuncBtn')}
            </Button>
            <div className={`${prefix}-function-title`}>{t('common:module.uniqueFieldsTitle')}</div>
            <Button
              className={`${prefix}-function-button`}
              onClick={() => {
                this.setState({
                  uniqueFieldsStatus: true,
                })
              }}
            >
              {t('common:module.uniqueFields')}
            </Button>
            <div className={`${prefix}-function-title`}>{t('common:module.displayingTitle')}</div>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
              onChange={this.handleDisplayName}
              value={displayName}
              style={{ width: '100%' }}
            >
              {
                fields.map(item =>
                  <Select.Option key={item.name} value={item.name}>
                    {item.label}
                  </Select.Option>
                )
              }
            </Select>
            <Checkbox
              checked={globalEnabled}
              onChange={(e) => this.allowGlobalEntry(e)}
            >
              {t('common:editor.allowGlobalEntry')}
            </Checkbox>
          </Form.Item>
          {
            setListFuncBtnsStatus &&
            <SetFuncBtnsModal
              onCancel={() => this.setState({setListFuncBtnsStatus: false})}
              data={funcBtns}
              singleViews={singleViews || []}
              moduleID={moduleID}
              storeID={storeID}
              viewType={common.FORM}
              onOk={this.handleFuncBtnsChange}
            />
          }
          {
            uniqueFieldsStatus &&
            <UniqueIndexesModal
              fields={fields}
              onCancel={() => this.setState({uniqueFieldsStatus: false})}
              data={uniqueIndexes|| []}
              onOk={this.handleUniqueChange}
            />
          }
        </Form>
      </div>
    )
  }
}

export default ViewPanel
