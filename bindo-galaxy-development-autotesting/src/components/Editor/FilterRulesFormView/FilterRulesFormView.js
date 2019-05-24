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
  getModuleType,
} from '../../../utils/galaxy';
import { findMenuBranch } from '../../../utils/menu';
import {
  findApp,
} from '../../../utils/app';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import Layout from '../../Layout';
import RightSide from './RightSide';
import FilterRulesContent from './FilterRulesContent'

@connect(({ galaxy, module }) => ({ ...galaxy, ...module }))
@translate()
class FilterRulesFormView extends Component {

  state = {
    // record: {},
  }

  getBreadcrumbData = () => {
    const {
      t,
    } = this.props;
    const {
      menuID,
      action,
      appID,
      storeID,
    } = parseParams(this.props);

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];

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
        data.id = '';
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
      type: 'link',
      name: t('common:module.filterRules'),
      url: createRouteUrl(routes.FILTER_RULES_VIEW, {}, this.props),
    });

    const moduleType = getModuleType(this.props);
    if (moduleType === common.MODULE) {
      if (action === 'new') {
        breadcrumbData.push({
          id: 'parser_formview_action',
          type: 'label',
          name: t('common:new'),
        });
      } else {
        breadcrumbData.push({
          id: 'parser_formview_filterRules_action',
          type: 'label',
          name: t(`common:${action}`),
        });
      }
    }

    return breadcrumbData;
  }

  render () {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;
    return (
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
          <FilterRulesContent
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
    );
  }
}

export default FilterRulesFormView;
