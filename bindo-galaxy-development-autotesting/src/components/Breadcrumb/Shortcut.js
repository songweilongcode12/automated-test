import React from 'react';
import { Link } from 'react-router-dom';
import {
  Icon as AntIcon,
  Divider,
  Tooltip,
} from 'antd';
import lodash from 'lodash'
import { createUuid } from '../../utils';
import IconfontIcon from '../Icon'
import {
  createRouteUrl,
} from '../../utils/galaxy';

class Shortcut extends React.Component {

  getShutcutView = (data) => {
    const {
      match = {},
    } = this.props;
    const {
      path = '',
    } = match;
    const {
      icon = '',
      helpTooltip = '',
      linkRoute = '',
      key = '',
      onClick,
      routerParams = {},
      isIconfont = false,
    } = data;
    const tooltipProps = {
      key,
      title: helpTooltip,
      placement: 'bottom',
      trigger: 'hover',
    }
    const iconProps = {
      type: icon,
    }

    let isLink = true;
    if (typeof onClick === 'function') {
      isLink = false;
      iconProps.onClick = onClick;
    }

    iconProps.style = {
      cursor: 'pointer',
      margin: '0px 5px',
      color: '#1890FF',
    }

    if (linkRoute === path) {
      isLink = false;
    }

    if (!isLink) {
      iconProps.style = {
        margin: '0px 5px',
        color: '#89949B',
      }
    }
    let iconItem = (
      <Tooltip {...tooltipProps}>
        {
          isIconfont ? <IconfontIcon {...iconProps} /> : <AntIcon {...iconProps} />
        }
      </Tooltip>
    );

    if (isLink) {
      iconItem = (
        <Link key={key} to={createRouteUrl(linkRoute, routerParams || {}, this.props)}>
          {iconItem}
        </Link>
      );
    }

    return iconItem;
  }

  getShotcutViews = () => {

    const {
      dataSource,
    } = this.props;

    const viewsData = []
    dataSource.forEach(item => {
      // const groupData = this.filterShutcutGroup(item);
      if (lodash.isArray(item) && item.length > 0) {
        viewsData.push(item);
      }
    })

    let firstGroupData = null;
    if (viewsData.length > 0) {
      firstGroupData = viewsData.shift();
    }
    const views = [];
    if (firstGroupData !== null && firstGroupData.length > 0) {
      firstGroupData.forEach(item => views.push(this.getShutcutView(item)));
    }
    if (viewsData.length > 0) {
      viewsData.forEach(items => {
        const laterView = [];
        items.forEach(item => laterView.push(this.getShutcutView(item)));
        views.push(
          <Divider key={createUuid()} type='vertical' />,
          ...laterView,
        );
      })
    }
    return views;
  }

  render () {
    return (
      <div
        style={{
          marginRight: '6px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'spaceBetween',
          alignItems: 'center',
        }}
      >
        {this.getShotcutViews()}
      </div>
    );
  }

}

export default Shortcut
