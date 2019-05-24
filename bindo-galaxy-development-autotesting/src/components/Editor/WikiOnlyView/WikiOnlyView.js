import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import {
  Skeleton,
  Button,
} from 'antd'
import WikiOnlyContent from './WikiOnlyContent'
import Breadcrumb from '../../Breadcrumb'
import RightSide from './RightSide'
import Layout from '../../Layout'
import {
  parseParams,
  getCurrentI18nValue,
  createRouteUrl,
} from '../../../utils/galaxy'
import {
  findMenuBranch,
} from '../../../utils/menu'
import {
  findApp,
} from '../../../utils/app'
import routes from '../../../constants/routes'
import common from '../../../constants/common'
import reduxKey from '../../../constants/reduxKey'
import {
  createWiki,
  updateWiki,
} from '../../../data/graphql/wiki'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
class WikiOnlyView extends Component {
  state = {
    editorContext: '',
    loadingContent: true,
    loadValue: null,
  }

  getBreadcrumbData = () => {
    const { t } = this.props;
    const { menuID, storeID, appID } = parseParams(this.props);
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
      const { id, $type } = item;

      const data = {
        id,
        type: 'label',
        name: getCurrentI18nValue('name', item),
      };

      if ($type === common.APP) {
        data.type = 'link';
        data.url = createRouteUrl(routes.MENUS, {}, this.props);
      }

      breadcrumbData.push(data);
    });

    return breadcrumbData;
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  handleSave = async () => {
    const {
      storeID,
      menuID,
    } = parseParams(this.props);
    const key = `wikionly_${menuID}`;

    const { dispatch } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });

    const {
      editorContext,
      loadValue,
    } = this.state;

    let data = null
    if (editorContext && key && storeID ) {
      if (loadValue === null || loadValue === undefined) {
        data = await createWiki({storeID, key, value: editorContext})
      } else {
        data = await updateWiki({storeID, key, value: editorContext})
      }
    }

    const state = {};
    if (data && data.value) {
      state.loadValue = data.value
    }

    this.setState(state);
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  }

  handleCancel = () => {
    const {
      history,
    } = this.props;

    const {
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      history.push({ pathname: createRouteUrl(routes.MENUS, {}, this.props) });
    } else if (galaxyState === common.DASHBOARD) {
      history.push({ pathname: createRouteUrl(routes.RECORDS, {}, this.props) });
    }
  }

  render() {
    const {
      t,
      storesMap,
    } = this.props;
    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      return <Redirect to={createRouteUrl(routes.WIKI_ONLY, {}, this.props)} />
    }

    const {
      editorContext,
      loadingContent,
    } = this.state;

    return (
      <Layout {...this.props}>
        <Layout.Content className="column">
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
            />
          </div>
          <div className={`${galaxyPrefix}-content flex`} style={{overflow: 'hidden', display: 'flex'}}>
            <Skeleton
              active={true}
              loading={storesMap.size < 1}
              className="bg-galaxy-skeleton"
            >
              <WikiOnlyContent
                {...this.props}
                editorContext={editorContext}
                loadingContent={loadingContent}
                onResetState={this.handleResetState}
              />
            </Skeleton>
          </div>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Overview</span>
            <Button
              type="primary"
              className={`${galaxyPrefix}-btn`}
              onClick={this.handleSave}
            >
              {t('common:save')}
            </Button>
            <Button
              className={`${galaxyPrefix}-btn`}
              onClick={this.handleCancel}
            >
              {t('common:cancel')}
            </Button>
          </div>
        </Layout.Content>
        <Layout.RightSide>
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <RightSide {...this.props} />
          </Skeleton>
        </Layout.RightSide>
      </Layout>
    );
  }
}

export default WikiOnlyView
