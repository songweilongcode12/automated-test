import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Table, Pagination, Modal } from 'antd';
import Breadcrumb from '../../Breadcrumb';
import Layout from '../../Layout';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';

import {
  parseTableData,
  handleMoreBtnEvent,
} from '../../../utils/module';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import reduxKey from '../../../constants/reduxKey';
import { queryScriptRecords, deleteScript } from '../../../data/graphql/action';
import { createUuid } from '../../../utils';
import ActionMore from '../../ActionMore'

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

class ActionListViewContent extends Component {

  state = {
    records: [],
    currentPage: 1,
    pageSize: 10,
    total: 0,
  }

  componentDidMount () {
    const {
      currentPage = 1,
      pageSize = 10,
      formulas = [],
    } = this.state;
    this.loadSriptRecord({
      props: this.props,
      currentPage,
      pageSize,
      formulas,
    })
  }

  loadSriptRecord = async ({
    props,
    currentPage,
    pageSize,
    formulas = [],
  }) => {
    const {
      moduleID,
      storeID,
    } = parseParams(props);
    const { dispatch } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    try {
      const {
        pageInfo = {},
        data = [],
      } = await queryScriptRecords({
        storeID,
        moduleID,
        search: {
          page: currentPage,
          perPage: pageSize,
          formulas,
          includeTotal: true,
        },
      })

      const { total } = pageInfo;

      this.setState({
        total,
        records: data,
        currentPage,
        pageSize,
      })
    } catch (error) {
      log.error(error)
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
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
        title: t('common:module.actionName'),
        dataIndex: 'actionName',
        key: 'actionName',
      },
      {
        title: t('common:module.actionType'),
        dataIndex: 'actionType',
        key: 'actionType',
      },
      {
        title: t('common:module.triggerCondition'),
        dataIndex: 'triggerCondition',
        key: 'triggerCondition',
        render: text => {
          if (!text) {
            return '--';
          }
          return text;
        },
      },
      {
        title: t('common:module.actionTodo'),
        dataIndex: 'actionToDo',
        key: 'actionToDo',
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
                handleEditClick: () => this.handleRecord(record.id, 'edit'),
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
  handleRecord = (recordID, action) => {
    const { history } = this.props;
    const params = {};
    let route = routes.ACTION_RECORD;

    if (recordID) {
      route = routes.ACTION_RECORD_ACTION;
      params.recordID = recordID;
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

    const { storeID } = parseParams(this.props);

    const { id } = record;

    Modal.confirm({
      title: t('common:module.deletePrompt'),
      content: record.actionName,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: async () => {
        const { success } = await deleteScript({
          storeID,
          scriptID: id,
        })
        if (success) {
          this.loadSriptRecord({
            props: this.props,
          });
        }
      },
    })
  }

  render () {
    const { t, getBreadcrumbData } = this.props;
    const { galaxyState, storeSlugs, menuID } = parseParams(this.props);
    const { records, pageSize, currentPage, total } = this.state;

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
            dataSource={this.getDataSource(records)}
            columns={this.getColumns()}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          <Pagination
            style={{ margin: '16px 0', float: 'right' }}
            total={total}
            current={currentPage}
            pageSize={pageSize}
            showSizeChanger
            showQuickJumper
            onChange={this.handlePageChange}
            onShowSizeChange={this.handleShowSizeChange}
          />
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>Overview</span>
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

export default ActionListViewContent
