import React, { Component } from 'react'
import {
  Skeleton,
} from 'antd'
import {
  parseParams,
  getCurrentI18nValue,
} from '../../utils/galaxy'
import { findMenuBranch } from '../../utils/menu'
import { findApp } from '../../utils/app'
import { queryEmbeddedUrl } from '../../data/graphql/menu'
import routes from '../../constants/routes'
import common from '../../constants/common'

const prefix = 'bg-r-embedded';
const galaxyPrefix = 'bg-galaxy';

class EmbeddedContent extends Component {
  state = {
    iframeUrl: null,
    loadingContent: true,
  }

  componentDidMount() {
    this.queryEmbedded(this.props);
    this.handleTimeout();
  }

  shouldComponentUpdate(nextProps) {
    const { menuID } = parseParams(this.props);
    const { menuID: nextMenuID } = parseParams(nextProps);

    if (menuID !== nextMenuID) {
      this.setState({
        loadingContent: true,
      })
      this.queryEmbedded(nextProps);
      this.handleTimeout();
    }

    return true;
  }

  handleTimeout = () => {
    setTimeout(() => {
      const {
        loadingContent,
      } = this.state;
      if (loadingContent) {
        this.setState({
          loadingContent: false,
        })
      }
    }, 2 * 60 *1000);
  }

  queryEmbedded = async props => {
    const {
      storeID,
      menuID,
    } = parseParams(props);

    let iframeUrl = null;

    try {
      iframeUrl = await queryEmbeddedUrl({storeID, menuID});
    } catch (error) {
      log.error(error);
    }

    this.setState({
      iframeUrl,
      loadingContent: false,
    });
  }

  handleLoad = () => {
    this.setState({
      loadingContent: false,
    })
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
      storeID,
    } = parseParams(this.props);

    const {
      iframeUrl,
      loadingContent,
    } = this.state;

    let oldDashboard = false;
    let url = iframeUrl;
    if (url && url.indexOf('{storeID}') > 0) {
      oldDashboard = true;
      url = url.replace('{storeID}', storeID);
    }

    return (
      <Skeleton
        active={true}
        loading={loadingContent}
        className="bg-galaxy-skeleton"
      >
        <div className={`${galaxyPrefix}-content ${prefix}-content`}>
          {
            url && !oldDashboard &&
            <iframe
              title="Embedded"
              className={`${prefix}-iframe`}
              src={url}
              onLoad={this.handleLoad}
              onError={this.handleLoad}
            />
          }
          {
            url && oldDashboard &&
            <div className={`${prefix}-dashbaord`}>
              <iframe
                title="Embedded"
                className={`${prefix}-iframe`}
                src={url}
                onLoad={this.handleLoad}
                onError={this.handleLoad}
              />
            </div>
          }
        </div>
      </Skeleton>
    );
  }
}

export default EmbeddedContent;
