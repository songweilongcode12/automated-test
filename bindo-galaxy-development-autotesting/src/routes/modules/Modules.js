import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import {
  Skeleton,
} from 'antd'
import ModulesContent from './ModulesContent'
import RightSide from './RightSide'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import common from '../../constants/common'
import {
  parseParams,
  gotoDashboard,
} from '../../utils/galaxy'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy, module }) => ({ ...galaxy, ...module }))
class Modules extends Component {
  getBreadcrumbData = () => {
    const { t } = this.props;

    return [{
      id: 'modules',
      type: 'label',
      name: t('common:moduleDirectory'),
    }];
  }

  render() {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      gotoDashboard(this.props);
    }

    return (
      <Layout {...this.props}>
        <Layout.Content className="column">
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
            />
          </div>
          <Skeleton
            active={true}
            loading={storesMap.size < 1 || !permissionsAndModulesDone}
            className="bg-galaxy-skeleton"
          >
            <ModulesContent
              {...this.props}
            />
          </Skeleton>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Overview</span>
          </div>
        </Layout.Content>
        <Layout.RightSide>
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <RightSide {...this.props} />
          </Skeleton>
        </Layout.RightSide>
      </Layout>
    );
  }
}

export default Modules
