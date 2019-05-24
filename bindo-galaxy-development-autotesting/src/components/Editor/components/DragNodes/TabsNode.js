import React, { Component } from 'react'
import { Tabs, Tooltip, Icon as AntdIcon, Modal } from 'antd'
import { createUuid } from '../../../../utils'
import hocNode from './hocNode'
import Sortable from '../../Sortable'
import widgets from '../../../../constants/widgets'
import reduxKey from '../../../../constants/reduxKey'

const prefix = 'bindo-galaxy-editor-formview-tabsmodel';
const name = 'formview-tabs-view';
const options = {
  group: {
    name,
    put: [
      'formview-layout-widgets',
      'formview-base-widgets',
      'formview-relation-widgets',
      // 'formview-container',
      // 'formview-tabs-view',
    ],
  },
};

@hocNode()
class TabsNode extends Component {
  handleChange = activeKey => {
    const { dispatch, view } = this.props

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid: view.uuid,
            data: { activeKey },
          },
        ],
      },
    })
  }

  handleEdit = (targetKey, action) => {
    this[action](targetKey)
  }

  add = () => {
    const { dispatch, view } = this.props
    const newUuid = createUuid()

    view.children.push({
      uuid: newUuid,
      parentUuid: view.uuid,
      viewType: widgets.TABS_ITEM,
      title: 'New Tab',
      children: [],
    })

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid: view.uuid,
            data: {
              activeKey: newUuid,
              children: view.children,
            },
          },
        ],
      },
    })
  }

  remove = targetKey => {
    const {
      t,
      dispatch,
      view: { uuid: modelUuid, activeKey, children },
    } = this.props

    const editViews = []

    if (targetKey === activeKey) {
      let lastIndex
      children.forEach((pane, i) => {
        if (pane.uuid === targetKey) {
          lastIndex = i - 1
        }
      })

      if (lastIndex < 0) {
        lastIndex = 1
      }

      editViews.push({
        operate: 'update',
        uuid: modelUuid,
        data: {
          activeKey: children[lastIndex].uuid,
        },
      })
    }

    editViews.push({
      operate: 'remove',
      uuid: targetKey,
    })

    Modal.confirm({
      title: t('common:editor.deleteTab'),
      content: '',
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk() {
        dispatch({
          type: reduxKey.UPDATE_MODULE_ENTITY,
          payload: {
            editViews,
          },
        });
      },
    });
  }

  createTabPane = (item, count) => {
    const { prefix: pfx, sortableDisabled = false, fields = [] } = this.props;
    const { title, uuid, helpTooltip, children = [] } = item;

    const labelView = [<span key="label">{title}</span>];
    if (helpTooltip && helpTooltip.length > 0) {
      labelView.push(
        <Tooltip title={helpTooltip} key="tooltip">
          <AntdIcon
            type="info-circle"
            className={`${pfx}-help-tooltip`}
          />
        </Tooltip>
      );
    }

    return (
      <Tabs.TabPane tab={labelView} key={uuid} closable={count > 1}>
        <Sortable
          data={children}
          uuid={uuid}
          type={name}
          options={options}
          fields={fields}
          sortableDisabled={sortableDisabled}
          className={`${prefix}-pane`}
        />
      </Tabs.TabPane>
    )
  }

  render() {
    const {
      view,
      sortableDisabled = false,
    } = this.props;
    const {
      activeKey,
      children = [],
    } = view || {};

    const nodeProps = {
      type: 'editable-card',
      className: prefix,
      activeKey,
      onChange: this.handleChange,
    };

    if (!sortableDisabled) {
      nodeProps.onEdit = this.handleEdit;
    }

    return (
      <Tabs {...nodeProps}>
        {children.map(item => this.createTabPane(item, children.length))}
      </Tabs>
    );
  }
}

export default TabsNode;
