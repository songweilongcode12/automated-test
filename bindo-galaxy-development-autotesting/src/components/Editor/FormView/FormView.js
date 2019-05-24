import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import {
  Skeleton,
} from 'antd'
import FormViewContent from './FormViewContent'
import RightSide from './RightSide';
import FormWidgets from './FormWidgets';
import FormContainer from './FormContainer';
import EditorLayout from '../../EditorLayout';
import DragSide from '../../DragSide';
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
  getModuleType,
} from '../../../utils/galaxy';
import { findMenuBranch } from '../../../utils/menu';
import {
  findApp,
} from '../../../utils/app';
import routes from '../../../constants/routes';
import common from '../../../constants/common';
import '../Editor.less';

const prefix = 'bindo-galaxy-editor';

@translate()
@connect(({ galaxy, module }) => ({ ...galaxy, ...module }))
class FormView extends Component {
  state = {
    moduleParent: {
      fields: [],
      template: {
        form: [],
      },
    },
  }

  handleResetState = (state) => {
    this.setState(state)
  }

  getBreadcrumbDataForModule = (moduleName) => {
    const { t } = this.props;
    const breadcrumbData = [{
      id: 'modules',
      type: 'link',
      name: t('common:moduleDirectory'),
      url: createRouteUrl(routes.MODULES, {}, this.props),
    }, {
      id: 'module',
      type: 'label',
      name: moduleName,
    }, {
      id: 'module_views',
      type: 'link',
      url: createRouteUrl(routes.MODULE_VIEWS, {}, this.props),
      name: t('common:module.views'),
    }, {
      id: 'parser_views_form',
      type: 'label',
      name: t('common:module.formView'),
    }];

    return breadcrumbData;
  }

  getBreadcrumbData = () => {
    const { t } = this.props;
    const {
      storeID,
      appID,
      menuID,
      moduleName,
    } = parseParams(this.props);

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];

    if (!menuID) {
      return this.getBreadcrumbDataForModule(moduleName);
    }
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

    if (getModuleType(this.props) !== common.SETTING) {
      breadcrumbData.push({
        id: 'module_views',
        type: 'link',
        url: createRouteUrl(routes.VIEWS, {}, this.props),
        name: t('common:module.views'),
      });
    }

    breadcrumbData.push({
      id: 'parser_views_form',
      type: 'label',
      name: t('common:module.formView'),
    });

    return breadcrumbData;
  }

  render () {
    const {
      t,
      dispatch,
      storesMap,
      moduleEntity = {},
      activeTab,
      selectedViewUuid,
      permissionsAndModulesDone,
    } = this.props;

    const {
      galaxyState,
      moduleID,
      storeID,
    } = parseParams(this.props);

    const {
      moduleParent,
    } = this.state;

    const {
      template = {},
      fields = [],
      newFields = [],
    } = moduleEntity || {};

    const {
      fields: moduleParentFields = [],
      template: {
        form: moduleParentForm = [],
      } = {},
    } = moduleParent || {};

    // 给继承来的moduel的field加一个区别的字段
    if (Array.isArray(moduleParentFields) && moduleParentFields.length > 0) {
      moduleParentFields.forEach(item => {
        item.fromParentModule = true
      })
    }

    const moduleFields = [...moduleParentFields, ...fields, ...newFields];

    const {
      form = [],
      actions = {},
    } = template;

    const moduleForm = [...moduleParentForm, ...form];

    const {
      tableInfo,
    } = moduleEntity || {};

    const isBindTable = tableInfo && tableInfo.tableName || false;

    return (
      <EditorLayout {...this.props}>
        <EditorLayout.LeftSide className={`${prefix}-leftside`}>
          <FormWidgets t={t} />
        </EditorLayout.LeftSide>
        <DragSide>
          <Skeleton
            active={true}
            loading={storesMap.size < 1 || !permissionsAndModulesDone}
            className="bg-galaxy-skeleton"
          >
            <FormViewContent
              {...this.props}
              storeID={storeID}
              getBreadcrumbData={this.getBreadcrumbData}
              isBindTable={isBindTable}
              onResetState={this.handleResetState}
            >
              <FormContainer
                viewModels={moduleForm}
                fields={moduleFields}
              />
            </FormViewContent>
            <RightSide
              {...this.props}
              viewModels={moduleForm}
              fields={moduleFields}
              activeTab={activeTab}
              storeID={storeID}
              moduleID={moduleID}
              moduleEntity={moduleEntity}
              moduleActions={actions}
              dispatch={dispatch}
              selectedViewUuid={selectedViewUuid}
              galaxyState={galaxyState}
              getBreadcrumbData={this.getBreadcrumbData}
              isBindTable={isBindTable}
            />
          </Skeleton>
        </DragSide>
      </EditorLayout>
    );
  }
}

export default FormView
