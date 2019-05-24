import React, { Component } from 'react'
import {
  translate,
} from 'react-i18next'
import {
  List,
  Modal,
  Avatar,
  Spin,
  DatePicker,
  Select,
  Table,
  Button,
  message,
  Skeleton,
} from 'antd';
import InfiniteScroll from 'react-infinite-scroller'
import moment from 'moment'
import {
  queryLogs,
  exportLogs,
} from '../../data/graphql/log'
import {
  parseParams,
  filterOption,
} from '../../utils/galaxy'
import './Logs.less'

const prefix = 'bg-c-logs';

const dateFormat = 'YYYY-MM-DD';
const days = 30;

const infoLogs = [{
  title: 'Key',
  dataIndex: 'key',
  key: 'key',
  align: 'right',
  className: 'first-column',
  render: text => `${text}: `,
}, {
  title: 'Value',
  dataIndex: 'value',
  key: 'value',
  className: 'second-column',
}];

const operationSet = new Set(['create', 'update', 'delete']);

@translate()
class Logs extends Component {

  state = {
    loading: false,
    logList: [],
    hasMore: true,
    operation: null,
    startDate: moment().subtract(days, 'days'),
    endDate: moment(),
    totalPage: 0,
    currentPage: 0,
    pageSize: 20,
    showExportModal: false,
    exportStartDate: moment().subtract(days, 'days'),
    exportEndDate: moment(),
    storeID: '',
    url: '',
    exportLoaing: false,
    loadingContent: true,
  }

  componentDidMount() {
    const {
      operation,
      startDate,
      endDate,
      currentPage,
    } = this.state;
    this.handleLogsLoad({
      props: this.props,
      operation,
      startDate,
      endDate,
      currentPage,
    });

    const { stores = [] } = parseParams(this.props);

    if (stores.length > 0) {
      this.setState({
        storeID: stores[0].id,
      })
    }
  }

  shouldComponentUpdate(nextProps) {
    const {
      relationID,
    } = this.props;

    const {
      relationID: nextRelationID,
    } = nextProps;

    if (relationID !== nextRelationID) {
      const operation = null;
      const startDate = moment().subtract(days, 'days');
      const endDate = moment();
      const currentPage = 0;
      this.handleLogsLoad({
        props: nextProps,
        operation,
        startDate,
        endDate,
        currentPage,
      });
      this.setState({
        operation,
        startDate,
        endDate,
        currentPage,
      });
    }

    return true;
  }

  handleLogsLoad = async ({operation, startDate, endDate, currentPage, props}) => {
    const { storeIDs, logType, relationID, relationMenuID } = props;
    const {
      pageSize,
      totalPage,
      logList,
      loadingContent,
    } = this.state;

    if (currentPage > 0 && currentPage >= totalPage) {
      this.setState({
        loadingContent: false,
      })
      return;
    }

    if (!loadingContent) {
      this.setState({
        loading: true,
      });
    }

    const filters = [];

    if (operationSet.has(operation)) {
      filters.push({
        fieldName: 'operation',
        fieldType: 'string',
        condition: 'equal',
        values: [`${operation}`],
      });
    }

    if (startDate && endDate) {
      const sDate = moment(startDate).format(dateFormat);
      const eDate = moment(endDate).format(dateFormat);
      filters.push({
        fieldName: 'created_at',
        fieldType: 'date',
        condition: 'between',
        values: [`${sDate}`, `${eDate}`],
      });
    }

    if (relationID) {
      filters.push({
        fieldName: '$.variables.moduleID',
        fieldType: 'string',
        condition: 'equal',
        values: [`${relationID}`],
      });
    }
    if (relationMenuID) {
      filters.push({
        fieldName: '$.variables.menuID',
        fieldType: 'string',
        condition: 'equal',
        values: [`${relationMenuID}`],
      });
    }

    const search = {
      page: currentPage + 1,
      perPage: pageSize,
      includeTotal: true,
    };

    if (filters.length > 0) {
      search.filters = filters;
    }

    const logResp = await queryLogs({storeIDs, logType, search});

    const { data, pageInfo } = logResp;
    const { totalPages, current } = pageInfo;
    let newLogList;
    if (current < 2) {
      newLogList = data;
    } else {
      newLogList = [
        ...logList,
        ...data,
      ];
    }

    this.setState({
      logList: newLogList,
      loading: false,
      currentPage: current,
      totalPage: totalPages,
      loadingContent: false,
    });
  }

