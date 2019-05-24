/**
 * 暂时废弃的页面
 */

import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import Liquid from 'liquidjs';
import Layout from '../../Layout';
import Breadcrumb from '../../Breadcrumb';
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../../utils/galaxy';
import {
  findApp,
} from '../../../utils/app';
import { findMenuBranch } from '../../../utils/menu';
import routes from '../../../constants/routes';
import common from '../../../constants/common';

const galaxyPrefix = 'bg-galaxy';

const engine = new Liquid();

class LiquidViewContent extends Component {

  componentDidMount () {
    engine
      .parseAndRender('<p>{{name | capitalize}}</p>', {name: 'alice'})
      .then(res => log.info('----------', res))
  }

  getBreadcrumbData = () => {
    const { menuID, storeID, appID } = parseParams(this.props);
    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];
    const menuBranch = findMenuBranch(apps, menuID) || [];

    const breadcrumbData = [];
    menuBranch.forEach(item => {
      breadcrumbData.push({
        id: item.id,
        type: 'label',
        name: getCurrentI18nValue('name', item),
      });
    });

    return breadcrumbData;
  }

  render () {

    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
    }

    return (
      <Layout.Content className='column'>
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={this.getBreadcrumbData()}
            {...this.props}
          />
        </div>
      </Layout.Content>
    )
  }
}

export default LiquidViewContent;
