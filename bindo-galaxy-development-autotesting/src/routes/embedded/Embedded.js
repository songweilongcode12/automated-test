import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import {
  Skeleton,
} from 'antd'
import EmbeddedContent from './EmbeddedContent'
import RightSide from './RightSide'
import Layout from '../../components/Layout'
import './Embedded.less'
import {
  createRouteUrl,
  getCurrentI18nValue,
  parseParams,
} from '../../utils/galaxy'
import {
  findMenuBranch,
} from '../../utils/menu'
import {
  findApp,
} from '../../utils/app'
import routes from '../../constants/routes'
import common from '../../constants/common'
import Breadcrumb from '../../components/Breadcrumb'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class Embedded extends Component {
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

  getShortcutData = () => {
    const { menuID } = parseParams(this.props);
    const shortcutData = [
      [
        {
          key: 'listWikiView',
          icon: 'book',
          helpTooltip: 'List Wiki View',
          routerParams: {
            moduleID: menuID,
            from: common.EMBEDDED,
          },
          linkRoute: routes.PARSE_WIKI,
        },
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
      return <Redirect to={createRouteUrl(routes.EMBEDDED_EDIT, {}, this.props)} />
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
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <EmbeddedContent {...this.props} />
          </Skeleton>
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

export default Embedded
