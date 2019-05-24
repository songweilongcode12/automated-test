import React, { Component } from 'react'
import { Icon as AntdIcon, Collapse } from 'antd'
import RolePermission from './RolePermission'

const { Panel } = Collapse;
const prefix = 'bg-galaxy-permissions'

class ModulePermission extends Component {
  shouldComponentUpdate = (nextProps) => {
    const {
      data,
    } = this.props;
    return data !== nextProps.data;
  }

  render () {
    const {
      data = {},
      editable,
      onPermissionChange,
    } = this.props;

    const {
      moduleID,
      name = '',
      roles = [],
    } = data || {};
    return (
      <Collapse
        className={prefix}
        bordered={false}
        defaultActiveKey={[moduleID]}
        expandIcon={({ isActive }) => <AntdIcon type="up" rotate={isActive ? 0 : 180} />}
      >
        <Panel header={name} key={moduleID}>
          {
            roles && roles.length > 0 &&
            roles.map(item => (
              <RolePermission
                key={item.uuid}
                data={item}
                moduleID={moduleID}
                editable={editable}
                onPermissionChange={onPermissionChange}
              />
            ))
          }
        </Panel>
      </Collapse>
    )
  }

}

export default ModulePermission;
