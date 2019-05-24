import React, { Component } from 'react'
import {
  Skeleton,
} from 'antd'
import {
  parseParams,
} from '../../../utils/galaxy'
import BindoFroalaEditor from '../../BindoFroalaEditor'
import {
  queryWiki,
} from '../../../data/graphql/wiki'

class WikiOnlyContent extends Component {
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
    const {
      onResetState,
    } = props;
    onResetState({
      loadingContent: true,
    });
    const {
      storeID,
      menuID,
    } = parseParams(props);
    const key = `wikionly_${menuID}`;

    let editorContext = '';

    try {
      const {
        value,
      } = await queryWiki({storeID, key});

      editorContext = value;
    } catch (error) {
      log.error(error);
    }

    onResetState({
      editorContext,
      loadValue: editorContext,
      loadingContent: false,
    });
  }

  handleChange = (text) => {
    const {
      onResetState,
    } = this.props;
    onResetState({
      editorContext: text,
    })
  }

  render() {
    const {
      editorContext,
      loadingContent,
    } = this.props;

    const {
      appID,
    } = parseParams(this.props);

    return (
      <Skeleton
        active={true}
        loading={loadingContent}
        className="bg-galaxy-skeleton"
      >
        <BindoFroalaEditor
          model={editorContext || ''}
          onModelChange={this.handleChange}
          appID={appID}
          config={
            {
              height: 400,
            }
          }
        />
      </Skeleton>
    );
  }
}

export default WikiOnlyContent;
