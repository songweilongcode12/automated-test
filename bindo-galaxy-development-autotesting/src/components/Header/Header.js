import React, { Component } from 'react';
import { Menu, Dropdown, Input, Checkbox, Button, Skeleton } from 'antd';
import Icon from '../Icon';
import i18n from '../../i18n';
import {
  parseParams,
  createRouteUrl,
  isStaffRole,
  getMenuUrl,
} from '../../utils/galaxy';
import {
  findStoresAppsBySlugs,
} from '../../utils/app';
import {
  findMenuBranch,
  parseMenuBranch,
} from '../../utils/menu';
import common from '../../constants/common';
import reduxKey from '../../constants/reduxKey';
import routes from '../../constants/routes';
import { languageData } from '../../data';
import './Header.less';

const prefix = 'bg-c-header';

class Header extends Component {
  state = {
    filterStoreKey: '',
    storeVisible: false,
    slugSet: new Set(),
  }

  componentDidMount() {
    const {
      storesMap,
    } = this.props;

    if (storesMap.size < 1) {
      const {
        slug,
        menuID,
        storeSlugs,
      } = parseParams(this.props);
      this.queryStores({
        slug,
        menuID,
        storeSlugs,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { slug } = parseParams(this.props);
    const {
      slug: nextSlug,
      menuID,
      storeSlugs,
    } = parseParams(nextProps);

    if (slug !== nextSlug) {
      this.queryStores({
        slug,
        menuID,
        storeSlugs,
      });
    }

    return true;
  }

  queryStores = ({
    slug,
    menuID,
    storeSlugs,
  }) => {
    const {
      dispatch,
      storesMap: propsStoresMap,
      storesIDRefSlug,
      storesSlugRefID,
      storesAppsMap,
      storesAppsModulesMap,
      storesModulesPermissionsMap,
      storesRolesMap,
      roleModule,
      loginUser,
    } = this.props;

    dispatch({
      type: reduxKey.QUERY_STORES_APPS,
      payload: {
        storesMap: propsStoresMap,
        storesIDRefSlug,
        storesSlugRefID,
        storesAppsMap,
        storesAppsModulesMap,
        storesModulesPermissionsMap,
        storesRolesMap,
        roleModule,
        loginUser,
        storeSlug: slug,
        storeSlugs,
        menuID,
      },
    });
  }

  handleSettingClick = ({ key }) => {
    if (key === 'singOut') {
      localStorage.setItem('access_token', '');
      localStorage.setItem('redirect_url', '');
      window.location.href = '/login';
    }
  }

  getSettingOverlay = t => (
    <Menu onClick={this.handleSettingClick}>
      <Menu.Item key="singOut">
        { t('common:login.signOut') }
      </Menu.Item>
    </Menu>
  )

  getLanguageOverlay = () => (
    <Menu onClick={({key}) => i18n.changeLanguage(key)}>
      {
        languageData.map(item =>
          <Menu.Item key={item.key}>
            <Icon type={item.icon} />
            {item.title}
          </Menu.Item>
        )
      }
    </Menu>
  )

  /**
   * Get the current language Title
   */
  getLanguageTitle = () => {
    for (let i = 0; i < languageData.length; i++) {
      if (languageData[i].key === i18n.language) {
        return languageData[i].title;
      }
    }
  }

  handleVisibleChange = (visible) => {
    let slugSet = new Set();
    if (visible) {
      const {
        storeSlugs = [],
      } = parseParams(this.props);
      slugSet = new Set(storeSlugs);
    }

    this.setState({
      slugSet,
      storeVisible: visible,
    });
  }

  handleSelectFilter = (evt) => {
    const { target: { value } } = evt;
    this.setState({
      filterStoreKey: value,
    });
  }

  handleStoreSelected = (slug) => {
    const {
      slugSet,
    } = this.state;

    const newSlugSet = new Set(slugSet);

    if (newSlugSet.has(slug)) {
      newSlugSet.delete(slug);
    } else {
      newSlugSet.add(slug);
    }

    this.setState({
      slugSet: newSlugSet,
    });
  }

  handleDeselectAll = () => {
    this.setState({
      slugSet: new Set(),
    });
  }

  handleSelectAll = () => {
    const {
      storesMap,
    } = this.props;

    this.setState({
      slugSet: new Set([...storesMap.keys()]),
    });
  }

  handleApply = () => {
    const {
      slugSet,
    } = this.state;

    this.handleStoreClick([...slugSet]);
  }

  handleStoreClick = (slugs = []) => {
    if (!slugs || slugs.length < 1) {
      return;
    }
    const {
      history,
      storesIDRefSlug,
    } = this.props;
    const {
      slug,
      menuID,
    } = parseParams(this.props);

    let pathname = '/';
    if (slugs.indexOf(slug) > -1) {
      pathname = createRouteUrl(
        '',
        {
          storeSlugs: slugs,
        },
        this.props
      )
    } else {
      this.queryStores({
        slug: slugs.length === 1 ? slugs[0] : slug,
        menuID,
        storeSlugs: slugs,
      });
      const storesApps = findStoresAppsBySlugs({
        props: this.props,
        slugs,
      });
      const menuBranch = findMenuBranch(storesApps);
      const {
        menu = null,
        openMenuKeys = [],
      } = parseMenuBranch(menuBranch);

      const {
        storesMap,
        dispatch,
      } = this.props;

      if (menu) {
        pathname = getMenuUrl({
          menu,
          storesMap,
        });

        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            openMenuKeys,
          },
        });
      } else {
        let storesApp = null;
        if (Array.isArray(storesApps) && storesApps.length > 0) {
          [storesApp] = storesApps;
        }

        if (storesApp && storesApp.id) {
          pathname = createRouteUrl(
            routes.APP_WELCOME,
            {
              storeSlugs: slugs,
              appID: storesApp.id,
              slug: storesIDRefSlug.get(storesApp.inStoreID),
            },
            this.props
          )
        } else {
          pathname = createRouteUrl(
            routes.WELCOME,
            {
              storeSlugs: slugs,
            },
            this.props
          )
        }
      }
    }

    history.push({
      pathname,
    });

    this.handleVisibleChange(false);
  }

