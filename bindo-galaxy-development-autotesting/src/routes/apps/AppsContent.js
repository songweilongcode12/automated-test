import React, { Component } from 'react';
import moment from 'moment';
import { Icon as AntdIcon, Button, Dropdown, Modal, Menu } from 'antd';
import {
  parseParams,
  createRouteUrl,
  getI18nValue,
} from '../../utils/galaxy';
import common from '../../constants/common'
import {
  findNode,
  findBrotherNodes,
} from '../../utils';
import TableTree from '../../components/TableTree';
import Icon from '../../components/Icon';
import routes from '../../constants/routes';
import galaxyConstant from '../../constants/galaxyConstant';

const galaxyPrefix = 'bg-galaxy';

class AppsContent extends Component {
  state = {
    hoverRow: '',
    actionVisible: false,
  }

  isMovable = (dragRecord, hoverRecord) => {
    const {
      sortingApps,
    } = this.props;

    const node = findNode(sortingApps, 'key', dragRecord.key) || {};
    const { children = [] } = node;
    const hoverNode = findNode(children, 'key', hoverRecord.key);

    return !hoverNode;
  }

  reSortApp = (apps) => {
    const enterprises = [];
    const others = [];
    const admins = [];
    const unpublished = [];
    apps.forEach(app => {
      const {
        type = '',
        publicStatus = '',
      } = app;
      if(type === common.ENTERPRISE){
        enterprises.push(app);
      } else if(type === common.SYSTEM) {
        admins.push(app);
      } else if(type === common.DEFAULT && publicStatus === common.UNPUBLISHED) {
        unpublished.push(app);
      } else {
        others.push(app);
      }
    });
    const appsList = enterprises.concat(others, admins, unpublished)
    appsList.forEach((app, index) => {
      app.position = index + 1;
    })
    return appsList;
  }

  handleMove = (data) => {
    const {
      sortingApps,
      onResetState,
    } = this.props;
    const {
      dragIndex,
      hoverIndex,
      dragRecord,
    } = data;

    const nodes = findBrotherNodes(sortingApps, 'key', dragRecord.key);
    let node = nodes.splice(dragIndex, 1);
    if (node && node.length > 0) {
      [node] = node;
    }

    nodes.splice(hoverIndex, 0, {
      ...node,
    });

    onResetState({
      sortingApps: this.reSortApp([...sortingApps]),
    })
  }

  handleRowClick = (record) => {
    const {
      history,
      storesIDRefSlug,
    } = this.props;

    const {
      inStoreID,
    } = record;

    history.push({
      pathname: createRouteUrl(
        routes.MENUS,
        {
          appID: record.id,
          slug: storesIDRefSlug.get(inStoreID),
          appName: record.name,
        },
        this.props
      ),
    });
  }

  getActionMoreIcon = (id) => {
    const { hoverRow, actionVisible } = this.state;
    if (id === hoverRow && actionVisible) {
      return <AntdIcon type='up' />
    } else {
      return <AntdIcon type='down' />
    }
  }

  // action下拉状态改变函数
  handleVisibleChange = (flag) => {
    this.setState({
      actionVisible: flag,
    })
  }

  handleMouse = (record, action) => {
    if (action === 'enter') {
      this.setState({
        hoverRow: record.id,
      })
    } else if (action === 'leave') {
      this.setState({
        hoverRow: '',
      })
    }
  }

  handleEdit = (evt, record) => {
    evt.stopPropagation();

    const {
      onResetState,
    } = this.props;

    onResetState({
      appData: record,
      editAppStoreID: record.inStoreID,
      showAppModal: true,
    });
  }

  handleDelete = (evt, record) => {
    evt.stopPropagation();

    const { t, dispatch } = this.props;

    const storeID = record.inStoreID;

    const appID = record.id;

    Modal.confirm({
      title: t('common:app.deletePrompt'),
      content: record.name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: () => {
        dispatch({type: 'DELETE_APP', payload: {
          storeID,
          appID,
        }});
      },
    });
  }

