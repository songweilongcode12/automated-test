import React, { Component } from 'react'
import { translate } from 'react-i18next'
import common from '../../constants/common'
import {
  createRouteUrl,
} from '../../utils/galaxy'
import './NotPermissionsView.less'

const prefix = 'bg-c-not-permissions';

@translate()
class NotPermissionsView extends Component {
  enterDashboard = () => {
    const {
      match: {
        path = '',
      } = {},
      history,
    } = this.props;

    history.push({
      pathname: createRouteUrl(
        path,
        {
          galaxyState: common.DASHBOARD,
        },
        this.props,
      ),
    });
  }

  render() {
    const {
      t,
    } = this.props;

    return (
      <div className={`${prefix}-notstaff-page`}>
        <div className={`${prefix}-notstaff-page-content`}>
          {t('common:youNotAuthorized')}
        </div>
      </div>
    )
  }
}

export default NotPermissionsView;
