import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Dropdown, Menu, Button } from 'antd'
import common from '../../constants/common'
import Icon from '../Icon'

const galaxyPrefix = 'bg-galaxy';

/**
 * @function onclick
 * @param data {
 *  button data
 *  other data
 * }
 * */
@translate()
class ActionMore extends Component {

  state = {
    actionVisible: false,
  }

  getDropdownItem = (item) =>{
    const {
      status,
      uuid,
      type,
      icon = 'icon-view',
      scriptName = '',
    } = item;
    let {
      title,
    } = item;
    const newIcon = icon || 'icon-view';

    if (status === common.INVALID ) return

    const {
      onBtnClick,
      t,
      globalEnabled = false,
      isGlobal = false,
    } = this.props;
    if(
      scriptName === common.GLOBAL &&
      type === common.DEFAULT &&
      globalEnabled &&
      isGlobal
    ){
      title = 'common:editor.recordUnGlobal';
    }

    let newTitle = title;
    if ( type === common.DEFAULT){
      newTitle = t(title)
    }

    return(
      <Menu.Item key={uuid}>
        <Button
          size="small"
          style={{border: 0, width: '100%', textAlign: 'left'}}
          onClick={(evt) => {
            evt.stopPropagation();
            onBtnClick(item);
            this.setState({
              actionVisible: false,
            })
          }}
        >
          <Icon type={newIcon} />
          {newTitle}
        </Button>
      </Menu.Item>
    )
  }

  handleVisibleChange = (flag) => {
    this.setState({
      actionVisible: flag,
    })
  }

  getActionMoreIcon = () => {
    const { actionVisible } = this.state;
    if (actionVisible) {
      return <Icon type='icon-up' />
    } else {
      return <Icon type='icon-down' />
    }
  }

  render () {

    const {
      dataSource,
    } = this.props;

    const {
      actionVisible,
    } = this.state;

    return (
      <Dropdown
        overlay={
          <Menu>
            {dataSource.map(this.getDropdownItem)}
          </Menu>
        }
        style={{zIndex: 9999}}
        overlayClassName={`${galaxyPrefix}-dropdown`}
        onVisibleChange={this.handleVisibleChange}
        visible={actionVisible}
      >
        <div className={`${galaxyPrefix}-dropdown-action`}>
          More
          &nbsp;
          {this.getActionMoreIcon()}
        </div>
      </Dropdown>
    )
  }
}

export default ActionMore
