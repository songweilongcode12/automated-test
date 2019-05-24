import React, { Component } from 'react'
import moment from 'moment'
import lodash from 'lodash'
import { Table } from 'antd'
import {
  parseParams,
  createRouteUrl,
} from '../../utils/galaxy'
import {
  stringArrayEqual,
} from '../../utils'
import routes from '../../constants/routes'
import reduxKey from '../../constants/reduxKey'

const galaxyPrefix = 'bg-galaxy';

class ModelsContent extends Component {
  componentDidMount() {
    this.loadModules(this.props);
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

  loadModules = async (props) => {
    const {
      dispatch,
      storesAppsModulesMap,
      storesModulesPermissionsMap,
      storesRolesMap,
      roleModule,
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

  handleRowClick = (record) => {
    const {
      history,
      storesIDRefSlug,
    } = this.props;

    let slug = null;

    if (lodash.isMap(storesIDRefSlug) && record) {
      slug = storesIDRefSlug.get(record.inStoreID)
    }

    if (slug) {
      history.push({ pathname: createRouteUrl(
        routes.MODEL_FIELDS,
        {
          moduleID: record.id,
          slug,
          modelName: record.tableName,
        },
        this.props
      )});
    }
  }

  getColumns = () => {
    const { t } = this.props;

    return [{
      title: t('common:name'),
      dataIndex: 'tableInfo',
      key: 'table_name',
      render: (text, record) => {
        const { tableName } = text || {};
        const { name } = record || {};
        const newText = tableName || name;

        return newText;
      },
    }, {
      title: t('common:database'),
      dataIndex: 'tableInfo',
      key: 'database',
      render: (text) => {
        const { database } = text || {};
        const newText = database || 'bindo';

        return newText;
      },
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
                ...module,
                key: `${module.inStoreID}_${module.id}`,
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
          onRow={(record, index) => ({
            onClick: () => this.handleRowClick(record, index),
          })}
        />
      </div>
    );
  }
}

export default ModelsContent;
