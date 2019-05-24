import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Skeleton,
} from 'antd'
import SchedulerViewFooter from './SchedulerViewFooter'
import RightSide from './RightSide'
import Layout from '../../Layout'
import Breadcrumb from '../../Breadcrumb'
import SchedulerViewContent from './SchedulerViewContent'
import NotPermissionsView from '../../NotPermissionsView'
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
  getModulePermissionsMap,
} from '../../../utils/galaxy'
import {
  findModule,
  getModuleFuncBtns,
} from '../../../utils/module'
import {
  findApp,
} from '../../../utils/app'
import { findMenuBranch } from '../../../utils/menu'
import common from '../../../constants/common'
import routes from '../../../constants/routes'
import galaxyConstant from '../../../constants/galaxyConstant'
import './SchedulerView.less'
import reduxKey from '../../../constants/reduxKey';

const galaxyPrefix = 'bg-galaxy';
const listviewPrefix = 'bg-c-parser-listview';

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
class Scheduler extends Component {

  state = {
    showImportModal: false,
  }

  handleResetState = (state) => {
    this.setState(state)
  }

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

    const {
      storesMap,
    } = this.props;

    const {
      slug,
    } = parseParams(this.props);

    let isManager = false;
    if (storesMap.has(slug)) {
      const store = storesMap.get(slug);
      if (store.roleType === 1) {
        isManager = true;
      }
    }
    const shortcutData = [
      [
        {
          key: 'scheduler',
          icon: 'icon-Scheduler',
          helpTooltip: 'Scheduler View',
          linkRoute: routes.SCHEDULER,
          isIconfont: true,
        },
        {
          key: 'records',
          icon: 'bars',
          helpTooltip: 'List View',
          linkRoute: routes.RECORDS,
        },
      ],
      [
        {
          key: 'listWikiView',
          icon: 'book',
          helpTooltip: 'List Wiki View',
          linkRoute: routes.PARSE_WIKI,
          routerParams: {
            from: common.LIST,
          },
        },
        isManager &&
        {
          key: 'permissions',
          icon: 'lock',
          helpTooltip: 'Permissions',
          routerParams: {
            from: common.LIST,
          },
          linkRoute: routes.PERMISSIONS,
        },
      ],
    ];

    return shortcutData;
  }

  handleRecord = (recordID, action) => {
    const { history } = this.props;
    const params = {};
    let route = routes.RECORD;

    if (recordID) {
      route = routes.RECORD_ACTION;
      params.recordID = recordID;
    }

    if (action) {
      params.action = action;
    }

    history.push({ pathname: createRouteUrl(route, params, this.props) });
  };

  showExportModuleModal = () => {
    this.setState({
      showExportModulerecord: true,
    })
  }

  handleClickImport = ()=> {
    this.setState({
      showImportModal: true,
    })

    const {
      dispatch,
    } = this.props;
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    dispatch({
      type: reduxKey.MODULE_RECORD_IMPORT_TEMPLATE,
      payload: {
        storeID,
        moduleID,
        callback: info => {
          const {
            template = '',
          } = info;
          if(template.length > 0){
            this.setState({
              csvData: template,
            })
          }
        },
      },
    })
  }

  // 展示默认的view
  showDefaultView = (viewType) => {
    const {
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    const module = findModule({
      props: this.props,
      storeID,
      appID,
      moduleID,
    })

    const {
      template,
    } = module || {};

    const {
      defaultView = common.LIST,
    } = template || {};

    if (viewType === defaultView) return true;
  }

  render() {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;
    const {
      galaxyState,
      storeSlugs,
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
    }

    const module = findModule({
      props: this.props,
      storeID,
      appID,
      moduleID,
    })

    const permissionsMap = getModulePermissionsMap({
      props: this.props,
    })

    const funcBtns = getModuleFuncBtns({
      module,
    })

    const {
      listSet = {},
    } = funcBtns || {};

    if(listSet.has('New')){
      listSet.delete('New');
    }

    const {
      showImportModal,
      csvData,
      showExportModulerecord = false,
    } = this.state;

    const canView = permissionsMap.get(galaxyConstant.ACTIONS).has('VIEW');

    return (
      <Layout {...this.props}>
        <Layout.Content className='column'>
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              {...this.props}
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
              shortcutData={this.getShortcutData()}
            />
          </div>
          <Skeleton
            active={true}
            loading={storesMap.size < 1 || !permissionsAndModulesDone}
            className="bg-galaxy-skeleton"
          >
            {
              !canView &&
              <div
                className={`${galaxyPrefix}-content ${listviewPrefix}-content`}
                style={{display: 'flex'}}
              >
                <NotPermissionsView />
              </div>
            }
            {
              canView &&
              <SchedulerViewContent
                {...this.props}
                module={module}
                funcBtns={funcBtns}
                showImportModal={showImportModal}
                permissionsMap={permissionsMap}
                showExportModulerecord={showExportModulerecord}
                csvData={csvData}
                onResetState={this.handleResetState}
              />
            }
          </Skeleton>
          <SchedulerViewFooter
            {...this.props}
            funcBtns={funcBtns}
            permissionsMap={permissionsMap}
            onImportClick={this.handleClickImport}
            onExportClick={this.showExportModuleModal}
            onNewClick={() => this.handleRecord(null, 'new')}
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

      </Layout>
    );
  }
}

export default Scheduler;
