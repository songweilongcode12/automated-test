import React, { Component } from 'react'
import moment from 'moment'
import { Table, Button, Menu, Tree, Modal, Dropdown, Icon as AntdIcon } from 'antd'
import {
  parseParams,
} from '../../utils/galaxy'
import {
  findApp,
} from '../../utils/app'
import Icon from '../../components/Icon'
import common from '../../constants/common'
import galaxyConstant from '../../constants/galaxyConstant'
import reduxKey from '../../constants/reduxKey'

const galaxyPrefix = 'bg-galaxy';

const embeddedTypes = {
  [common.URL]: 'Url',
  [common.TABLEAU]: 'Tableau',
  [common.METABASE]: 'Metabase',
};

const infoColumns = [{
  title: 'Key',
  dataIndex: 'key',
  key: 'key',
  width: 150,
  align: 'right',
  render: text => `${text}: `,
}, {
  title: 'Value',
  dataIndex: 'value',
  key: 'value',
  className: `${galaxyPrefix}-menu-row-info`,
}];

class AppsContent extends Component {
  state = {
    actionVisible: false,
    hoverRow: '',
  }

  getMenuTypeName = (type) => {
    const { t } = this.props;
    let typeName = '';
    switch(type) {
      case common.MODULE:
        typeName = t('common:menu.module');
        break;
      case common.SUBMENU:
        typeName = t('common:menu.menuFolder');
        break;
      case common.EMBEDDED:
        typeName = t('common:menu.embedded');
        break;
      case common.SETTING:
        typeName = t('common:menu.settings');
        break;
      case common.WIKI_ONLY:
        typeName = t('common:menu.wikiOnly');
        break;
      default:
        break;
    }
    return typeName;
  }

