import React, { Component } from 'react'
import moment from 'moment'
import { Table } from 'antd'
import {
  parseParams,
} from '../../utils/galaxy'
import {
  findModuleByID,
} from '../../utils/module'
import {
  stringArrayEqual,
} from '../../utils'
import reduxKey from '../../constants/reduxKey'

const galaxyPrefix = 'bg-galaxy';

class ModelFieldsContent extends Component {
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
      storeID,
    } = parseParams(props);

    try {
      dispatch({
        type: reduxKey.QUERY_USER_STORES_PERMISSIONS,
        payload: {
          storeIDs: [storeID],
          storesAppsModulesMap,
          storesModulesPermissionsMap,
          storesRolesMap,
          roleModule,
        },
      });
    } catch (error) {
      log.error(error);
    }
  }

  getColumns = () => {
    const { t } = this.props;

    return [{
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: t('common:label'),
      dataIndex: 'label',
      key: 'label',
    }, {
      title: t('common:type'),
      dataIndex: 'type',
      key: 'type',
    }, {
      title: t('common:createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => {
        if (!text) return;

        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    }, {
      title: t('common:updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (text) => {
        if (!text) return;

        return moment(text).format('YYYY-MM-DD HH:mm:ss');
      },
    }];
  }

  getDataSource = () => {
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    const module = findModuleByID({
      props: this.props,
      storeID,
      moduleID,
    }) || {}

    const fields = module.fields || [];

    fields.forEach(field => {
      field.key = field.uuid;
      field.database = module.database;
    });

    return fields;
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

export default ModelFieldsContent;
