import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Skeleton,
} from 'antd'
import AppsContent from './AppsContent'
import RightSide from './RightSide'
import AppsFooter from './AppsFooter'
import AppForm from './AppForm'
import SelectStoreModal from './SelectStoreModal'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import common from '../../constants/common'
import reduxKey from '../../constants/reduxKey'
import galaxyConstant from '../../constants/galaxyConstant'
import {
  parseParams,
  gotoDashboard,
} from '../../utils/galaxy'
import {
  findStoresAppsBySlugs,
} from '../../utils/app'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy, app }) => ({ ...galaxy, ...app }))
class Apps extends Component {
  state = {
    sorting: false,
    showStoresModal: false,
    appData: {},
    editAppStoreID: null,
    sortingApps: [],
    showAppModal: false,
    modeType: galaxyConstant.NORMAL,
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  handleNewApp = () => {
    this.setState({
      showStoresModal: false,
      appData: {},
      showAppModal: true,
    });
  }

  handleNew = () => {
    const {
      storeIDs,
    } = parseParams(this.props);

    if (storeIDs.length === 1) {
      this.setState({
        editAppStoreID: storeIDs[0],
      });

      this.handleNewApp();
    } else {
      let storeID = null;
      if (storeIDs.length > 0) {
        [storeID] = storeIDs;
      }

      this.setState({
        showStoresModal: true,
        editAppStoreID: storeID,
      });
    }
  }

  handleDiscardClick = () => {
    this.setState({
      modeType: galaxyConstant.NORMAL,
      sortingApps: [],
    });
  }

  handleSaveSortClick = async () => {
    const {
      dispatch,
    } = this.props;
    const {
      sortingApps,
    } = this.state;
    let storeID = null;
    const positions = [];

    sortingApps.forEach((app, idx) => {
      positions.push({
        id: app.id,
        position: idx+1,
      });

      if (!storeID) {
        storeID = app.inStoreID;
      }
    });

    dispatch({
      type: reduxKey.SORTING_APPS,
      payload: {
        storeID,
        positions,
        callback: () => {
          this.setState({
            modeType: galaxyConstant.NORMAL,
            sortingApps: [],
          });
        },
      },
    });
  }

  copyApp = (app) => ({
    key: `${app.inStoreID}_${app.id}`,
    id: app.id,
    name: app.name,
    type: app.type,
    storeID: app.storeID,
    inStoreID: app.inStoreID,
    icon: app.icon,
    iconType: app.iconType,
    position: app.position,
    i18n: app.i18n,
    preInstallEnable: app.preInstallEnable,
    publicStatus: app.publicStatus,
    createdAt: app.createdAt,
    updatedAt: app.updatedAt,
  })

  getDataSource = () => {
    const apps = [];
    const {
      modeType,
      sortingApps,
    } = this.state;

    if (modeType === galaxyConstant.SORTING) {
      apps.push(...sortingApps);
    } else {
      const {
        storeSlugs,
      } = parseParams(this.props);
      const storesApps = findStoresAppsBySlugs({
        props: this.props,
        slugs: storeSlugs,
      });
      storesApps.forEach(item => apps.push(this.copyApp(item)))
    }

    return apps;
  }

  handleSortClick = () => {
    this.setState({
      modeType: galaxyConstant.SORTING,
      sortingApps: this.getDataSource(),
    });
  }

  getBreadcrumbData = () => {
    const { t } = this.props;

    return [{
      id: 'apps',
      type: 'label',
      name: t('common:appDirectory'),
    }];
  }

  render() {
    const {
      t,
      storesMap,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      storeIDs,
      stores,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      gotoDashboard(this.props);
    }

    const {
      sorting,
      showStoresModal,
      showAppModal,
      appData,
      sortingApps,
      editAppStoreID,
      modeType,
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
            <AppsContent
              {...this.props}
              modeType={modeType}
              stores={stores}
              sortingApps={sortingApps}
              onResetState={this.handleResetState}
              getDataSource={this.getDataSource}
            />
          </Skeleton>
          <AppsFooter
            t={t}
            storeSlugs={storeSlugs}
            modeType={modeType}
            sorting={sorting}
            onNewClick={this.handleNew}
            onDiscardClick={this.handleDiscardClick}
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
          showStoresModal &&
          <SelectStoreModal
            t={t}
            title={t('common:app.selectStore')}
            storeID={editAppStoreID}
            stores={stores}
            onOkClick={this.handleNewApp}
            onCancelClick={() => this.setState({showStoresModal: false})}
            onSelecteChange={(value) => this.setState({ editAppStoreID: value })}
          />
        }
        {
          showAppModal &&
          <AppForm
            data={appData}
            storeIDs={storeIDs}
            storeID={editAppStoreID}
            storeSlugs={storeSlugs}
            onCancel={() => this.setState({showAppModal: false})}
          />
        }
      </Layout>
    );
  }
}

export default Apps
