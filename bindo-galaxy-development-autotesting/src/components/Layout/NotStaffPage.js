import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { Button } from 'antd'
import common from '../../constants/common'
import {
  createRouteUrl,
} from '../../utils/galaxy'

@translate()
class NotStaffPage extends Component {
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
      prefix,
    } = this.props;

    return (
      <div className={`${prefix}-notstaff-page`}>
        <div className={`${prefix}-notstaff-page-content`}>
          {t('common:accessIsRestricted')}
        </div>
        <Button
          type="primary"
          className={`${prefix}-notstaff-page-btn`}
          onClick={this.enterDashboard}
        >
          {t('common:enterDashboard')}
        </Button>
      </div>
    )
  }
}

export default NotStaffPage;
