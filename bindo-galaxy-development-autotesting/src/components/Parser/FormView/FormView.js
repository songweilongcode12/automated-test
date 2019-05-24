import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import lodash from 'lodash'
import {
  Form,
  Skeleton,
  message,
} from 'antd'
import FormViewContent from './FormViewContent'
import RightSide from './RightSide'
import FormViewFooter from './FormViewFooter'
import NotPermissionsView from '../../NotPermissionsView'
import Breadcrumb from '../../Breadcrumb'
import galaxyConstant from '../../../constants/galaxyConstant'
import routes from '../../../constants/routes'
import common from '../../../constants/common'
import reduxKey from '../../../constants/reduxKey'
import Layout from '../../Layout'
import {
  parseParams,
  getModuleType,
  getModulePermissionsMap,
  createRouteUrl,
  getCurrentI18nValue,
  parseModuleFormData,
} from '../../../utils/galaxy'
import {
  createRecord,
  updateRecord,
} from '../../../data/graphql/record'
import {
  findModule,
  getModuleFuncBtns,
} from '../../../utils/module'
import {
  findApp,
} from '../../../utils/app'
import { findMenuBranch } from '../../../utils/menu'
import './FormView.less'

const galaxyPrefix = 'bg-galaxy'
const listviewPrefix = 'bg-c-parser-listview'

@connect(({ galaxy }) => ({ ...galaxy }))
@translate()
@Form.create()
class FormView extends Component {
  state = {
    editableData: false,
    record: {},
    module: {},
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

  getShortcutData = () => {
    const {
      action,
      recordID,
    } = parseParams(this.props);

    let wikiLinkRoute = routes.RECORD_PARSE_WIKI;
    const routerParams = {};
    if (recordID) {
      routerParams.from = common.FORM;
    } else if (action) {
      routerParams.from = common.FORM;
      routerParams.recordID = 'record0';
    } else {
      wikiLinkRoute = routes.PARSE_WIKI;
      routerParams.from = common.SETTING;
    }

    const shortcutTemp = [{
      key: 'formWikiView',
      icon: 'book',
      helpTooltip: 'Form Wiki View',
      linkRoute: wikiLinkRoute,
      routerParams,
    }];

    if (!action) {
      shortcutTemp.push({
        key: 'permissions',
        icon: 'lock',
        helpTooltip: 'Permissions',
        routerParams: {
          from: routerParams.from,
        },
        linkRoute: routes.PERMISSIONS,
      })
    }

    const shortcutData = [shortcutTemp];

    if (action) {
      shortcutData.unshift([
        {
          key: 'records',
          icon: 'bars',
          helpTooltip: 'List View',
          linkRoute: routes.RECORDS,
        },
      ]);
    }
    return shortcutData
  }

  getBreadcrumbData = () => {
    const { t } = this.props;
    const {
      storeID,
      appID,
      menuID,
      action,
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
      const { id, type } = item;

      const data = {
        id,
        type: 'label',
        name: getCurrentI18nValue('name', item),
      };

      if (type === common.MODULE && action) {
        data.type = 'link';
        data.url = createRouteUrl(routes.RECORDS, {}, this.props);
      }

      breadcrumbData.push(data);
    });

    const moduleType = getModuleType(this.props);

    if (moduleType === common.MODULE) {
      if (action === 'new') {
        breadcrumbData.push({
          id: 'parser_formview_action',
          type: 'label',
          name: t('common:new'),
        });
      } else {
        const { record, module } = this.state;
        if (record && record.id) {
          let nameKey = '';
          if (
            lodash.isObject(module)
            && lodash.isObject(module.template)
            && lodash.isString(module.template.displayName)
          ) {
            nameKey = module.template.displayName || 'name';
          }
          let recordName = `#${record.id}`;
          if (record[nameKey]) {
            recordName = record[nameKey];
          }

          breadcrumbData.push({
            id: `record_${record.id}`,
            type: 'label',
            name: recordName,
          });
        }
      }
    }

    return breadcrumbData;
  }

