import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  Skeleton,
} from 'antd';
import {
  parseParams,
  getCurrentI18nValue,
  createRouteUrl,
} from '../../../utils/galaxy';
import { findMenuBranch } from '../../../utils/menu';
import {
  findApp,
} from '../../../utils/app';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import Layout from '../../Layout';
import RightSide from './RightSide';
import FilterRulesViewContent from './FilterRulesViewContent'

@connect(({ galaxy, module }) => ({ ...galaxy, ...module }))
@translate()
class FilterRulesView extends Component {

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
      type: 'link',
      url: createRouteUrl(routes.MODULE_VIEWS, {}, this.props),
      name: t('common:module.views'),
    }, {
      id: 'editor_views_filterRuleslist',
      type: 'label',
      name: t('common:module.filterRules'),
    }];

    return breadcrumbData;
  }

  getBreadcrumbData = () => {
    const {
      t,
    } = this.props;

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
      type: 'link',
      url: createRouteUrl(routes.VIEWS, {}, this.props),
      name: t('common:module.views'),
    });

    breadcrumbData.push({
      id: 'editor_views_filterRuleslist',
      type: 'label',
      name: t('common:module.filterRules'),
    });

    return breadcrumbData;
  }

  render () {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;
    return(
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
          <FilterRulesViewContent
            getBreadcrumbData={this.getBreadcrumbData}
            {...this.props}
          />
        </Skeleton>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
        <RightSide
          getBreadcrumbData={this.getBreadcrumbData}
          {...this.props}
        />
        </Skeleton>
      </Layout>
    )
  }
}

export default FilterRulesView
