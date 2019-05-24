import React, { Component } from 'react'
import { Redirect } from 'react-router-dom';
import BindoFroalaParser from '../../BindoFroalaEditor/BindoFroalaParser';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import routes from '../../../constants/routes';
import common from '../../../constants/common';

import {
  queryWiki,
} from '../../../data/graphql/wiki';

class Wikiparser extends Component {

  state = {
    editorContext: '',
  }

  componentDidMount () {
    this.loadWiki(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const { wikiKey } = this.props;
    const { wikiKey: nextWikiKey } = nextProps;
    if (wikiKey !== nextWikiKey) {
      // this.setState({isEditable: false});
      this.loadWiki(nextProps)
    }
    return true;
  }

  loadWiki = async ({storeID, wikiKey: key}) => {
    if (!key) {
      this.setState({
        editorContext: '',
      });
      return
    }

    const data = await queryWiki({storeID, key});
    const { value } = data;

    if (data) {
      this.setState({
        editorContext: value,
      });
    }
  }

  render () {

    const {
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
    }

    const {
      editorContext,
    } = this.state

    return (
      <div style={{padding: 10}}>
        <BindoFroalaParser model={editorContext} />
      </div>
    )
  }
}

export default Wikiparser;
