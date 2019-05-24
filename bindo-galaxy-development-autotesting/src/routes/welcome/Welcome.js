import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import common from '../../constants/common';
import reduxKey from '../../constants/reduxKey';
import routes from '../../constants/routes';
import { parseParams, createRouteUrl } from '../../utils/galaxy';
import { findApp } from '../../utils/app';
// import './Directory.less';
// import welcome from '.';

const galaxyPrefix = 'bg-galaxy';

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
class welcome extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  }

  getBreadcrumbData = app => {
    const { t } = this.props;
    const breadcrumbData = [];

    if (app) {
      breadcrumbData.push({
        id: app.id,
        type: 'label',
        name: app.name,
      });
    }

    breadcrumbData.push({
      id: 'welcome',
      type: 'label',
      name: t('common:welcome'),
    });

    return breadcrumbData;
  }

  render() {
    const { t } = this.props;
    const { galaxyState, appID, slug, storeID } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      if (appID) {
        const params = { appID, slug };
        return <Redirect to={createRouteUrl(routes.MENUS, params, this.props)} />
      } else {
        return <Redirect to={createRouteUrl(routes.DIRECTORY, {}, this.props)} />
      }
    }

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    let welcomeInfo = t('common:welcomeToDashboard');

    if (app) {
      welcomeInfo = `${t('common:welcomeTo')} ${app.name}`;
    }

    return (
      <Layout {...this.props}>
        <Layout.Content className="column">
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              data={this.getBreadcrumbData(app)}
            />
          </div>
          <div className={`${galaxyPrefix}-welcome`}>
            {welcomeInfo}
          </div>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Overview</span>
          </div>
        </Layout.Content>
      </Layout>
    );
  }
}

export default welcome;
