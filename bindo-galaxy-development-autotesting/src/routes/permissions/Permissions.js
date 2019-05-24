import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { translate } from 'react-i18next'
import i18n from 'i18next'
import { cloneDeep } from 'lodash'
import {
  Form,
  Skeleton,
  Button,
  message,
} from 'antd'
import PermissionContent from './PermissionContent'
import RightSide from './RightSide'
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
  getAppAuthInfo,
} from '../../utils/galaxy'
import {
  findApp,
} from '../../utils/app'
import Breadcrumb from '../../components/Breadcrumb'
import common from '../../constants/common'
import reduxKey from '../../constants/reduxKey'
import routes from '../../constants/routes'
import Layout from '../../components/Layout'
import { findMenuBranch } from '../../utils/menu'
import {
  permissionBatchUpdate,
} from '../../data/graphql/app/index'
import './Permissions.less';

const galaxyPrefix = 'bg-galaxy'

const moduleTypeRef = {
  [common.MODULE]: common.UPPERCASE_MODULE,
  [common.SETTING]: common.UPPERCASE_SETTING,
  [common.EMBEDDED]: common.UPPERCASE_EMBEDDED,
}

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
@Form.create()
class Permissions extends Component {
  state = {
    editable: false,
    loading: false,
    appAuths: {},
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  updatePermission = async ()=> {
    const {
      dispatch,
      storesModulesPermissionsMap,
    } = this.props;
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: true,
      },
    });
    this.setState({
      loading: true,
    });
    const {
      appAuths,
    } = this.state;
    const {
      modules=[],
      storeID = '',
      appID = '',
    } = appAuths;
    const updateData = [];
    modules.forEach(module => {
      const {
        menuID = '',
        moduleID = '',
        roles = [],
        type = '',
      } = module || {};

      if (
        roles.length < 1
        || !moduleTypeRef[type]
      ) {
        return;
      }

      const baseData = {
        appID,
        type: moduleTypeRef[type],
      }

      if (type === common.EMBEDDED) {
        baseData.menuID = menuID;
      } else if (type === common.MODULE || type === common.SETTING) {
        baseData.moduleID = moduleID;
      } else {
        return;
      }

      roles.forEach(role => {
        const {
          modified = false,
          permissions = [],
        } = role;

        if (permissions.length < 1 || !modified) {
          return;
        }

        const roleData = {
          ...baseData,
          storeRoleID: role.id,
          scriptNames: [],
          actions: [],
        }

        if (role.permissionID) {
          roleData.id = role.permissionID;
        }

        permissions.forEach(permission => {
          const {
            type: pType,
            value: pValue,
            key: pKey,
          } = permission;

          if (!pValue) {
            return;
          }

          if (pType === common.DEFAULT) {
            roleData.actions.push(pKey);
          } else if (pType === common.CUSTOM) {
            roleData.scriptNames.push(pKey)
          }
        });

        updateData.push(roleData);
      })
    });
    try {
      await permissionBatchUpdate({ storeID, input: updateData});

      await dispatch({
        type: reduxKey.RELOAD_STORE_PERMISSIONS,
        payload: {
          storeIDs: [storeID],
          storesModulesPermissionsMap,
        },
      });

      message.success(i18n.t('common:permissionSaveSuccess'));
    } catch (error) {
      message.error(i18n.t('common:permissionSaveError'));
      log.error(error)
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
    this.setState({
      editable: false,
      loading: false,
    });
  }

  handleEdit = () => {
    const {
      appAuths,
    } = this.state;

    this.setState({
      editable: true,
      appAuths: cloneDeep(appAuths),
    })
  }

  handleCancel = () => {
    this.resetAppAuths(this.props);
  }

  resetAppAuths = props => {
    const {
      dispatch,
    } = props;

    const appAuthInfo = getAppAuthInfo(props);

    let appAuths = {};
    if (appAuthInfo.length > 0) {
      [appAuths] = appAuthInfo;
    }
    this.setState({
      appAuths,
      editable: false,
    });

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });
  }

  getBreadcrumbData = () => {
    const { t } = this.props;
    const {
      storeID,
      appID,
      menuID,
    } = parseParams(this.props);
    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];
    const menuBranch = findMenuBranch(apps, menuID) || [];

    const breadcrumbData = [];
    menuBranch.forEach(item => {
      if (item.type === common.MODULE) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.RECORDS, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.EMBEDDED) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.EMBEDDED, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.SETTING) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.SETTINGS, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.WIKI_ONLY) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.WIKI_ONLY, {}, this.props),
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

    breadcrumbData.push({
      id: 'permission',
      type: 'label',
      name: t('common:permissions'),
    });

    return breadcrumbData;
  }

  render() {
    const {
      t,
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      from,
      slug,
    } = parseParams(this.props);

    if (galaxyState === common.BUILDER) {
      if (from === common.SETTING) {
        return <Redirect to={createRouteUrl(routes.FORM_VIEW, {}, this.props)} />
      } else if(from === common.EMBEDDED) {
        return <Redirect to={createRouteUrl(routes.EMBEDDED_EDIT, {}, this.props)} />
      } else {
        return <Redirect to={createRouteUrl(routes.VIEWS, {}, this.props)} />
      }
    }

    const {
      loading,
      editable,
      appAuths,
    } = this.state;

    const loadingData = storesMap.size < 1 || !permissionsAndModulesDone;

    let isManager = false;
    if (storesMap.has(slug)) {
      const store = storesMap.get(slug);
      if (store.roleType === 1) {
        isManager = true;
      }
    }

    return (
      <Layout {...this.props}>
        <Layout.Content className='column'>
          <div className={`${galaxyPrefix}-header`}>
            <Breadcrumb
              galaxyState={galaxyState}
              storeSlugs={storeSlugs}
              data={this.getBreadcrumbData()}
              {...this.props}
            />
          </div>
          <Skeleton
            active={true}
            loading={loadingData}
            className="bg-galaxy-skeleton"
          >
            <PermissionContent
              {...this.props}
              appAuths={appAuths}
              editable={editable}
              onResetState={this.handleResetState}
              resetAppAuths={this.resetAppAuths}
            />
          </Skeleton>
          <div className={`${galaxyPrefix}-footer`}>
            <span>Permissions</span>
            {
              isManager && !loadingData && editable &&
              <Button
                type="primary"
                className={`${galaxyPrefix}-btn`}
                disabled={loading}
                onClick={this.updatePermission}
              >
                {t('common:save')}
              </Button>
            }
            {
              isManager && !loadingData && !editable &&
              <Button
                type="primary"
                className={`${galaxyPrefix}-btn`}
                onClick={this.handleEdit}
              >
                {t('common:edit')}
              </Button>
            }
            {
              isManager && !loadingData && editable &&
              <Button
                type="primary"
                className={`${galaxyPrefix}-btn`}
                onClick={this.handleCancel}
              >
                {t('common:cancel')}
              </Button>
            }
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

export default Permissions;