  // 点击导出弹框的按钮
  handleExportLogs = async () => {

    const {
      exportStartDate,
      exportEndDate,
      storeID,
    } = this.state;

    // 父组件传来, 名字 relationID 表示嵌入在什么页面
    const {
      relationID,
      logType,
    } = this.props;

    const filters = [];
    filters.push({
      fieldName: 'created_at',
      fieldType: 'date',
      condition: 'between',
      values: [`${exportStartDate.format(dateFormat)}`, `${exportEndDate.format(dateFormat)}`],
    });

    filters.push({
      fieldName: '$.variables.moduleID',
      fieldType: 'string',
      condition: 'equal',
      values: [`${relationID}`],
    });

    // 需要导出全部的数据, 使用9999
    const search = {
      page: 1,
      perPage: 9999,
      includeTotal: true,
    };

    if (filters.length > 0) {
      search.filters = filters;
    }

    this.setState({
      exportLoaing: true,
    })
    const {url, code, error} = await exportLogs({storeID, logType, search});

    if (url && code === 200) {
      // window.open(url)
      this.setState({
        url,
        exportLoaing: false,
      })
    }else if(code !== 200){
      message.warning(error)
      this.setState({
        showExportModal: false,
        exportLoaing: false,
      })
    }
  }

  handleDateChange = (value) => {
    const [startDate, endDate] = value;
    const { operation } = this.state;
    this.handleLogsLoad({
      props: this.props,
      operation,
      startDate,
      endDate,
      currentPage: 0,
    });

    this.setState({
      startDate,
      endDate,
      logList: [],
      currentPage: 0,
    });
  }

  // 更改选择导出log的时间范围
  handleExportDateChange = value => {
    const [startDate, endDate] = value;
    this.setState({
      exportStartDate: startDate,
      exportEndDate: endDate,
    })
  }

  handleOperationChange = (value) => {
    const { startDate, endDate } = this.state;
    this.handleLogsLoad({
      props: this.props,
      operation: value,
      startDate,
      endDate,
      currentPage: 0,
    });

    this.setState({
      operation: value,
      currentPage: 0,
      logList: [],
    });
  }

  handleLogsMore = () => {
    const { operation, startDate, endDate, currentPage } = this.state;
    this.handleLogsLoad({
      props: this.props,
      operation,
      startDate,
      endDate,
      currentPage,
    });
  }

  showLogInfo = (record) => {
    const { t } = this.props;

    const { displayName } = record.user || {};

    const dataSource = [{
      key: 'User',
      value: displayName,
    }, {
      key: t('common:app.store'),
      value: this.getStoreName(record.storeID),
    }, {
      key: t('common:action'),
      value: record.operation,
    }, {
      key: 'GraphQL',
      value: record.funcName,
    }, {
      key: 'Request',
      value: record.rawQuery,
    }, {
      key: 'Variables',
      value: JSON.stringify(record.variables),
    }, {
      key: 'Response',
      value: JSON.stringify(record.response),
    }, {
      key: t('common:createdAt'),
      value: record.createdAt,
    }];

    Modal.info({
      title: `${t('common:details')}`,
      width: 620,
      centered: true,
      maskClosable: true,
      className: `${prefix}-loginfo`,
      okText: t('common:close'),
      bodyStyle: {
        background: 'red',
      },
      content: (
        <Table
          pagination={false}
          showHeader={false}
          columns={infoLogs}
          dataSource={dataSource}
        />
      ),
      onOk() {},
    });
  }

  getStoreName = (storeID) => {
    const { t, stores = [] } = this.props;

    for (let i = 0; i < stores.length; i++) {
      if (stores[i].id === storeID) {
        return stores[i].title;
      }
    }

    return t('common:official');
  }

  getLogTime = (time) => {
    const commentYear = moment(Date.now()).year();
    const year = moment(time).year();
    const commentDayOfYear = moment(Date.now()).dayOfYear();
    const dayOfYear = moment(time).dayOfYear();
    const commentTime = [];

    if (commentDayOfYear === dayOfYear) { // 同一天
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    } else if (commentYear === year) {
      commentTime.push(
        <div key="month-day">{`${moment(time).format('MM-DD')}`}</div>
      );
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    } else {
      commentTime.push(
        <div key="month-day">{`${moment(time).format('YYYY-MM-DD')}`}</div>
      );
      commentTime.push(
        <div key="hours-minutes">{`${moment(time).format('HH:mm')}`}</div>
      );
    }

    return commentTime;
  }