  getStoreView = () => {
    const {
      storesMap,
    } = this.props;
    const {
      storeSlugs = [],
    } = parseParams(this.props);
    const {
      slugSet,
      filterStoreKey,
    } = this.state;

    const propsMenuItems = [];
    const menuItems = [];

    storesMap.forEach((store, slug) => {
      const { title } = store;
      if (
        filterStoreKey
        && title.toLowerCase().indexOf(filterStoreKey.toLowerCase()) < 0
        && !slugSet.has(slug)
      ) {
        return;
      }

      const menuItem = (
        // eslint-disable-next-line react/no-array-index-key
        <div key={slug} className={`${prefix}-store-drop-item`}>
          <Checkbox
            checked={slugSet.has(slug)}
            onChange={() => this.handleStoreSelected(slug)}
          />
          <div
            className={`${prefix}-store-drop-title ${slugSet.has(slug) ? 'selected' : ''}`}
            onClick={() => this.handleStoreClick([slug])}
          >
            {store.title}
          </div>
        </div>
      );

      if (storeSlugs.indexOf(slug) > -1) {
        propsMenuItems.push(menuItem);
      } else {
        menuItems.push(menuItem);
      }
    });

    return [...propsMenuItems, ...menuItems];
  }

  getStoreOverlay = () => {
    const { t } = this.props;
    const { slugSet } = this.state;
    return (
      <Menu>
        <Menu.Item>
          <Input.Search className={`${prefix}-store-drop-search`} onChange={this.handleSelectFilter} />
        </Menu.Item>
        <Menu.Item className={`${prefix}-store-drop-content`}>
          { this.getStoreView() }
        </Menu.Item>
        <Menu.Item className={`${prefix}-store-drop-btn-wrapper`}>
          <Button onClick={this.handleDeselectAll}>
            {t('common:header.deselectAll')}
          </Button>
          <Button className={`${prefix}-store-drop-btn`} onClick={this.handleSelectAll}>
            {t('common:header.selectAll')}
          </Button>
          <Button type="primary" disabled={slugSet.size < 1} onClick={this.handleApply}>
            {t('common:header.apply')}
          </Button>
        </Menu.Item>
      </Menu>
    );
  }

