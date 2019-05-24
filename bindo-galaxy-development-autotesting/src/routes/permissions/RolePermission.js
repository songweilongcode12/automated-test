import React, { Component } from 'react'
import lodash from 'lodash'
import { Switch } from 'antd'
import i18n from '../../i18n'
import common from '../../constants/common'

const prefix = 'bg-galaxy-permissions'

class RolePermission extends Component {
  handleSwitch = ({ type, uuid, checked}) => {
    const {
      data,
      moduleID,
      onPermissionChange,
    } = this.props;

    if (typeof onPermissionChange !== 'function') {
      return;
    }
    const newData = lodash.cloneDeep(data);
    newData.modified = true;
    const {
      permissions = [],
    } = newData;

    permissions.forEach(item => {
      if (item.type === type && item.uuid === uuid) {
        item.value = checked;
      }
    })

    onPermissionChange(newData, moduleID);
  }

  getPermissionView = () => {
    const {
      data,
      editable,
    } = this.props;

    const {
      permissions = [],
    } = data || {};

    const views = [];
    permissions.forEach(item => {
      const {
        title = '',
        value = '',
        type = '',
        uuid= '',
      } = item;

      views.push(
        <div key={uuid} className={`${prefix}-custom-rows-item`}>
          <Switch
            onChange={(checked) => this.handleSwitch({ type, uuid, checked })}
            style={{ width: '42px', height: '22px' }}
            checked={value}
            disabled={!editable}
          />
          <span className={`${prefix}-custom-rows-item-title`}>
            { type === common.DEFAULT ? i18n.t(title) : title }
          </span>
        </div>
      )
    })

    return views;
  }

  render () {
    const {
      data,
    } = this.props;

    const {
      name = '',
      modified = false,
    } = data || {};

    return (
      <div className={`${prefix}-custom-row ${modified ? 'modified' : ''}`} style={{ width: '100%' }}>
        <div className={`${prefix}-custom-row-title`}>
          {name}
        </div>
        <div className={`${prefix}-custom-rows`}>
          { this.getPermissionView() }
        </div>
      </div>
    )
  }

}

export default RolePermission;
