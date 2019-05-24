import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import common from '../../../constants/common';
import routes from '../../../constants/routes';

const galaxyPrefix = 'bg-galaxy';
const prefix = 'bindo-galaxy-editor';

class ListViewContent extends Component {

  componentDidMount () {
    const {
      initModule,
    } = this.props;

    initModule();
  }

  render () {
    const {
      children,
    } = this.props;
    const {
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      return <Redirect to={createRouteUrl(routes.RECORDS, {}, this.props)} />
    }

    return (
      <div className={`${galaxyPrefix}-content ${prefix}-content`}>
        {children}
      </div>
    );
  }
}

export default ListViewContent
