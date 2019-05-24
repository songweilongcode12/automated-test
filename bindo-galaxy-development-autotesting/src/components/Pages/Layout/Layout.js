import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Spin } from 'antd'
import reduxKey from '../../../constants/reduxKey'
import {
  parseParams,
} from '../../../utils/galaxy'
import './Layout.less'

const prefix = 'bg-c-page-layout';

@connect(({ pages }) => ({ ...pages }))
class Layout extends Component {
  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_PAGES_REDUCER,
      payload: {
        pageLoading: true,
      },
    });
    this.queryStore();
  }

  queryStore = () => {
    const {
      dispatch,
      storesMap,
      storesIDRefSlug,
      storesSlugRefID,
      storesAppsModulesMap,
    } = this.props;

    const {
      slug,
    } = parseParams(this.props);

    dispatch({
      type: reduxKey.QUERY_PAGES_STORE,
      payload: {
        storesMap,
        storesIDRefSlug,
        storesSlugRefID,
        storesAppsModulesMap,
        slug,
      },
    });
  }

  render() {
    const {
      pageLoading = false,
      storesMap,
      children,
    } = this.props;
    const {
      slug,
    } = parseParams(this.props);
    return (
      <div className={prefix}>
        {
          pageLoading &&
          <div className={`${prefix}-spin`}>
            <Spin className={`${prefix}-spin-content`} size="large" />
          </div>
        }
        {
          storesMap.has(slug) &&
          children
        }
      </div>
    );
  }
}

export default Layout;
