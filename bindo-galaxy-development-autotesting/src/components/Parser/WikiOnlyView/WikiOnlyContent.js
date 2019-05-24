import React, { Component } from 'react'
import {
  Skeleton,
} from 'antd'
import BindoFroalaParser from '../../BindoFroalaEditor/BindoFroalaParser'
import {
  parseParams,
} from '../../../utils/galaxy'
import {
  queryWiki,
} from '../../../data/graphql/wiki'

class WikiOnlyContent extends Component {
  state = {
    editorContext: '',
    loadingContent: true,
  }

  componentDidMount() {
    this.loadWiki(this.props);
  }

  shouldComponentUpdate(nextProps) {
    const { menuID } = parseParams(this.props);
    const { menuID: nextMenuID } = parseParams(nextProps);

    if (menuID !== nextMenuID) {
      this.loadWiki(nextProps)
    }

    return true;
  }

  loadWiki = async props => {
    this.setState({
      loadingContent: true,
    });

    const {
      menuID,
      storeID,
    } = parseParams(props);

    let editorContext = '';

    try {
      const {
        value = '',
      } = await queryWiki({storeID, key: `wikionly_${menuID}`});

      editorContext = value;
    } catch (error) {
      log.error(error);
    }

    this.setState({
      editorContext,
      loadingContent: false,
    });
  }

  render() {
    const {
      editorContext,
      loadingContent,
    } = this.state;

    return (
      <Skeleton
        active={true}
        loading={loadingContent}
        className="bg-galaxy-skeleton"
      >
        <BindoFroalaParser model={editorContext} />
      </Skeleton>
    );
  }
}

export default WikiOnlyContent;
