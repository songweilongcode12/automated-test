import React, { Component } from 'react';
import {
  Button,
} from 'antd';
import Breadcrumb from '../../Breadcrumb';
import Layout from '../../Layout';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import {
  findModule,
} from '../../../utils/module'
import BindoFroalaEditor from '../../BindoFroalaEditor';
import routes from '../../../constants/routes';
import reduxKey from '../../../constants/reduxKey';

const galaxyPrefix = 'bg-galaxy';

class LiquidTemplateContent extends Component {
  state = {
    editorContext: '',
    moduleEntity: {},
  }

  componentDidMount () {
    const {
      appID,
      moduleID,
      storeID,
      recordID,
    } = parseParams(this.props);

    const moduleEntity = findModule({props: this.props, appID, storeID, moduleID})

    const {
      template = {},
    } = moduleEntity || {};

    const {
      singleViews = [],
    } = template;

    this.setState({
      moduleEntity,
    })

    singleViews.forEach(item => {
      if (item.uuid === recordID) {
        this.setState({
          editorContext: item.editorContext,
        })
      }
    })
  }

  handleEditor = (text) => {
    this.setState({
      editorContext: text,
    })
  }

  handleSubmit = () => {
    // 目前存在于module 的 template

    const {
      history,
      dispatch,
    } = this.props;

    const {
      moduleEntity = {},
      editorContext,
    } = this.state;

    const {
      moduleID,
      storeID,
      recordID,
    } = parseParams(this.props);

    const {
      template = {},
    } = moduleEntity || {};

    let {
      singleViews = [],
    } = template;

    singleViews = singleViews.map(item =>{
      if (item.uuid === recordID) {
        item.editorContext = editorContext;
        return {
          ...item,
        }
      }
      return item;
    })

    template.singleViews = singleViews;

    dispatch({
      type: reduxKey.UPDATE_MODULE, payload: {
        storeID,
        id: moduleID,
        data: moduleEntity,
      },
    });

    const route = routes.VIEWS;

    history.push({ pathname: createRouteUrl(route, {}, this.props)});
  }

  handleCancel = () => {
    const {
      history,
    } = this.props;
    history.push({pathname: createRouteUrl(routes.VIEWS, {}, this.props)})
  }

  render(){

    const {
      t,
      getBreadcrumbData,
      galaxyLoading,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      moduleID,
    } = parseParams(this.props);

    const {
      editorContext,
    } = this.state;

    return(
      <Layout.Content className='column'>
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={getBreadcrumbData()}
            {...this.props}
            // shortcutData={shortcutData}
          />
        </div>

        <div className={`${galaxyPrefix}-content`}>
          <BindoFroalaEditor
            moduleID={moduleID}
            model={editorContext || ''}
            onModelChange={(text) => this.handleEditor(text)}
          />
        </div>

        <div className={`${galaxyPrefix}-footer`}>
          <span>Overview</span>
          <Button
            type="primary"
            className={`${galaxyPrefix}-btn`}
            loading={galaxyLoading}
            onClick={this.handleSubmit}
          >
            {t('common:save')}
          </Button>
          <Button
            // type="primary"
            className={`${galaxyPrefix}-btn`}
            onClick={this.handleCancel}
          >
            {t('common:cancel')}
          </Button>
        </div>
      </Layout.Content>
    )
  }
}
export default LiquidTemplateContent;