  getColumns = () => {
    const { t } = this.props;
    const { galaxyState } = parseParams(this.props);

    const columns = [{
      title: t('common:name'),
      dataIndex: 'name',
      key: 'name',
    }, {
      title: t('common:type'),
      dataIndex: 'type',
      key: 'type',
      render: (text) => this.getMenuTypeName(text),
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
        width: 180,
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

  getActionMoreIcon = (id) => {
    const { hoverRow, actionVisible } = this.state;
    if (id === hoverRow && actionVisible) {
      return <AntdIcon type='up' />
    } else {
      return <AntdIcon type='down' />
    }
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

  // action下拉状态改变函数
  handleVisibleChange = (flag) => {
    this.setState({
      actionVisible: flag,
    })
  }

  getDropdownList = (record) => {
    const {
      t,
      modeType = galaxyConstant.NORMAL,
    } = this.props;
    const sorting = modeType === galaxyConstant.SORTING;

    return(
      <Menu>
        <Menu.Item>
          <Button
            key="view"
            size="small"
            style={{border: 0, width: '100%', textAlign: 'left'}}
            onClick={evt => this.handleView(evt, record)}
          >
            <Icon type="icon-view" />
            {t('common:view')}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            key="edit"
            size="small"
            style={{border: 0, width: '100%', textAlign: 'left'}}
            disabled={sorting}
            onClick={evt => this.handleEdit(evt, record)}
          >
            <Icon type="icon-edit" />
            {t('common:edit')}
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Button
            key="delete"
            size="small"
            style={{border: 0, width: '100%', textAlign: 'left'}}
            disabled={sorting}
            onClick={(evt) => this.handleDelete(evt, record)}
          >
            <Icon type="icon-delete" />
            {t('common:delete')}
          </Button>
        </Menu.Item>
      </Menu>
    )
  }

  handleView = (evt, record) => {
    evt.stopPropagation();

    const dataSource = [];
    const {
      t,
      storesMap,
      storesIDRefSlug,
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
    const node = storesMap.get(storesIDRefSlug.get(storeID));
    const {
      name: appName = '',
    } = app || {};

    let storeTitle = ''
    if (node && node.title) {
      storeTitle = node.title;
    }

    dataSource.push({
      key: t('common:name'),
      value: record.name,
    });

    dataSource.push({
      key: t('common:type'),
      value: this.getMenuTypeName(record.type),
    });

    dataSource.push({
      key: t('common:menu.store'),
      value: storeTitle,
    });

    dataSource.push({
      key: t('common:app.name'),
      value: appName,
    });

    const { embeddedConfig } = record;

    if (embeddedConfig) {
      dataSource.push({
        key: t('common:menu.embeddedType'),
        value: embeddedTypes[embeddedConfig.embeddedType],
      });

      dataSource.push({
        key: t('common:menu.embeddedValue'),
        value: embeddedConfig.embeddedValue.Data,
      });
    }

    Modal.info({
      title: `${record.name} - ${t('common:details')}`,
      width: 520,
      centered: true,
      maskClosable: true,
      className: `${galaxyPrefix}-menuinfo`,
      okText: t('common:close'),
      content: (
        <Table
          pagination={false}
          showHeader={false}
          columns={infoColumns}
          dataSource={dataSource}
        />
      ),
      onOk() {},
    });
  }

  handleDelete = (evt, record) => {
    evt.stopPropagation();

    const {
      t,
      dispatch,
    } = this.props;

    Modal.confirm({
      title: t('common:menu.deletePrompt'),
      content: record.name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk() {
        dispatch({
          type: reduxKey.DELETE_MENU,
          payload: {
            storeID: record.inStoreID,
            appID: record.appID,
            menuID: record.id,
          },
        });
      },
    });
  }

  handleEdit = (evt, record) => {
    evt.stopPropagation();

    const {
      onResetState,
    } = this.props;

    const {
      parentID = '0',
    } = record;

    onResetState({
      menuData: record,
      parentID,
      showMenuModal: true,
    });
  }

  handleDrop = (info) => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        // eslint-disable-next-line eqeqeq
        if (item.key == key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };

    const {
      getDataSource,
      onResetState,
    } = this.props;
    const sortingMenus = getDataSource();
    const data = [...sortingMenus];

    let isSort = false;

    if (!info.dropToGap) {
      loop(data, dropKey, (item) => {
        isSort = item.type !== 'subMenu';
      });
    }

    if (isSort) {
      return;
    }

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        dragObj.realParentID = item.id;
        item.children.push(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 // Has children
      && info.node.props.expanded // Is expanded
      && dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        dragObj.realParentID = item.id;
        item.children.unshift(dragObj);
      });
    } else {
      let ar;
      let i;
      let itemNode;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
        itemNode = item;
      });
      if (ar) {
        dragObj.realParentID = itemNode.realParentID;
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
    }

    onResetState({
      sortingMenus: data,
    });
  }

  getTreeNodes = data => data.map(item => {
    if (item.children && item.children.length) {
      return (
        <Tree.TreeNode key={item.key} title={item.name}>
          {this.getTreeNodes(item.children)}
        </Tree.TreeNode>
      );
    }
    return <Tree.TreeNode key={item.key} title={item.name} />;
  })

  render() {
    const {
      modeType,
      getDataSource,
    } = this.props;

    return (
      <div className={`${galaxyPrefix}-content`}>
        {
          modeType === galaxyConstant.NORMAL &&
          <Table
            bordered
            pagination={false}
            columns={this.getColumns()}
            dataSource={getDataSource()}
            scroll={{ x: 'max-content' }}
            onRow={(record) => ({
              onMouseEnter: () => this.handleMouse(record, 'enter'),
              onMouseLeave: () => this.handleMouse(record, 'leave'),
            })}
          />
        }
        {
          modeType === galaxyConstant.SORTING &&
          <Tree
            showLine
            draggable
            defaultExpandAll
            onDrop={this.handleDrop}
          >
            { this.getTreeNodes(getDataSource()) }
          </Tree>
        }
      </div>
    );
  }
}

export default AppsContent;
