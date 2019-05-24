import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Layout,
  PageView,
} from '../../../components/Pages'
import {
  parseParams,
} from '../../../utils/galaxy'
import reduxKey from '../../../constants/reduxKey'
import {
  jsStringArray,
  liquidData,
  liquidTemplate,
} from './data'

@connect(({ pages }) => ({ ...pages }))
class SingleView extends Component {
  componentDidMount() {
    this.loadModule();
  }

  loadModule = () => {
    const {
      dispatch,
      modulesMap,
    } = this.props;

    const {
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    dispatch({
      type: reduxKey.QUERY_PAGES_MODULE,
      payload: {
        storeID,
        appID,
        moduleID,
        modulesMap,
      },
    });
  }

  render() {
    console.info(this.props);

    return(
      <Layout {...this.props}>
        <PageView
          {...this.props}
          liquidTemplate={liquidTemplate}
          liquidData={liquidData}
          jsStringArray={jsStringArray}
        />
      </Layout>
    )
  }
}

export default SingleView
