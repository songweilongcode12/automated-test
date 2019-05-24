import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Form } from 'antd'
import ModuleGeneralBtnSettings from '../components/ModuleGeneralBtnSettings'
import reduxKey from '../../../constants/reduxKey';

@translate()
class ViewPanel extends Component {
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

  render () {
    const {
      moduleEntity,
    } = this.props;

    const {
      template,
    } = moduleEntity || {};

    const {
      funcBtns = {},
    } = template || {};

    return (
      <div style={{ padding: '0 25px' }}>
        <div style={{ marginTop: '20px' }}>General Settings</div>
        <Form>
          <ModuleGeneralBtnSettings
            data={funcBtns}
            onChange={this.handleInsertOrEditFuncBtn}
          />
        </Form>
      </div>
    )
  }
}

export default ViewPanel
