import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  Tabs,
  Skeleton,
} from 'antd';
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../utils/galaxy';
import {
  findApp,
} from '../../utils/app';
import { findMenuBranch } from '../../utils/menu';
import Layout from '../../components/Layout';
import routes from '../../constants/routes';
import common from '../../constants/common';
import Comments from '../../components/Comments';
import ModuleViewContent from './ModuleViewContent'
import './ModuleViews.less';

@connect(({ galaxy, module}) => ({ ...galaxy, ...module }))
@translate()
class ModuleViews extends Component {

  getBreadcrumbDataForModule = (moduleName) => {
    const { t } = this.props;
    const breadcrumbData = [{
      id: 'modules',
      type: 'link',
      name: t('common:moduleDirectory'),
      url: createRouteUrl(routes.MODULES, {}, this.props),
    }, {
      id: 'module',
      type: 'label',
      name: moduleName,
    }, {
      id: 'module_views',
      type: 'label',
      name: t('common:module.views'),
    }];

    return breadcrumbData;
  }

  getBreadcrumbData = () => {
    const {
      menuID,
      moduleName,
      storeID,
      appID,
    } = parseParams(this.props);

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];

    if (!menuID) {
      return this.getBreadcrumbDataForModule(moduleName);
    }
    const { t } = this.props;
    const menuBranch = findMenuBranch(apps, menuID) || [];

    const breadcrumbData = [{
      id: 'apps',
      type: 'link',
      url: createRouteUrl(routes.APPS, {}, this.props),
      name: t('common:appDirectory'),
    }];

    menuBranch.forEach(item => {
      const { id, $type } = item;

      const data = {
        id,
        type: 'label',
        name: getCurrentI18nValue('name', item),
      };

      if ($type === common.APP) {
        data.type = 'link';
        data.url = createRouteUrl(routes.MENUS, {}, this.props);
      }

      breadcrumbData.push(data);
    });

    breadcrumbData.push({
      id: 'module_views',
      type: 'label',
      name: t('common:module.views'),
    });

    return breadcrumbData;
  }

  render () {
    const {
      t,
      storesMap,
      permissionsAndModulesDone,
    } = this.props;
    const {
      menuID,
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      if (menuID) {
        return (
          <Redirect
            to={createRouteUrl(routes.RECORDS, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      } else {
        return (
          <Redirect
            to={createRouteUrl(routes.MODULES, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      }
    }

    const { storeID } = parseParams(this.props);

    return (
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
          <ModuleViewContent
            {...this.props}
            getBreadcrumbData={this.getBreadcrumbData}
          />
        </Skeleton>
        <Layout.RightSide>
          <Tabs className="rightside-tabs">
            <Tabs.TabPane tab={t('common:comments')} key="comments">
              <Skeleton
                active={true}
                loading={storesMap.size < 1 || !permissionsAndModulesDone}
                className="bg-galaxy-skeleton"
              >
                <Comments
                  storeIDs={[storeID]}
                  commentType="views"
                  relationID="views"
                />
              </Skeleton>
            </Tabs.TabPane>
          </Tabs>
        </Layout.RightSide>
      </Layout>
    );
  }
}

export default ModuleViews;
