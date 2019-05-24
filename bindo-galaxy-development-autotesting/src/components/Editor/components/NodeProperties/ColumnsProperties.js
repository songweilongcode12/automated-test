import React, { Component } from 'react'
import { Modal, Checkbox, Button, Icon as AntdIcon } from 'antd'
import { createUuid } from '../../../../utils'
import widgets from '../../../../constants/widgets'
import reduxKey from '../../../../constants/reduxKey'
import hocProperties from './hocProperties'
import ActionInput from '../ActionInput'

@hocProperties()
class ColumnsProperties extends Component {
  handleTitleChange = (key, value, uuid) => {
    const { dispatch } = this.props

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid,
            data: { [key]: value },
          },
        ],
      },
    })
  }

  handleDelete = uuid => {
    const {
      dispatch,
      view: { children = [] },
    } = this.props
    if (!children || children.length <= 1) {
      return
    }

    const editViews = [{
      operate: 'remove',
      uuid,
    }];

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews,
      },
    })
  }

  handleColumnDelete = (uuid, title) => {
    const { t } = this.props
    Modal.confirm({
      title: t('common:editor.deleteOption'),
      content: title,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: () => {
        this.handleDelete(uuid)
      },
    })
  }

  handleAdd = columnData => {
    const { view, dispatch } = this.props

    if (!view.children || view.children.length >= 12) {
      return
    }

    view.children.push(columnData)

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid: view.uuid,
            data: {
              children: view.children,
            },
          },
        ],
      },
    })
  }

  handleColumnAdd = () => {
    const { view, dispatch } = this.props;
    const { children = [] } = view;

    if (!children || children.length >= 6) {
      return
    }

    const newUuid = createUuid();

    children.push({
      uuid: newUuid,
      parentUuid: view.uuid,
      viewType: widgets.COLUMNS_ITEM,
      title: 'New Column',
      children: [],
    });

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid: view.uuid,
            data: {
              children,
            },
          },
        ],
      },
    });
  }

  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      children = [],
      invisible = false,
    } = view;

    return (
      <div className="bindo-galaxy-editor-rightside-tabpanel">
        <div className={`${prefix} flex`}>
          <Checkbox
            checked={invisible}
            onChange={evt => onViewPropsChange('invisible', evt.target.checked)}
          >
            {t('common:editor.invisible')}
          </Checkbox>
          <div className={`${prefix}-space`} />
          <div className={`${prefix}-btn-link`}>
            {t('common:editor.conditional')}
          </div>
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.options')}
          </div>
          {
            children.map(item => (
              <div key={item.uuid} style={{ display: 'flex', margin: '5px 0' }}>
                <ActionInput
                  value={item.title}
                  onOkClick={value => this.handleTitleChange('title', value, item.uuid)}
                  style={{flex: 1}}
                />
                <Button
                  style={{ padding: '0 8px' }}
                  onClick={() => this.handleColumnDelete(item.uuid, item.title)}
                >
                  <AntdIcon
                    type="delete"
                    theme="twoTone"
                    twoToneColor="#eb2f96"
                  />
                </Button>
              </div>
            ))
          }
          <Button
            key="btn"
            type="dashed"
            block
            icon="plus"
            onClick={this.handleColumnAdd}
          />
        </div>
      </div>
    );
  }
}

export default ColumnsProperties;
