import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Modal, Table } from 'antd';
import lodash from 'lodash'
import DragSide from '../../DragSide';
import {
  parseParams,
  createRouteUrl,
  getModuleType,
} from '../../../utils/galaxy';
import { createUuid } from '../../../utils';
import {
  findModule,
  findModuleByID,
  findStoreModules,
} from '../../../utils/module';
import Breadcrumb from '../../Breadcrumb';
import common from '../../../constants/common';
import routes from '../../../constants/routes';
import reduxKey from '../../../constants/reduxKey';

const galaxyPrefix = 'bg-galaxy';
const prefix = 'bindo-galaxy-editor';

const reserveFieldName = new Set(
  [
    'store_id',
    'id',
  ]
);

class FormViewContent extends Component {

  componentDidMount () {
    this.initModule();
    this.setExistingModules();
  }

  initModule = () => {
    const {
      dispatch,
      onResetState,
    } = this.props;
    const {
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    const module = findModule({
      props: this.props,
      storeID,
      appID,
      moduleID,
    });

    const {
      moduleParentID = '',
    } = module || {};

    let moduleParent;
    if (lodash.isString(moduleParentID) && moduleParentID.length > 1) {
      moduleParent = findModuleByID({
        props: this.props,
        storeID,
        moduleID: moduleParentID,
      })
    }

    if (
      lodash.isObject(moduleParent)
      && Array.isArray(moduleParent.fields)
      && lodash.isObject(moduleParent.template)
      && Array.isArray(moduleParent.template.form)
    ) {
      onResetState({
        moduleParent,
      })
    }

    dispatch({
      type: reduxKey.INIT_MODULE,
      payload: {
        storeID,
        moduleEntity: lodash.cloneDeep(module),
        initStatus: {
          viewType: common.FORM,
          selectedViewUuid: 'name',
        },
      },
    });
  }

  setExistingModules = () => {
    const {
      dispatch,
    } = this.props;

    const {
      storeID,
    } = parseParams(this.props);

    const existingModules = findStoreModules({
      props: this.props,
      storeID,
    })

    dispatch({
      type: reduxKey.UPDATE_MODULE_REDUCER,
      payload: {
        existingModules: lodash.cloneDeep(existingModules),
      },
    });
  }

  checkPresave = (moduleEntity) => {
    const {
      t,
      bindingTableFields = [],
      isBindTable,
    } = this.props;
    const errorMessage = [];
    const {
      fields = [],
      newFields = [],
    } = moduleEntity || {};

    const existingFields = [...fields, ...newFields];

    const nameSet = new Set();

    bindingTableFields.forEach(item => {
      nameSet.add(item.name);
    })
    const reg = /^[a-zA-Z]([_a-zA-Z0-9]*)$/;
    existingFields.forEach(field => {
      if (!field.name || lodash.trim(field.name).length < 1) {
        errorMessage.push({
          key: `empty_${field.uuid}`,
          viewType: field.viewType,
          name: field.name,
          label: field.label,
          message: t('common:editor.fieldNameIsEmpty'),
        });
      } else if (!field.isBindField && nameSet.has(field.name)) {
        errorMessage.push({
          key: `repeated_${field.uuid}`,
          viewType: field.viewType,
          name: field.name,
          label: field.label,
          message: t('common:editor.fieldNamesIsRepeated'),
        });
      } else if (!reg.test(field.name)) {
        errorMessage.push({
          key: `reg_${field.uuid}`,
          viewType: field.viewType,
          name: field.name,
          label: field.label,
          message: t('common:editor.fieldNameRules'),
        });
      } else if (!isBindTable && reserveFieldName.has(field.name)) {
        errorMessage.push({
          key: `reg_${field.uuid}`,
          viewType: field.viewType,
          name: field.name,
          label: field.label,
          message: t('common:editor.fieldNameIsSystem'),
        });
      }
      else {
        nameSet.add(field.name);
      }

      return;
    })

    return errorMessage;
  }

  saveModule = () => {
    const { t, dispatch, moduleEntity, storeID } = this.props;
    const errorMessage = this.checkPresave(moduleEntity);

    if (errorMessage.length < 1) {
      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });

      dispatch({
        type: reduxKey.SAVE_MODULE,
        payload: {
          moduleEntity,
          storeID,
        },
      });
    } else {
      const columns = [
        {
          title: t('common:editor.label'),
          dataIndex: 'label',
          key: 'label',
          width: 200,
        },
        {
          title: t('common:editor.fieldName'),
          dataIndex: 'name',
          key: 'name',
          width: 200,
        },
        {
          title: t('common:editor.componentType'),
          dataIndex: 'viewType',
          key: 'viewType',
          width: 160,
        }, {
          title: t('common:editor.errorMessage'),
          dataIndex: 'message',
          key: 'message',
        }];
      Modal.error({
        title: t('common:editor.verifyErrorMessage'),
        width: '70%',
        content: (
          <Table
            bordered
            columns={columns}
            dataSource={errorMessage}
            scroll={{ y: 300 }}
            pagination={false}
          />
        ),
      });
    }
  }

  getShortcutData = () => {
    const moduleType = getModuleType(this.props);
    let from = common.FORM;
    if (moduleType === common.SETTING) {
      from = common.SETTING;
    }

    const shortcutData = [
      [{
        key: 'formWikiView',
        icon: 'book',
        helpTooltip: 'Form Wiki View',
        linkRoute: routes.EDIT_WIKI,
        routerParams: {
          from,
        },
      }],
      [{
        key: 'filter_rules',
        icon: 'filter',
        helpTooltip: 'Filter Rules',
        linkRoute: routes.FILTER_RULES_VIEW,
        uuid: createUuid(),
      }],
    ]

    return shortcutData
  }

  render () {
    const { t, children, getBreadcrumbData } = this.props;
    const { galaxyState, storeSlugs } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      const moduleType = getModuleType(this.props);
      if (moduleType === common.SETTING) {
        return <Redirect to={createRouteUrl(routes.SETTINGS, {}, this.props)} />
      } else if (moduleType === common.MODULE) {
        return <Redirect to={createRouteUrl(routes.RECORDS, {}, this.props)} />
      }
    }

    return (
      <DragSide.Content className="column">
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={getBreadcrumbData()}
            shortcutData={this.getShortcutData()}
            {...this.props}
          />
        </div>
        <div className={`${galaxyPrefix}-content ${prefix}-content`} style={{ padding: '0 5px' }}>
          {children}
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>{t('common:module.views')}</span>
          <Button
            type="primary"
            className={`${galaxyPrefix}-btn`}
            onClick={this.saveModule}
          >
            {t('common:save')}
          </Button>
          <Button
            // type="primary"
            // style={{ borderColor: 'red', backgroundColor: 'red' }}
            className={`${galaxyPrefix}-btn`}
            onClick={this.initModule}
          >
            {t('common:cancel')}
          </Button>
        </div>
      </DragSide.Content>
    );
  }
}

export default FormViewContent
