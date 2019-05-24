import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import {
  Skeleton,
} from 'antd'
import MenusContent from './MenusContent'
import RightSide from './RightSide'
import MenusFooter from './MenusFooter'
import MenuForm from './MenuForm'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import {
  createRouteUrl,
  getCurrentI18nValue,
  parseParams,
  gotoDashboard,
} from '../../utils/galaxy'
import {
  findAppMenusBySlug,
} from '../../utils/menu'
import {
  findApp,
} from '../../utils/app'
import routes from '../../constants/routes'
import galaxyConstant from '../../constants/galaxyConstant'
import reduxKey from '../../constants/reduxKey'
import common from '../../constants/common'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class Menus extends Component {
  state = {
    sorting: false,
    menuData: {},
    parentID: null,
    sortingMenus: [],
    showMenuModal: false,
    modeType: galaxyConstant.NORMAL,
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  getDataSource = () => {
    const menus = [];
    const {
      modeType,
      sortingMenus,
    } = this.state;

    if (modeType === galaxyConstant.SORTING) {
      menus.push(...sortingMenus);
    } else {
      const {
        slug,
        appID,
      } = parseParams(this.props);
      const appMenus = findAppMenusBySlug({
        props: this.props,
        slug,
        appID,
      });

      menus.push(...appMenus);
    }

    return menus;
  }

  handleSortClick = () => {
    this.setState({
      modeType: galaxyConstant.SORTING,
      sortingMenus: lodash.cloneDeep(this.getDataSource()),
    });
  }

  handleDiscardSortClick = () => {
    this.setState({
      modeType: galaxyConstant.NORMAL,
      sortingMenus: [],
    });
  }

  handleSaveSortClick = async () => {
    const menusPosition = [];
    const loop = (data) => {
      data.forEach((item, index) => {
        menusPosition.push({
          menuID: item.id,
          position: index + 1,
          parentID: item.realParentID,
        });

        if (item.children) {
          loop(item.children);
        }
      });
    };

    const {
      sortingMenus,
    } = this.state;

    loop(sortingMenus);

    const {
      dispatch,
    } = this.props;
    const {
      storeID,
      appID,
    } = parseParams(this.props);

    dispatch({
      type: reduxKey.SORTING_MENUS,
      payload: {
        storeID,
        appID,
        menusPosition,
        callback: () => {
          this.setState({
            modeType: galaxyConstant.NORMAL,
            sortingMenus: [],
          });
        },
      },
    });
  }

  handleNew = (evt) => {
    evt.stopPropagation();

    this.setState({
      parentID: '0',
      menuData: {},
      showMenuModal: true,
    });
  }

  getBreadcrumbData = () => {
    const {
      t,
    } = this.props;
    const {
      storeID,
      appID,
    } = parseParams(this.props);
    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });

    return [{
      id: 'apps',
      type: 'link',
      url: createRouteUrl(routes.APPS, {}, this.props),
      name: t('common:appDirectory'),
    }, {
      id: 'appMenus',
      type: 'label',
      name: getCurrentI18nValue('name', app),
    }];
  }

  render() {
    const {
      t,
      storesMap,
      storesAppsModulesMap,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      storeID,
      appID,
      // storeIDs,
      // stores,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      gotoDashboard(this.props);
    }

    const {
      modeType,
      sorting,
      sortingMenus,
      showMenuModal,
      menuData,
      parentID,
    } = this.state;

    return (
      <Layout {...this.props}>
        <Layout.Content className="column">
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
            />
          </div>
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <MenusContent
              {...this.props}
              modeType={modeType}
              sortingMenus={sortingMenus}
              onResetState={this.handleResetState}
              getDataSource={this.getDataSource}
            />
          </Skeleton>
          <MenusFooter
            t={t}
            modeType={modeType}
            sorting={sorting}
            onNewClick={this.handleNew}
            onDiscardSortClick={this.handleDiscardSortClick}
            onSaveSortClick={this.handleSaveSortClick}
            onSortClick={this.handleSortClick}
          />
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
        {
          showMenuModal &&
          <MenuForm
            data={menuData}
            storeID={storeID}
            appID={appID}
            parentID={parentID}
            storeSlugs={storeSlugs}
            storesAppsModulesMap={storesAppsModulesMap}
            onCancel={() => this.setState({showMenuModal: false})}
          />
        }
      </Layout>
    );
  }
}

export default Menus
