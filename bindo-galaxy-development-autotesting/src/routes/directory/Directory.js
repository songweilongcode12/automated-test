import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { Skeleton } from 'antd'
import DirectoryContent from './DirectoryContent'
import Layout from '../../components/Layout'
import './Directory.less'

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
class Directory extends Component {
  render() {
    const {
      storesMap,
    } = this.props;

    return (
      <Layout {...this.props}>
        <Skeleton
          active={true}
          loading={storesMap.size < 1}
          className="bg-galaxy-skeleton"
        >
          <DirectoryContent {...this.props} />
        </Skeleton>
      </Layout>
    );
  }
}

export default Directory;