  handleSubmit = (evt) => {
    evt.preventDefault();
    const {
      form,
      relationRecords = {},
      dispatch,
    } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      dispatch({
        type: reduxKey.UPDATE_GALAXY_REDUCER,
        payload: {
          galaxyLoading: true,
        },
      });
      const {
        moduleID,
        storeID,
        appID,
      } = parseParams(this.props);

      const {
        moduleParent,
      } = this.state;

      const module = findModule({
        props: this.props,
        storeID,
        appID,
        moduleID,
      }) || {};

      const moduleRelationRecords = relationRecords[moduleID] || {};
      const { record } = this.state;

      // 需要把moduleParent插入到module里
      if (!lodash.isEmpty(moduleParent)) {
        module.moduleParent = moduleParent;
      }

      const data = parseModuleFormData({
        data: values,
        sourceData: record,
        module,
        props: this.props,
        storeID,
        appID,
        moduleRelationRecords,

      });
      this.handleSave(data);
    });
  }

  handleEdit = () => {
    this.setState({
      editableData: true,
    })
  }

  handleCancel = () => {
    const { form } = this.props;
    this.setState({
      editableData: false,
    })
    form.resetFields();
  }

  handleSave = async (data) => {
    const { t, moduleType, dispatch, searchFilter } = this.props;
    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    const { record } = this.state;

    let newRecord = {};
    try {
      if (record.id) {
        await updateRecord({
          storeID,
          moduleID,
          input: {
            id: record.id,
            formRecord: data,
          },
        });
      } else {
        delete data.id;
        newRecord = await createRecord({
          storeID,
          moduleID,
          input: {
            formRecord: data,
          },
        });
        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            searchFilter: {
              ...searchFilter,
              currentPage: 1,
            },
          },
        });
      }

      if (moduleType === common.SETTING) {
        this.setState({ record: newRecord });
      } else {
        this.handleToList();
      }
    } catch (error) {
      message.error(t(`common:module.${record.id ? 'edit' : 'new'}Failed`));
      log.error(error);
    }

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });

    dispatch({
      type: reduxKey.CLEAR_RELATION_RECORDS,
    });
  }

  handleToList = () => {
    const { history, dispatch } = this.props;

    dispatch({
      type: reduxKey.CLEAR_RELATION_RECORDS,
    });

    history.push({
      pathname: createRouteUrl(
        routes.RECORDS,
        {},
        this.props
      ),
    });
  }

  render() {
    const {
      storesMap,
      permissionsAndModulesDone,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    const {
      editableData,
      record,
      module,
      moduleParent,
    } = this.state;

    const moduleType = getModuleType(this.props);

    const permissionsMap = getModulePermissionsMap({
      props: this.props,
    })

    const funcBtns = getModuleFuncBtns({
      module,
    })

    const canView = permissionsMap.get(galaxyConstant.ACTIONS).has('VIEW');

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
            loading={storesMap.size < 1 || !permissionsAndModulesDone}
            className="bg-galaxy-skeleton"
          >
            {
              !canView &&
              <div
                className={`${galaxyPrefix}-content ${listviewPrefix}-content`}
                style={{display: 'flex'}}
              >
                <NotPermissionsView />
              </div>
            }
            {
              canView &&
              <FormViewContent
                {...this.props}
                module={module}
                moduleParent={moduleParent}
                record={record}
                funcBtns={funcBtns}
                permissionsMap={permissionsMap}
                moduleType={moduleType}
                editableData={editableData}
                onResetState={this.handleResetState}
              />
            }
          </Skeleton>
          <FormViewFooter
            {...this.props}
            funcBtns={funcBtns}
            permissionsMap={permissionsMap}
            editableData={editableData}
            moduleType={moduleType}
            onSubmitClick={this.handleSubmit}
            onEditClick={this.handleEdit}
            onCancelClick={this.handleCancel}
            onToListClick={this.handleToList}
          />
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

export default FormView;
