import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import { Modal, Icon as AntdIcon, Tooltip } from 'antd'
import Icon from '../../../Icon'
import StarLabel from '../StarLabel'
import widgets from '../../../../constants/widgets'
import common from '../../../../constants/common'
import reduxKey from '../../../../constants/reduxKey'
import './DragNode.less'

const prefix = 'bg-c-drag-node';
const noLabelWidgets = new Set([
  widgets.LABEL,
  widgets.DIVIDER,
  widgets.BOOLEAN,
]);

export default () => (WrappedComponent) => {
  @connect(({ module }) => ({ ...module }))
  @translate()
  class BaseNode extends Component {

    handleClose = () => {
      const {
        t,
        dispatch,
        view = {},
        field = {},
      } = this.props;

      const {
        fromParentModule = false,
      } = field;

      // 如果是从父moduel继承来的, 则不可编辑, 不能删除
      if(fromParentModule) return

      let modalInfo = t('common:editor.deleteComponent');
      if (view.viewType === widgets.TABS) {
        modalInfo = t('common:editor.deleteTabs');
      } else if (view.viewType === widgets.COLUMNS) {
        modalInfo = t('common:editor.deleteColumns');
      }

      Modal.confirm({
        title: modalInfo,
        content: '',
        okText: t('common:yes'),
        okType: 'danger',
        cancelText: t('common:no'),
        onOk() {
          dispatch({
            type: reduxKey.UPDATE_MODULE_ENTITY,
            payload: {
              editViews: [{
                operate: 'remove',
                uuid: view.uuid,
              }],
            },
          });
        },
      });
    }

    getInvisible = () => {
      const {
        field = {},
        view = {},
      } = this.props;

      const {
        invisible: invisibleFromField = false,
      } = field;
      let {
        listens = [],
      } = field;
      if (listens === null){
        listens = [];
      }

      const listenList = listens || [];

      const {
        invisible: invisibleFromView = false,
      } = view;

      let formula = '';
      for (let i = 0; i < listenList.length; i++) {
        const listen = listenList[i];
        if (listen && listen.type === common.INVISIBLE) {
          ({ formula = '' } = listen);
        }
      }

      let hasFormula = false;
      if (lodash.isString(formula) && formula.length > 0) {
        hasFormula = true;
      }

      return (invisibleFromField || invisibleFromView) && !hasFormula;
    }

    handleFieldsDisable = () =>{
      const {
        field = {},
      } = this.props;

      const {
        fromParentModule = false,
      } = field;

      // 如果是从父moduel继承来的,则不可编辑
      return fromParentModule;
    }

    getParentModuleClass = () => {
      if ( this.handleFieldsDisable()) {
        return 'bg-c-drag-module-parent-node'
      }
    }

    getViewTypeText = () => {
      const {
        t,
        view = {},
      } = this.props;

      const {
        viewType,
        title,
      } = view;

      let text = viewType;
      if (title) {
        text = t(`common:editor.${title}`);
      }

      if (text && text.length > 0) {
        text = ` - ${text}`;
      }

      return text;
    }

    render() {
      const {
        className,
        field = {},
        view = {},
        sortableDisabled = false,
      } = this.props;

      const {
        label,
        required = false,
      } = field;

      const {
        uuid,
        helpTooltip = '',
        hiddenLabel = false,
        viewType,
        label: viewLabel,
      } = view;

      let labelView;
      const invisible = this.getInvisible();
      let showLabel = !noLabelWidgets.has(viewType);

      if (viewType === widgets.BOOLEAN && invisible) {
        showLabel = true;
      }
      if (showLabel || (!showLabel && invisible)) {
        labelView = [<span key="label">{`${label || viewLabel || viewType}${this.getViewTypeText()}`}</span>];
        if (helpTooltip && helpTooltip.length > 0) {
          labelView.push(
            <Tooltip title={helpTooltip} key="tooltip">
              <AntdIcon
                type="info-circle"
                className={`${prefix}-help-tooltip`}
              />
            </Tooltip>
          );
        }
      }

      const moduleParentClass = this.handleFieldsDisable() ? this.getParentModuleClass() : '';
      return (
        <div
          data-uuid={uuid}
          style={{ maring: 5 }}
          className={`${prefix} ${className} ${moduleParentClass}`}
        >
          <div className={`${prefix}-bar`}>
            {
              showLabel && !hiddenLabel && !required &&
              <div>{labelView}</div>
            }
            {
              showLabel && !hiddenLabel && required &&
              <StarLabel label={labelView} />
            }
            <div className={`${prefix}-bar-space`} />
            {
              !sortableDisabled &&
              <div className={`${prefix}-bar-btn`}>
                <Icon
                  type="icon-delete1"
                  onClick={this.handleClose}
                />
              </div>
            }
          </div>
          {
            !invisible &&
            <WrappedComponent {...this.props} prefix={prefix} />
          }
        </div>
      );
    }
  }

  return BaseNode;
}
