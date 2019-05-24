import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { DragDropContext } from 'react-beautiful-dnd'
import lodash from 'lodash'
import {
  Skeleton,
  Button,
} from 'antd'
// import ListContainer from './ListContainer'
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../../utils/galaxy'
import {
  findModule,
  findModuleByID,
} from '../../../utils/module'
import {
  findApp,
} from '../../../utils/app'
import reduxKey from '../../../constants/reduxKey'
import Breadcrumb from '../../Breadcrumb'
import SchedulerViewContent from './SchedulerViewContent'
import EditorLayout from '../../EditorLayout'
// import FieldWidgets from './FieldWidgets'
import routes from '../../../constants/routes'
import { findMenuBranch } from '../../../utils/menu'
import common from '../../../constants/common'
import DragSide from '../../DragSide'
import RightSide from './RightSide'
import '../Editor.less'
import './SchedulerView.less'

const prefix = 'bindo-galaxy-editor';
const galaxyPrefix = 'bg-galaxy';

@translate()
@connect(({
  module,
  galaxy,
}) => ({
  ...module,
  ...galaxy,
}))
class SchedulerView extends Component {
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
      name: t('common:module.schedulerView'),
    }];

    return breadcrumbData;
  }

  getBreadcrumbData = () => {
    const { t } = this.props;
    const { menuID, moduleName, storeID, appID } = parseParams(this.props);
    if (!menuID) {
      return this.getBreadcrumbDataForModule(moduleName);
    }
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

    breadcrumbData.push({
      id: 'module_views',
      type: 'link',
      url: createRouteUrl(routes.VIEWS, {}, this.props),
      name: t('common:module.views'),
    });

    breadcrumbData.push({
      id: 'parser_views_form',
      type: 'label',
      name: t('common:module.schedulerView'),
    });

    return breadcrumbData;
  }

  getShortcutData = () => {
    const shortcutData = [
      [
        {
          key: 'listView',
          icon: 'bars',
          helpTooltip: 'List View 13',
          linkRoute: routes.LIST_VIEW,
        },
      ],
      [
        {
          key: 'action',
          icon: 'setting',
          helpTooltip: 'Action',
          linkRoute: routes.ACTION,
        },
      ],
      [
        {
          key: 'listWikiView',
          icon: 'book',
          helpTooltip: 'List Wiki View',
          linkRoute: routes.RECORD_EDIT_WIKI,
          routerParams: {
            from: common.LIST,
          },
        },
      ],
    ]

    return shortcutData
  }

  initModule = () => {
    const {
      dispatch,
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
      moduleParentID,
    } = module;

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
      this.setState({
        moduleParent,
      })
    }

    dispatch({
      type: reduxKey.INIT_MODULE,
      payload: {
        storeID,
        moduleEntity: lodash.cloneDeep(module),
        initStatus: {
          viewType: common.LIST,
          selectedViewUuid: 'name',
        },
      },
    });
  }

  saveModule = () => {
    const {
      dispatch,
      moduleEntity,
    } = this.props;

    const {
      storeID,
    } = parseParams(this.props);

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
  }

  handleDragEnd = result => {
    const { draggableId, source: s, destination: d } = result;
    if (!d) {
      return;
    }

    if (s.droppableId === d.droppableId && s.index === d.index) {
      return;
    }

    if (s.droppableId === d.droppableId && s.droppableId === 'listview-widgets-fields') {
      return;
    }

    const {
      dispatch,
      moduleEntity,
    } = this.props;

    const {
      moduleParent,
    } = this.state;

    let {
      fields,
    } = moduleEntity || {};

    const {
      fields: moduleParentFields = [],
    } = moduleParent;

    fields = [...moduleParentFields, ...fields];

    if (s.droppableId === d.droppableId) {
      dispatch({
        type: reduxKey.UPDATE_MODULE_ENTITY,
        payload: {
          editViews: [{
            operate: 'move',
            fromUuid: '0',
            toUuid: '0',
            newIndex: d.index,
            oldIndex: s.index,
          }],
        },
      });

      return;
    }

    if (d.droppableId === 'listview-widgets-fields' && draggableId) {
      dispatch({
        type: reduxKey.UPDATE_MODULE_ENTITY,
        payload: {
          editViews: [{
            operate: 'remove',
            uuid: draggableId,
          }],
        },
      });
    } else if (d.droppableId === 'listview-container-fields' && draggableId) {
      let field = null;
      for (let i = 0; i < fields.length; i++) {
        if (fields[i].uuid === draggableId) {
          field = fields[i];
          break;
        }
      }

      if (field) {
        dispatch({
          type: reduxKey.UPDATE_MODULE_ENTITY,
          payload: {
            editViews: [{
              operate: 'insert',
              index: d.index,
              data: {
                parentUuid: '0',
                uuid: field.uuid,
                viewType: field.viewType,
              },
            }],
          },
        });
      }
    }
  }

  render () {
    const {
      t,
      moduleEntity = {},
      storesMap,
      permissionsAndModulesDone,
    } = this.props;
    const {
      storeID,
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    const {
      moduleParent,
    } = this.state;

    const {
      template = {},
      fields = [],
    } = moduleEntity;

    const {
      list = [],
    } = template;

    const {
      fields: moduleParentFields = [],
    } = moduleParent;

    const moduleList = [...list]

    const moduleFields = [ ...moduleParentFields, ...fields]

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <EditorLayout {...this.props}>
          <EditorLayout.LeftSide className={`${prefix}-leftside`}>
            <Skeleton
              active={true}
              loading={storesMap.size < 1 || !permissionsAndModulesDone}
              className="bg-galaxy-skeleton"
            >
              {/* <FieldWidgets viewModels={moduleList} fields={moduleFields} /> */}
            </Skeleton>
          </EditorLayout.LeftSide>
          <DragSide>
            <DragSide.Content className="column">
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
                <SchedulerViewContent
                  {...this.props}
                  storeID={storeID}
                  onResetState={this.handleResetState}
                  initModule={this.initModule}
                />
              </Skeleton>
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
            <DragSide.RightSide className={`${prefix}-rightside`}>
              <Skeleton
                active={true}
                loading={storesMap.size < 1 || !permissionsAndModulesDone}
                className="bg-galaxy-skeleton"
              >
                <RightSide
                  {...this.props}
                  viewModels={moduleList}
                  moduleEntity={moduleEntity}
                  fields={moduleFields}
                  galaxyState={galaxyState}
                  getBreadcrumbData={this.getBreadcrumbData}
                />
              </Skeleton>
            </DragSide.RightSide>
          </DragSide>
        </EditorLayout>
      </DragDropContext>
    );
  }
}

export default SchedulerView;
