import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  Skeleton,
} from 'antd';
import LiquidViewContent from './LiquidViewContent';
import RightSide from './RightSide';
import Layout from '../../Layout';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import common from '../../../constants/common';
import routes from '../../../constants/routes';

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
class LiquidView extends Component {

  render() {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
    }

    return (
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
            <LiquidViewContent
              {...this.props}
            />
        </Skeleton>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
          <RightSide {...this.props} />
        </Skeleton>
      </Layout>
    );
  }
}

export default LiquidView;
