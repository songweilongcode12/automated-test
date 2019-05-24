import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Modal, Button } from 'antd';
import Icon from '../Icon';
import widgets from '../../constants/widgets';
import reduxKey from '../../constants/reduxKey';

const prefix = 'g-c-drag-node';

@translate()
@connect(({
  module,
}) => ({
  ...module,
}))
class DragSorting extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
  };

  handleCloseClick = (evt) => {
    evt.stopPropagation();

    const { uuid, t } = this.props;
    // if (uuid === 'name') {
    //   return;
    // }

    const { dispatch } = this.props;

    Modal.confirm({
      title: t('common:module.deleteView'),
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
              uuid,
            }],
          },
        });
      },
    });
  }

  render() {
    const { t, uuid, className, children, field, view } = this.props;

    let title = '';
    if (field) {
      if (field.title) {
        ({title} = field);
      } else if (field.label && field.fieldName) {
        title = `${field.label} - ${field.fieldName}`;
      } else if (field.label) {
        title = field.label;
      } else if (field.fieldName) {
        title = field.fieldName;
      }
    }

    const { title: titleType, viewType } = view || {};
    if (titleType) {
      let tText = t(`common:module.${titleType}`);
      if (viewType === widgets.LABEL) {
        tText = t(`common:${titleType}`);
      }
      title = `[${tText}] - ${title}`;
    } else {
      title = `[${viewType}] - ${title}`;
    }

    const {
      marginTop,
      marginLeft = 0,
      marginRight = 0,
      marginBottom = 0,
    } = view || {};

    const rootStyle = {};
    if (marginTop) {
      rootStyle.marginTop = marginTop + 5;
    }
    if (marginBottom) {
      rootStyle.marginBottom = marginBottom + 5;
    }
    if (marginLeft) {
      rootStyle.marginLeft = marginLeft + 5;
    }
    if (marginRight) {
      rootStyle.marginRight = marginRight + 5;
    }

    return (
      <div data-uuid={uuid} className={`${prefix} ${className}`} style={rootStyle}>
        <div className={`${prefix}-bar`}>
          <Icon type="icon-drag" className={`${prefix}-bar-btn drag`} />
          <span className={`${prefix}-bar-title`}>{title}</span>
          <Button>
            <Icon type="icon-forward" className={`${prefix}-bar-btn space`} />
          </Button>
          <Button>
            <Icon type="icon-backward" className={`${prefix}-bar-btn space`} />
          </Button>
          <Button>
            <Icon type="icon-top" className={`${prefix}-bar-btn space`} />
          </Button>
          <Button>
            <Icon type="icon-bottom" className={`${prefix}-bar-btn space`} />
          </Button>
          <Button onClick={this.handleCloseClick}>
            <Icon
              style={{cursor: uuid === 'name' ? 'not-allowed' : 'pointer'}}
              type="icon-delete1"
              className={`${prefix}-bar-btn close`}
            />
          </Button>
        </div>
        { children }
      </div>
    );
  }
}

export default DragSorting;
