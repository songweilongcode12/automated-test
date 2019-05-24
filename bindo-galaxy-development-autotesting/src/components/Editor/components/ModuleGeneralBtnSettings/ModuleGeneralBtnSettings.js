import React, { Component } from 'react'
import { translate } from 'react-i18next'
import GeneralBtn from './GeneralBtn';
import defaultBntData from './defaultBntData';
import { createUuid } from '../../../../utils';
import common from '../../../../constants/common';

@translate()
class ModuleGeneralBtnSettings extends Component {
  getBtnData = ({
    scriptName,
    title,
    viewType,
  }) => {
    let {
      data = {},
    } = this.props;
    data = data || {};

    const btns = data[viewType] || [];

    let bntData = {};
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      if (
        btn
        && btn.scriptName
        && btn.scriptName === scriptName
      ) {
        bntData = btn;
        break;
      }
    }

    return {
      icon: bntData.icon || '',
      iconType: bntData.iconType || '',
      params: bntData.params || {},
      scriptName: bntData.scriptName || scriptName,
      status: bntData.status || common.INVALID,
      title: bntData.title || title,
      type: bntData.type || common.DEFAULT,
      uuid: bntData.uuid || createUuid(),
    }
  }

  handleDefaultBtnChange = (bntData, viewType) => {
    const {
      data = {},
      onChange = () => {},
    } = this.props;

    const btns = data[viewType] || [];

    let operate = common.INSERT;
    for (let i = 0; i < btns.length; i++) {
      const btn = btns[i];
      if (
        btn
        && btn.scriptName
        && btn.scriptName === bntData.scriptName
      ) {
        operate = common.EDIT;
        break;
      }
    }

    onChange(bntData, viewType, operate);
  }

  render () {
    const {
      t,
    } = this.props;

    return (
      <div>
        {
          defaultBntData.map(item => {
            const {
              viewType,
              scriptName,
            } = item;
            return (
              <GeneralBtn
                t={t}
                key={scriptName}
                data={this.getBtnData(item)}
                viewType={viewType}
                onChange={this.handleDefaultBtnChange}
              />
            )
          })
        }
      </div>
    )
  }

}

export default ModuleGeneralBtnSettings

