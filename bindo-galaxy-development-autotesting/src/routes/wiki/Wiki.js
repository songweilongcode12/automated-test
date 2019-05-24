import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { translate } from 'react-i18next';
import {
  Skeleton,
} from 'antd';
import WikiContent from './WikiContent';
import EditorLayout from '../../components/EditorLayout';
import {
  parseParams,
  createRouteUrl,
} from '../../utils/galaxy';

import routes from '../../constants/routes';
import common from '../../constants/common';
import '../../components/Editor/Editor.less';

// const prefix = 'bindo-galaxy-editor';

@translate()
@connect(({ galaxy, module }) => ({ ...galaxy, ...module }))
class FormView extends Component {

  render () {

    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      moduleID,
      galaxyState,
      from,
      action,
      storeID,
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

    if (galaxyState === common.DASHBOARD) {
      if (from === common.FORM) {
        if (action) {
          return <Redirect to={createRouteUrl(routes.RECORD_PARSE_WIKI, {}, this.props)} />
        } else {
          return <Redirect to={createRouteUrl(routes.RECORDS, {}, this.props)} />
        }
      } else {
        return <Redirect to={createRouteUrl(routes.PARSE_WIKI, {}, this.props)} />
      }
    }

    return (
      <EditorLayout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1 || !permissionsAndModulesDone}
          className="bg-galaxy-skeleton"
        >
          <WikiContent
            storeID={storeID}
            wikiKey={wikiKey}
            {...this.props}
          />
        </Skeleton>
      </EditorLayout>
    );
  }
}

export default FormView
