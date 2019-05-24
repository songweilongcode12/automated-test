import React, { Component } from 'react';
import { Menu, Icon as AntdIcon, Tag } from 'antd';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import {
  parseParams,
  createMenuUrl,
  getCurrentI18nValue,
} from '../../utils/galaxy';
import {
  findStoresAppsBySlugs,
} from '../../utils/app';
import { findNode } from '../../utils';
import common from '../../constants/common';
import routes from '../../constants/routes';
import './Menus.less';
import reduxKey from '../../constants/reduxKey';

const prefix = 'bg-c-menus';

const showInfoRoutes = new Set([
  routes.DIRECTORY,
  routes.APPS,
  routes.MODELS,
  routes.MODEL_FIELDS,
  routes.MODULES,
]);
const infoByRoute = {
  [routes.DIRECTORY]: 'DIRECTORY',
  [routes.APPS]: 'APPS',
  [routes.MODELS]: 'MODELS',
  [routes.MODEL_FIELDS]: 'MODEL_FIELDS',
  [routes.MODULES]: 'MODULES',
};

class Menus extends Component {
  getMenuViews = () => {
    const {
      galaxyState,
      appID,
      storeSlugs,
    } = parseParams(this.props);
    const storesApps = findStoresAppsBySlugs({
      props: this.props,
      slugs: storeSlugs,
    });

    let menuData = [];

    if (galaxyState === common.DASHBOARD) {
      menuData = [...storesApps];
    } else if (galaxyState === common.BUILDER && appID) {
      const app = findNode(storesApps, 'id', appID);
      if (app) {
        menuData = [app];
      }
    }

    const openKeys = [];
    const menuViews = this.createMenu(menuData, galaxyState, openKeys);

    return {
      openKeys,
      menuViews,
    };
  }

  getAppIconType = (item) => {
    const {
      t,
    } = this.props;
    const {
      type = '',
      publicStatus = '',
    } = item;
    let tag;
    if(type === common.DEFAULT && publicStatus === common.UNPUBLISHED){
      tag = <Tag className={`${prefix}-right-tag`} color="volcano">{t('common:unpublished')}</Tag>;
    } else if(type === common.SYSTEM){
      tag = <Tag className={`${prefix}-right-tag`} color="blue">{t('common:admin')}</Tag>;
    } else if(type === common.ENTERPRISE){
      tag = <Tag className={`${prefix}-right-tag`} color="green">{t('common:enterprise')}</Tag>;
    }
    return tag;
  }

  createMenu(menuData = [], galaxyState, openKeys) {
    const menus = [];
    const {
      storesIDRefSlug,
    } = this.props;

    menuData.forEach(item => {
      if (item.hidden && common.DASHBOARD === galaxyState) {
        return;
      }
      const key = `${item.inStoreID}_${item.id}`;
      if (item.type === common.SUBMENU || item.$type === common.APP) {
        openKeys.push(key)
        const subMenus = this.createMenu(item.children, galaxyState, openKeys);

        menus.push(
          <Menu.SubMenu
            key={key}
            title={
              <div className={`${prefix}-menu-inner-title`}>
                <div className={`${prefix}-menu-inner-title-text`}>
                  {
                    !item.appID && item.iconType === 'antd' &&
                    <AntdIcon type={item.icon} />
                  }
                  {
                    !item.appID && item.iconType === 'bindo' &&
                    <Icon type={item.icon} />
                  }
                  {getCurrentI18nValue('name', item)}
                </div>
                {this.getAppIconType(item)}
              </div>
            }
          >
            { subMenus }
          </Menu.SubMenu>
        );
      } else if (
        galaxyState === common.DASHBOARD
        || (galaxyState === common.BUILDER && item.type !== common.PERMISSION)
      ) {
        const storeSlug = storesIDRefSlug.get(item.inStoreID);
        menus.push(
          <Menu.Item key={key} data={item}>
            <Link to={createMenuUrl(item, {slug: storeSlug, galaxyState}, this.props)}>
              {getCurrentI18nValue('name', item)}
            </Link>
          </Menu.Item>
        );
      }
    });

    return menus;
  }

  render() {
    const {
      t,
      dispatch,
      openMenuKeys,
      match: {
        path,
      },
      storesAppsMap,
    } = this.props;

    const {
      galaxyState,
      menuID,
      storeID,
    } = parseParams(this.props);

    let className = `${prefix} ${galaxyState}`;
    if (galaxyState === common.BUILDER && (showInfoRoutes.has(path))) {
      className = `${className} ${prefix}-info`;
    }

    if (storesAppsMap.size < 1) {
      className = `${className} skeleton`;
    }

    const {
      openKeys = [],
      menuViews,
    } = this.getMenuViews();

    return (
      <div className={className}>
        {
          !showInfoRoutes.has(path) &&
          <Menu
            theme="dark"
            selectedKeys={[`${storeID}_${menuID}`]}
            openKeys={galaxyState === common.BUILDER ? openKeys : openMenuKeys}
            mode="inline"
            onOpenChange={keys => dispatch({
              type: reduxKey.SET_OPEN_MENU_KEYS,
              payload: keys,
            })}
          >
            { menuViews }
          </Menu>
        }
        {
          showInfoRoutes.has(path) &&
          <div className='bg-c-menus-content'>
            <Icon type='icon-app-folder' style={{fontSize: 100, flex: 1}} />
            <span style={{flex: 1}}>{t(`common:welcomeTo${infoByRoute[path]}`)}</span>
          </div>
        }
      </div>
    );
  }
}

export default Menus;
