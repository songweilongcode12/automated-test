import React, { Component } from 'react'
import moment from 'moment'
import lodash from 'lodash'
import { Table } from 'antd'
import {
  parseParams,
  createMenuUrl,
  createRouteUrl,
} from '../../utils/galaxy'
import {
  findApp,
} from '../../utils/app'
import {
  findNode,
  stringArrayEqual,
} from '../../utils'
import routes from '../../constants/routes'
import reduxKey from '../../constants/reduxKey'

const galaxyPrefix = 'bg-galaxy';

class ModulesContent extends Component {
  componentDidMount() {
    this.queryModulesAndTables(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const { storeSlugs } = parseParams(this.props);
    const { storeSlugs: nextStoreSlugs } = parseParams(nextProps);

    if (!stringArrayEqual(storeSlugs, nextStoreSlugs)) {
      const { dispatch } = this.props;
      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });
      this.queryModulesAndTables(nextProps);
    }

    return true;
  }

  queryModulesAndTables = async (props) => {
    const {
      dispatch,
      storesAppsModulesMap,
      storesModulesPermissionsMap,
      storesRolesMap,
      roleModule,
      bindoTablesMap,
    } = props;

    const {
      storeIDs,
    } = parseParams(props);

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    try {
      dispatch({
        type: reduxKey.QUERY_USER_STORES_PERMISSIONS,
        payload: {
          storeIDs,
          storesAppsModulesMap,
          storesModulesPermissionsMap,
          storesRolesMap,
          roleModule,
        },
      });

      if (storeIDs.length > 0) {
        dispatch({
          type: reduxKey.QUERY_BINDO_TABLES,
          payload: {
            storeID: storeIDs[0],
            bindoTablesMap,
          },
        });
      }
    } catch (error) {
      log.error(error);
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  }

  getColumns = () => {
    const {
      t,
    } = this.props;

    const columns = [{
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: t('common:app.store'),
      dataIndex: 'inStoreID',
      key: 'inStoreID',
      render: (text) => {
        let newText = '--';

        const {
          storesMap,
          storesIDRefSlug,
        } = this.props;

        let storeSlug
        if (lodash.isMap(storesIDRefSlug)) {
          storeSlug = storesIDRefSlug.get(text)
        }

        let store
        if (storeSlug && lodash.isMap(storesMap)) {
          store = storesMap.get(storeSlug)
        }

        if (store) {
          newText = store.title;
        }

        return newText;
      },
    }, {
      title: t('common:app.name'),
      dataIndex: 'appID',
      key: 'appID',
      render: (text, record) => {
        let newText = '--';

        const {
          storesAppsMap,
        } = this.props;

        let appsMap
        if (lodash.isMap(storesAppsMap)) {
          appsMap = storesAppsMap.get(record.inStoreID)
        }

        let app
        if (lodash.isMap(appsMap)) {
          app = appsMap.get(text)
        }

        if (app) {
          newText = app.name;
        }

        return newText;
      },
    }, {
      title: t('common:module.bindTable'),
      dataIndex: 'tableInfo',
      key: 'tableInfo',
      render: tableInfo => tableInfo && tableInfo.tableName ? t('common:yes') : t('common:no'),
    },
    {
      title: t('common:createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }, {
      title: t('common:updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }];

    // if (galaxyState === 'builder') {
    //   columns.push({
    //     title: t('common:action'),
    //     key: 'action',
    //     align: 'left',
    //     width: 120,
    //     render: (text, record) => (
    //       <span>
    //         <Tooltip placement="bottom" title={t('common:edit')}>
    //           <Button
    //             key="edit"
    //             size="small"
    //             style={{border: 0}}
    //             onClick={(evt)=>this.handleEdit(evt, record)}
    //           >
    //             <Icon type="icon-edit" />
    //           </Button>
    //         </Tooltip>
    //         <Tooltip placement="bottom" title={t('common:view')}>
    //           <Button
    //             key="details"
    //             size="small"
    //             style={{border: 0, marginLeft: 5}}
    //             onClick={(evt) => this.handleView(evt, record)}
    //           >
    //             <Icon type="icon-view" />
    //           </Button>
    //         </Tooltip>
    //       </span>
    //     ),
    //   });
    // }

    return columns;
  }

  handleView = (evt, record) => {
    evt.stopPropagation();

    const app = findApp({
      props: this.props,
      storeID: record.inStoreID,
      appID: record.appID,
    });
    const menus = app.children || [];
    const menu = findNode(menus, 'moduleID', record.id);
    let showView = false;
    if (menu && menu.moduleID) {
      showView = true;
    }

    const {
      history,
      storesIDRefSlug,
    } = this.props;
    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);
    const slug = storesIDRefSlug.get(record.inStoreID)
    if (showView) {
      history.push({
        pathname: createMenuUrl(
          menu,
          {
            galaxyState,
            storeSlugs,
            slug,
          },
        ),
      });
    } else {
      history.push({
        pathname: createRouteUrl(
          routes.MODULE_VIEWS,
          {
            galaxyState,
            storeSlugs,
            slug,
            appID: record.appID,
            moduleID: record.id,
            moduleName: record.name,
          },
        ),
      });
    }
  }

  getDataSource = () => {
    const {
      storesAppsModulesMap,
    } = this.props;

    const modules = [];
    storesAppsModulesMap.forEach((appsModulesMap) => {
      if (lodash.isMap(appsModulesMap)) {
        appsModulesMap.forEach((appModulesMap) => {
          if (lodash.isMap(appModulesMap)) {
            appModulesMap.forEach((module) => {
              modules.push({
                key: `${module.inStoreID}_${module.id}`,
                ...module,
              });
            })
          }
        })
      }
    });

    return modules;
  }

  render() {
    return (
      <div className={`${galaxyPrefix}-content`}>
        <Table
          columns={this.getColumns()}
          dataSource={this.getDataSource()}
        />
      </div>
    );
  }
}

export default ModulesContent;
