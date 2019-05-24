import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Skeleton } from 'antd'
import ModelFieldsContent from './ModelFieldsContent'
import RightSide from './RightSide'
import routes from '../../constants/routes'
import common from '../../constants/common'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import {
  parseParams,
  createRouteUrl,
  gotoDashboard,
} from '../../utils/galaxy'
import {
  findModuleByID,
} from '../../utils/module'

const galaxyPrefix = 'bg-galaxy';
@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class ModelFields extends Component {
  getBreadcrumbData = () => {
    const { t } = this.props;

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    const module = findModuleByID({
      props: this.props,
      storeID,
      moduleID,
    }) || {}

    const { name, tableInfo } = module || {};
    const { tableName } = tableInfo || {};

    return [{
      id: 'models',
      type: 'link',
      url: createRouteUrl(routes.MODELS, {}, this.props),
      name: t('common:modelDirectory'),
    }, {
      id: 'model_attributes',
      type: 'label',
      name: tableName || name,
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
            <ModelFieldsContent
              {...this.props}
            />
          </Skeleton>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Model Attributes</span>
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

export default ModelFields