  showExportModal = () => {
    this.setState({showExportModal: true})
  }

  render() {
    const {
      t,
      logType,
    } = this.props;

    const {
      loading,
      hasMore,
      startDate,
      endDate,
      logList = [],
      showExportModal,
      storeID,
      exportStartDate,
      exportEndDate,
      exportLoaing,
      url,
      loadingContent,
    } = this.state;

    const {
      stores = [],
    } = parseParams(this.props);

    return (
      <div className={prefix}>
        <div className={`${prefix}-list`}>
          <Skeleton
            active={true}
            loading={loadingContent}
            className="bg-galaxy-skeleton"
          >
            <InfiniteScroll
              initialLoad={false}
              pageStart={0}
              loadMore={this.handleLogsMore}
              hasMore={!loading && hasMore}
              useWindow={false}
            >
              <List
                dataSource={logList}
                locale={{ emptyText: t('common:noComment') }}
                renderItem={item => {
                  const { ID, user, createdAt, operation, funcName } = item;
                  const { displayName, avatarURLSmall } = user || {};
                  let avatar = null;

                  if (avatarURLSmall) {
                    avatar = (<Avatar src={avatarURLSmall} />);
                  } else {
                    avatar = (<Avatar icon="user" />);
                  }

                  return (
                    <List.Item key={ID} onClick={()=>this.showLogInfo(item)}>
                      <List.Item.Meta
                        avatar={avatar}
                        title={
                          <span className={`${prefix}-title`}>
                            <span className={`${prefix}-username`}>{displayName}</span>
                            <span className={`${prefix}-actionname`}>{operation}</span>
                          </span>
                        }
                        description={funcName}
                      />
                      {this.getLogTime(createdAt)}
                    </List.Item>
                  );
                }}
              />
            </InfiniteScroll>
          </Skeleton>
          {
            loading && hasMore && (
              <div className={`${prefix}-loading`}>
                <Spin />
              </div>
            )
          }
        </div>
        <div className={`${prefix}-log`}>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            className={`${prefix}-log-action`}
            onChange={this.handleOperationChange}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="create">Create</Select.Option>
            <Select.Option value="update">Update</Select.Option>
            <Select.Option value="delete">Delete</Select.Option>
          </Select>
          <DatePicker.RangePicker
            defaultValue={[startDate, endDate]}
            format={dateFormat}
            className={`${prefix}-log-time`}
            onChange={this.handleDateChange}
          />
          <Button
            className={`${prefix}-log-exportButton`}
            onClick={this.showExportModal}
          >
          {t('common:editor.export')}
          </Button>
          {
            showExportModal &&
            <Modal
              visible={true}
              destroyOnClose={true}
              title={t('common:editor.export')}
              okText={t('common:editor.export')}
              cancelText={t('common:cancel')}
              onOk={this.handleExportLogs}
              onCancel={() => this.setState({
                showExportModal: false,
              })}
              width={400}
              confirmLoading={exportLoaing}
            >
              <p>{t('common:app.selectStore')}</p>
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={filterOption}
                value={storeID}
                onChange={
                  value => {
                    this.setState({
                      storeID: value,
                    });
                  }
                }
                style={{width: 330}}
              >
                {
                  stores.map(store => (
                    <Select.Option
                      key={store.id}
                      value={store.id}
                    >
                      {store.title}
                    </Select.Option>
                  ))
                }
              </Select>
              <p style={{marginTop: 20}}>Time Range</p>
              <DatePicker.RangePicker
                placeholder={['Start Time', 'End Time']}
                defaultValue={[exportStartDate, exportEndDate]}
                format={dateFormat}
                className={`${prefix}-log-time`}
                onChange={this.handleExportDateChange}
              />
              {
                url &&
                // eslint-disable-next-line jsx-a11y/anchor-has-content
                <Button style={{marginTop: 30}} icon="download">
                  <a href={url} download={`${logType}.csv`} target="_blank" rel="noopener noreferrer">Download</a>
                </Button>
              }
            </Modal>
          }
        </div>
      </div>
    );
  }
}

export default Logs;
