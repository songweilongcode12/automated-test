/**
 * filter list page
 * auther Joshua
 * date 2019-03-26
 */
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Table,
  Modal,
} from 'antd';
import lodash from 'lodash';
import Breadcrumb from '../../Breadcrumb';
// import Icon from '../../Icon';
import Layout from '../../Layout';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';

import {
  parseTableData,
  handleMoreBtnEvent,
  findModule,
} from '../../../utils/module';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import { createUuid } from '../../../utils';
import ActionMore from '../../ActionMore';
import reduxKey from '../../../constants/reduxKey';

const galaxyPrefix = 'bg-galaxy';

const shortcutData = [
  [
    {
      key: 'listView',
      icon: 'bars',
      helpTooltip: 'List View',
      linkRoute: routes.LIST_VIEW,
      uuid: createUuid(),
    },
  ],
  [
    {
      key: 'action',
      icon: 'setting',
      helpTooltip: 'Action',
      linkRoute: routes.ACTION,
      uuid: createUuid(),
    },
  ],
]

class FilterRulesViewContent extends Component {

  state = {
    moduleEntity: {},
  }

  componentDidMount () {

    const {
      moduleID,
      storeID,
      appID,
    } = parseParams(this.props);

    const moduleEntity = findModule({props: this.props, appID, storeID, moduleID})

    this.setState({
      moduleEntity,
    })
  }

  getDataSource = (data = []) => {
    const dataSource = [];
    data.forEach(item => {
      dataSource.push(parseTableData({data: item}));
    });

    return dataSource;
  }

  getColumns = () => {
    const { t } = this.props;
    const { galaxyState } = parseParams(this.props);
    const columns = [
      {
        title: t('common:module.filterName'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('common:type'),
        dataIndex: 'type',
        key: 'type',
      },
    ]
    if (galaxyState === 'builder') {
      columns.push({
        title: t('common:action'),
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 180,
        render: (text, record) => (
          <span>
            <ActionMore
              dataSource={[
                {
                  title: 'edit',
                  type: common.DEFAULT,
                  status: 'active',
                  icon: 'icon-edit',
                  iconType: 'bindo',
                  scriptName: 'Edit',
                  params: {},
                  uuid: createUuid(),
                },
                {
                  title: 'delete',
                  type: common.DEFAULT,
                  status: 'active',
                  icon: 'icon-delete',
                  iconType: 'bindo',
                  scriptName: 'Delete',
                  params: {},
                  uuid: createUuid(),
                },
              ]}
              onBtnClick={(btnData) => handleMoreBtnEvent(btnData, {
                handleEditClick: () => this.handleRecord(record, 'edit'),
                handleDeleteClick: () => this.handleDelete(record),
              })}
            />
          </span>
        ),
      });
    }
    return columns;
  }

  // 处理点击查看和编辑
  handleRecord = (record, action) => {
    const { history } = this.props;
    const params = {};
    let route = routes.FILTER_RULES_RECORD;
    if (record && record.uuid) {
      route = routes.FILTER_RULES_RECORD_ACTION;
      params.recordID = record.uuid;
      params.record = record;
    }

    if (action) {
      params.action = action;
    }
    history.push({ pathname: createRouteUrl(route, params, this.props) });
  }

  handleDelete = (record) => {
    const {
      t,
    } = this.props;

    const { uuid } = record;

    Modal.confirm({
      title: t('common:module.deletePrompt'),
      content: record.Name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: () => {
        this.handleCodintionDelete({data: {uuid}})
      },
    })
  }

  // 处理conditotion数据 delete
  handleCodintionDelete = ({data}) => {
    const {
      dispatch,
      history,
    } = this.props;

    const {
      moduleEntity,
    } = this.state;

    const {
      moduleID,
      storeID,
    } = parseParams(this.props);

    let {
      queryConditions = [],
    } = moduleEntity;

    queryConditions = queryConditions.filter(item => item.uuid !== data.uuid)

    moduleEntity.queryConditions = queryConditions;
    this.setState({
      moduleEntity,
    })
    dispatch({
      type: reduxKey.UPDATE_MODULE, payload: {
        storeID,
        id: moduleID,
        data: moduleEntity,
      },
    });
    const route = routes.FILTER_RULES_VIEW;
    history.push({ pathname: createRouteUrl(route, {}, this.props)});
  }

  render () {
    const {
      t,
      getBreadcrumbData,
    } = this.props;

    const {
      moduleEntity = {},
    } = this.state;

    const {
      galaxyState,
      storeSlugs,
      menuID,
    } = parseParams(this.props);

    let {
      queryConditions = [],
    } = moduleEntity;

    // 后台默认值为null, 这里转为空数组[]
    if (lodash.isEmpty(queryConditions)) {
      queryConditions = []
    }

    if (galaxyState === common.DASHBOARD) {
      if (menuID) {
        return (
          <Redirect
            to={createRouteUrl(routes.RECORDS, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      } else {
        return (
          <Redirect
            to={createRouteUrl(routes.MODULES, {
              page: 1,
              pageSize: 10,
            }, this.props)}
          />
        )
      }
    }

    return (
      <Layout.Content className='column'>
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={getBreadcrumbData()}
            {...this.props}
            shortcutData={shortcutData}
          />
        </div>
        <div className={`${galaxyPrefix}-content`} ref={this.handleContentRef}>
          <Table
            dataSource={this.getDataSource(queryConditions)}
            columns={this.getColumns()}
            pagination={false}
            scroll={{ x: 'max-content' }}
            rowKey={record => record.uuid}
          />
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>Filter Rules</span>
          <Button
            type="primary"
            className={`${galaxyPrefix}-btn`}
            onClick={() => this.handleRecord(null, 'new')}
          >
            {t('common:new')}
          </Button>
        </div>
      </Layout.Content>
    );
  }
}

export default FilterRulesViewContent
