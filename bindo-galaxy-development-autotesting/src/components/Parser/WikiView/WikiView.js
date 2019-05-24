import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  Skeleton,
} from 'antd';
import Layout from '../../Layout';
import RightSide from './RightSide';
import WikiViewContent from './WikiViewContent';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import common from '../../../constants/common';
import routes from '../../../constants/routes';

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
class WikiView extends Component {

  render() {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      moduleID,
      galaxyState,
      from,
    } = parseParams(this.props);

    let wikiKey;
    // wikikey不同
    if (from === common.FORM || from === common.SETTING) {
      wikiKey = `parse_formview_${moduleID}`
    } else if (from === common.LIST) {
      wikiKey = `parse_listview_${moduleID}`
    } else if (from === common.EMBEDDED) {
      wikiKey = `parse_embedded_${moduleID}`
    }

    if (galaxyState === common.BUILDER) {
      if (from === common.FORM) {
        return <Redirect to={createRouteUrl(routes.RECORD_EDIT_WIKI, {}, this.props)} />
      } else {
        return <Redirect to={createRouteUrl(routes.EDIT_WIKI, {}, this.props)} />
      }
    }

    return (
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
            <WikiViewContent
              {...this.props}
              wikiKey={wikiKey}
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

export default WikiView;
