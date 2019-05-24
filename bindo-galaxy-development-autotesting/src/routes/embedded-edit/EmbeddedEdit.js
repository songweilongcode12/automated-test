import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import {
  Button,
  Skeleton,
  Form,
} from 'antd'
import EmbeddedEditContent from './EmbeddedEditContent'
import RightSide from './RightSide'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../utils/galaxy'
import {
  findApp,
} from '../../utils/app'
import { findMenuBranch } from '../../utils/menu'
import common from '../../constants/common'
import routes from '../../constants/routes'
import reduxKey from '../../constants/reduxKey'

const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({ galaxy }) => ({ ...galaxy }))
@Form.create()
class EmbeddedEdit extends Component {
  state ={
    saving: false,
    menuData: null,
    loadingContent: true,
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  handleSave = () => {
    const { dispatch, form } = this.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      this.setState({
        saving: true,
      })

      const {
        menuData,
      } = this.state;
      const {
        id,
        parentID,
        name,
        type,
        appID,
        i18n,
        moduleID,
        storeID,
      } = menuData;

      const menuObj = {
        parentID,
        name,
        type,
        appID,
        i18n,
        moduleID,
      };

      const {
        embeddedType,
        embeddedUrl,
        tableauViewName,
        tableauWorkbookName,
        metabaseType,
        metabaseQuestion,
      } = values;

      if (embeddedType === common.URL) {
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: embeddedUrl,
        };
      }

      if (embeddedType === common.TABLEAU) {
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: JSON.stringify({
            viewName: tableauViewName,
            workbookName: tableauWorkbookName,
          }),
        };
      }

      if (embeddedType === common.METABASE) {
        let metabaseValueKey = common.METABASE_QUESTION;
        if (metabaseType === common.METABASE_DASHBOARD) {
          metabaseValueKey = common.METABASE_DASHBOARD;
        }
        menuObj.embeddedConfig = {
          embeddedType,
          embeddedValue: JSON.stringify({
            [metabaseValueKey]: metabaseQuestion,
          }),
        };
      }

      const {
        slug,
      } = parseParams(this.props);

      await dispatch({
        type: reduxKey.UPDATE_MENU,
        payload: {
          storeID,
          appID,
          menuID: id,
          data: menuObj,
          slug,
          callback: () => {
            this.setState({
              saving: false,
            })
          },
        },
      });
    });
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

  getShortcutData = () => {
    const { menuID } = parseParams(this.props);
    const shortcutData = [
      [
        {
          key: 'listWikiView',
          icon: 'book',
          helpTooltip: 'List Wiki View',
          routerParams: {
            moduleID: menuID,
            from: common.EMBEDDED,
          },
          linkRoute: routes.EDIT_WIKI,
        },
      ],
    ];

    return shortcutData;
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
      return (<Redirect to={createRouteUrl(routes.EMBEDDED, {}, this.props)} />);
    }

    const {
      saving,
      menuData,
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
              {...this.props}
              shortcutData={this.getShortcutData()}
            />
          </div>
          <Skeleton
            active={true}
            loading={storesMap.size < 1}
            className="bg-galaxy-skeleton"
          >
            <EmbeddedEditContent
              {...this.props}
              loadingContent={loadingContent}
              onResetState={this.handleResetState}
            />
          </Skeleton>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Embedded</span>
            <Button
              type="primary"
              loading={saving}
              disabled={!menuData || !menuData.id}
              className={`${galaxyPrefix}-btn`}
              onClick={this.handleSave}
            >
              {t('common:save')}
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

export default EmbeddedEdit
