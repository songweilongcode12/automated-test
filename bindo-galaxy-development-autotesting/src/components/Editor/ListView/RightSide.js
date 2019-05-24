import React, { Component } from 'react'
import { Tabs } from 'antd'
import { translate } from 'react-i18next'
import ViewPanel from './ViewPanel'
import {
  parseParams,
} from '../../../utils/galaxy'
import reduxKey from '../../../constants/reduxKey'
import '../FormView/FormView.less'

const prefix = 'bindo-galaxy-editor-rightside'

@translate()
class RightSide extends Component {

  render () {
    const {
      t,
      dispatch,
      activeTab,
      fields,
      moduleEntity,
    } = this.props;

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    return (
      <Tabs
        className="rightside-tabs"
        activeKey={activeTab}
        onChange={key => dispatch({
          type: reduxKey.SET_MODULE_ACTIVE_TAB,
          payload: key,
        })}
      >
        <Tabs.TabPane className={`${prefix}-tabpane`} tab={t('common:view')} key="view">
          <ViewPanel
            moduleID={moduleID}
            storeID={storeID}
            moduleEntity={moduleEntity}
            dispatch={dispatch}
            fields={fields}
          />
        </Tabs.TabPane>
      </Tabs>
    );
  }
}

export default RightSide;