  getDropdownList = (record) => {
    const {
      t,
      loginUser,
      modeType = galaxyConstant.NORMAL,
    } = this.props;
    const sorting = modeType === galaxyConstant.SORTING;
    const {
      is_staff: isStaff,
    } = loginUser || {};
    const isSelfApp = record.inStoreID === record.storeID;
    const editable = isSelfApp && isStaff;

    return(
      <Menu>
        <Menu.Item>
          <Button
            key="view"
            size="small"
            disabled={sorting}
            style={{border: 0, width: '100%', textAlign: 'left'}}
            onClick={() => this.handleRowClick(record)}
          >
            <Icon type="icon-view" />
            {t('common:view')}
          </Button>
        </Menu.Item>
        {
          editable &&
          <Menu.Item>
            <Button
              key="edit"
              size="small"
              disabled={sorting}
              style={{border: 0, width: '100%', textAlign: 'left'}}
              onClick={evt => this.handleEdit(evt, record)}
            >
              <Icon type="icon-edit" />
              {t('common:edit')}
            </Button>
          </Menu.Item>
        }
        {
          editable &&
          <Menu.Item>
            <Button
              key="delete"
              size="small"
              disabled={sorting}
              style={{border: 0, width: '100%', textAlign: 'left'}}
              onClick={(evt) => this.handleDelete(evt, record)}
            >
              <Icon type="icon-delete" />
              {t('common:delete')}
            </Button>
          </Menu.Item>
        }
      </Menu>
    )
  }

  getColumns = () => {
    const {
      t,
      storesMap,
      storesIDRefSlug,
    } = this.props;
    const {
      galaxyState,
    } = parseParams(this.props);

    const columns = [{
      title: t('common:icon'),
      dataIndex: 'icon',
      key: 'icon',
      render: (text, record) => {
        if (record.iconType === galaxyConstant.ICON_ANTD) {
          return (
            <AntdIcon
              type={text}
              style={{fontSize: '22px'}}
            />
          );
        } else if (record.iconType === galaxyConstant.ICON_BINDO) {
          return (
            <Icon
              style={{fontSize: '22px'}}
              type={text}
            />
          );
        }

        return text;
      },
    }, {
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const { lng } = this.props;

        return getI18nValue('name', lng, record);
      },
    },
    {
      title: t('common:type'),
      dataIndex: 'type',
      key: 'type',
      render: (text, record) => {
        const { lng } = this.props;

        return getI18nValue('type', lng, record);
      },
    },
    {
      title: t('common:app.store'),
      dataIndex: 'inStoreID',
      key: 'inStoreID',
      render: (text) => {
        let title = '--';
        const slug = storesIDRefSlug.get(text);

        if (slug) {
          ({ title = '--' } = storesMap.get(slug) || {});
        }

        return title;
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

    if (galaxyState === galaxyConstant.BUILDER) {
      columns.push({
        title: t('common:action'),
        key: 'action',
        align: 'center',
        fixed: 'right',
        width: 120,
        render: (text, record) => (
            <span>
              <Dropdown
                overlay={this.getDropdownList(record)}
                onVisibleChange={this.handleVisibleChange}
              >
                <div className={`${galaxyPrefix}-dropdown-action`}>
                  More
                  {this.getActionMoreIcon(record.id)}
                </div>
              </Dropdown>
            </span>
        ),
      });
    }

    return columns;
  }

  render() {
    const {
      getDataSource,
      modeType,
    } = this.props;

    return (
      <div className={`${galaxyPrefix}-content`}>
        {
          (
            modeType === galaxyConstant.NORMAL ||
            modeType === galaxyConstant.SORTING
          ) &&
          <TableTree
            draggable={modeType === galaxyConstant.SORTING}
            pagination={false}
            isMovable={this.isMovable}
            onMove={this.handleMove}
            columns={this.getColumns()}
            dataSource={getDataSource()}
            onRow={(record) => ({
              onMouseEnter: () => this.handleMouse(record, 'enter'),
              onMouseLeave: () => this.handleMouse(record, 'leave'),
            })}
            scroll={{ x: 'max-content' }}
          />
        }
      </div>
    );
  }
}

export default AppsContent;
