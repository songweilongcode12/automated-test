
import React, { Component } from 'react'
import ModulePermission from './ModulePermission'

class PermissionContent extends Component {
  componentDidMount () {
    const {
      resetAppAuths,
    } = this.props;

    resetAppAuths(this.props);
  }

  handlePermissionChange = (data, moduleID) => {

    const {
      appAuths,
      editable,
      onResetState,
    } = this.props;

    if (!editable) {
      return;
    }

    const {
      modules = [],
    } = appAuths || {};

    let roleList = [];
    const newModules = [];
    modules.forEach(item => {
      if (item.moduleID === moduleID) {
        roleList = [...item.roles];
        newModules.push({
          ...item,
          roles: roleList,
        })
      } else {
        newModules.push(item);
      }
    });

    for (let i = 0; i < roleList.length; i++) {
      const role = roleList[i];
      if (role.uuid === data.uuid) {
        roleList.splice(i, 1, data);
        break;
      }
    }

    onResetState({
      appAuths: {
        ...appAuths,
        modules: newModules,
      },
    })
  }

  render () {
    const {
      appAuths,
      editable = false,
    } = this.props;

    const {
      modules = [],
    } = appAuths || {};

    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
        className='bg-c-dragside-content bg-c-parser-listView-content'
      >
        {
          modules.length > 0 &&
          modules.map(item => (
            <ModulePermission
              key={`${item.menuID}_${item.moduleID}`}
              data={item}
              editable={editable}
              onPermissionChange={this.handlePermissionChange}
            />
          ))
        }
      </div>
    );
  }
}

export default PermissionContent;
