import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Skeleton,
} from 'antd'
import { Redirect } from 'react-router-dom'
import WikiOnlyContent from './WikiOnlyContent'
import Breadcrumb from '../../Breadcrumb'
import RightSide from './RightSide'
import Layout from '../../Layout'
import {
  parseParams,
  getCurrentI18nValue,
  createRouteUrl,
} from '../../../utils/galaxy'
import {
  findMenuBranch,
} from '../../../utils/menu'
import {
  findApp,
} from '../../../utils/app'
import routes from '../../../constants/routes'
import common from '../../../constants/common'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class WikiOnlyView extends Component {
  getBreadcrumbData = () => {
    const {
      storeID,
      appID,
      menuID,
    } = parseParams(this.props);
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

  getShortcutData = () => {
    const { menuID } = parseParams(this.props);
    const shortcutData = [
      [
        {
          key: 'permissions',
          icon: 'lock',
          helpTooltip: 'Permissions',
          routerParams: {
            moduleID: menuID,
            from: common.EMBEDDED,
          },
          linkRoute: routes.PERMISSIONS,
        },
      ],
    ];

    return shortcutData;
  }

  render() {
    const {
      storesMap,
    } = this.props;
    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      return <Redirect to={createRouteUrl(routes.WIKI_ONLY_EDIT, {}, this.props)} />
    }

    return (
      <Layout {...this.props}>
        <Layout.Content className="column">
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
              {...this.props}
              shortcutData={this.getShortcutData()}
            />
          </div>
          <div className={`${galaxyPrefix}-content flex`} style={{padding: 10}}>
            <Skeleton
              active={true}
              loading={storesMap.size < 1}
              className="bg-galaxy-skeleton"
            >
              <WikiOnlyContent {...this.props} />
            </Skeleton>
          </div>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Overview</span>
          </div>
        </Layout.Content>
        <Layout.RightSide>
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <RightSide {...this.props} />
          </Skeleton>
        </Layout.RightSide>
      </Layout>
    );
  }
}

export default WikiOnlyView