  handleGalaxyStateClick = () => {
    const { history } = this.props;
    const { galaxyState } = parseParams(this.props);

    history.push({
      pathname: createRouteUrl(
        '',
        {
          galaxyState: galaxyState === common.BUILDER ? common.DASHBOARD : common.BUILDER,
        },
        this.props
      ),
    });
  }

  getStoreTitle = () => {
    const {
      storesMap,
    } = this.props;

    const {
      slug,
      storeSlugs = [],
    } = parseParams(this.props);

    let storeTitle = '';

    if (storeSlugs.length > 1) {
      storeTitle = `${storeSlugs.length} Stores/Chains Selected`;
    } else if(storeSlugs.length === 1) {
      let newSlug = slug;
      if (!slug && storeSlugs.length === 1) {
        [newSlug] = storeSlugs;
      }
      const store = storesMap.get(newSlug);
      if (store && store.title) {
        storeTitle = store.title;
      }
    } else {
      storeTitle = 'No Store/Chains Selected';
    }

    return {
      storeTitle,
    };
  }

  getUserName = () => {
    const {
      loginUser,
      storesMap,
    } = this.props;
    const {
      full_name: fullName = '',
      id: userID,
    } = loginUser || {};
    let hasUserName = true;
    if (userID) {
      hasUserName = false;
    }

    let userName = fullName || '';

    const {
      slug,
    } = parseParams(this.props);
    const store = storesMap.get(slug);
    if (store && store.roleName) {
      userName = `${userName} - ${store.roleName}`;
    }

    return {
      hasUserName,
      userName,
    };
  }

  render() {
    const {
      t,
      loginUser,
    } = this.props;
    const { storeVisible } = this.state;
    const { galaxyState } = parseParams(this.props);
    const {
      id: userID,
    } = loginUser || {};
    const isStaff = isStaffRole(this.props);

    const {
      hasUserName,
      userName,
    } = this.getUserName();

    const {
      storeTitle,
    } = this.getStoreTitle();

    return (
      <div className={`${prefix} ${galaxyState}`}>
        <div className={`${prefix}-node logo`}>
          {
            galaxyState === common.BUILDER &&
            <Icon type="icon-modulebuilderlogo" />
          }
          {
            galaxyState !== common.BUILDER &&
            <Icon type="icon-bindodashboardlogo" />
          }
        </div>
        {
          isStaff && userID && userID !== 102280 &&
          <div className={`${prefix}-node right test-${prefix}-node`}>
            <Button
              className={`${prefix}-node-galaxy-state-icon`}
              onClick={this.handleGalaxyStateClick}
            >
              <Icon type={galaxyState === common.BUILDER ? 'icon-B' : 'icon-M1'} />
            </Button>
          </div>
        }
        <Dropdown overlay={this.getSettingOverlay(t)} placement="bottomCenter">
          <div className={`${prefix}-node right`}>
            <div className={`${prefix}-node-icon`}>
              <Icon type="icon-customers" />
            </div>
            <Skeleton
              active
              loading={hasUserName}
              paragraph={false}
              className={`${prefix}-skeleton`}
            >
              <div>{userName}</div>
            </Skeleton>
          </div>
        </Dropdown>
        <Dropdown
          overlay={this.getStoreOverlay(t)}
          onVisibleChange={this.handleVisibleChange}
          visible={storeVisible}
          trigger={['click']}
          placement="bottomCenter"
          overlayClassName={`${prefix}-store-drop`}
        >
          <div className={`${prefix}-node right`}>
            <div className={`${prefix}-node-icon`}>
              <Icon type="icon-app-store" />
            </div>
            <Skeleton
              active
              loading={hasUserName}
              paragraph={false}
              className={`${prefix}-skeleton`}
            >
              <div>{storeTitle}</div>
            </Skeleton>
          </div>
        </Dropdown>
        <Dropdown overlay={this.getLanguageOverlay()} placement="bottomCenter">
          <div className={`${prefix}-node right`}>
            <div className={`${prefix}-node-icon`}>
              <Icon type="icon-language" />
            </div>
            <div>{this.getLanguageTitle()}</div>
          </div>
        </Dropdown>
      </div>
    );
  }
}

export default Header;
