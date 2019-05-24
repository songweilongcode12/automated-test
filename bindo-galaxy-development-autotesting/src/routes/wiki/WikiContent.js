import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import { translate } from 'react-i18next'
import BindoFroalaEditor from '../../components/BindoFroalaEditor'
import common from '../../constants/common'
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../utils/galaxy';
import {
  findMenuBranch,
} from '../../utils/menu'
import {
  findApp,
} from '../../utils/app';
import routes from '../../constants/routes';
import Layout from '../../components/Layout';
import Breadcrumb from '../../components/Breadcrumb';
import './Wiki.less'
import {
  createWiki,
  updateWiki,
  queryWiki,
} from '../../data/graphql/wiki';

const prefix = 'bg-editor-wiki';
const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class Wiki extends Component {
  state = {
    editorContext: '',
    loadValue: null,
  }

  componentDidMount () {
    const { wikiKey } = this.props;
    if (!wikiKey) {
      return;
    }

    this.loadWiki(wikiKey);
  }

  componentWillReceiveProps(nextProps) {
    const { wikiKey } = this.props;
    const { wikiKey: nextWikiKey } = nextProps;
    if (wikiKey !== nextWikiKey) {
      this.loadWiki(nextWikiKey)
    }
  }

  loadWiki = async (key) => {
    const { storeID } = this.props

    if (!key) {
      return
    }

    const {
      value,
    } = await queryWiki({storeID, key});

    this.setState({
      loadValue: value,
      editorContext: value,
    });
  }

  handleChange = (text) => {
    this.setState({editorContext: text})
  }

  getMdEditorView = (viewType) =>{
    const view = {
      menu: false,
      html: true,
      md: false,
    };
    if (viewType) {
      view.menu = true;
      view.md = true;
    }
    return view;
  }

  handleSaveClick = async () => {
    const {
      wikiKey,
      storeID,
    } = this.props;

    const {
      editorContext,
      loadValue,
    } = this.state;

    let data = null
    if (editorContext && wikiKey && storeID ) {
      if (loadValue === null || loadValue === undefined) {
        data = await createWiki({storeID, key: wikiKey, value: editorContext})
      } else {
        data = await updateWiki({storeID, key: wikiKey, value: editorContext})
      }
    }

    const state = { submitting: false }
    if (data && data.value) {
      state.loadValue = data.value
    }

    this.setState(state)
  }

  getBreadcrumbData = () => {
    const {
      t,
    } = this.props;

    const {
      storeID,
      appID,
      menuID,
      from,
    } = parseParams(this.props);

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];

    const menuBranch = findMenuBranch(apps, menuID) || [];

    const breadcrumbData = [{
      id: 'apps',
      type: 'link',
      url: createRouteUrl(routes.APPS, {}, this.props),
      name: t('common:appDirectory'),
    }];

    menuBranch.forEach(item => {
      if (item.$type === common.APP) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.MENUS, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.MODULE) {
        breadcrumbData.push({
          id: item.id,
          type: 'label',
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.SETTING) {
        breadcrumbData.push({
          id: item.id,
          type: 'label',
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.EMBEDDED) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.EMBEDDED, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else {
        breadcrumbData.push({
          id: item.id,
          type: 'label',
          name: getCurrentI18nValue('name', item),
        });
      }
    });

    if (from === common.FORM || from === common.LIST) {
      breadcrumbData.push({
        id: 'module_views',
        type: 'link',
        url: createRouteUrl(routes.VIEWS, {}, this.props),
        name: t('common:module.views'),
      });
    }

    if (from === common.FORM || from === common.SETTING) {
      breadcrumbData.push({
        id: 'module_views',
        type: 'link',
        url: createRouteUrl(routes.FORM_VIEW, {}, this.props),
        name: t('common:module.formView'),
      });
    }

    if (from === common.LIST) {
      breadcrumbData.push({
        id: 'parser_views_list',
        type: 'link',
        url: createRouteUrl(routes.LIST_VIEW, {}, this.props),
        name: t('common:module.listView'),
      });
    }

    breadcrumbData.push({
      id: 'parser_views_from_wiki',
      type: 'label',
      name: t('common:wiki'),
    })

    return breadcrumbData;
  }

  render() {
    const {
      t,
    } = this.props;

    const {
      editorContext,
    } = this.state;

    const {
      storeSlugs,
      galaxyState,
      moduleID,
    } = parseParams(this.props);

    const viewType = galaxyState === common.BUILDER;

    return (
      <Layout.Content className='column'>
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={this.getBreadcrumbData()}
            {...this.props}
          />
        </div>
        <div className={`${galaxyPrefix}-content ${prefix}-content`}>
          <BindoFroalaEditor
            model={editorContext || ''}
            moduleID={moduleID}
            onModelChange={this.handleChange}
          />
        </div>
          {
            viewType &&
            <div className={`${prefix}-footer`}>
              <span>Overview</span>
              <Button
                type="primary"
                className={`${prefix}-btn`}
                onClick={this.handleSaveClick}
              >
                {t('common:save')}
              </Button>
            </div>
          }
      </Layout.Content>
    );
  }
}

export default Wiki;
