import React, { Component } from 'react';
import {
  Modal,
  Input,
} from 'antd'
import Breadcrumb from '../../components/Breadcrumb';
import Layout from '../../components/Layout';
import { createUuid } from '../../utils';
import ViewItem from './ViewItem'
import {
  parseParams,
  createRouteUrl,
} from '../../utils/galaxy';
import {
  findModule,
} from '../../utils/module';
import routes from '../../constants/routes';
import common from '../../constants/common';
import reduxKey from '../../constants/reduxKey';

import './ModuleViews.less';

const prefix = 'bg-r-module-views';
const galaxyPrefix = 'bg-galaxy';

const shortcutData = [
  [
    {
      key: 'filter_rules',
      icon: 'filter',
      helpTooltip: 'Filter Rules',
      linkRoute: routes.FILTER_RULES_VIEW,
      uuid: createUuid(),
    },
  ],
  [
    {
      key: 'action',
      icon: 'setting',
      helpTooltip: 'Action',
      linkRoute: routes.ACTION,
      uuid: createUuid(),
    },
  ],
]

class ModuleViewContent extends Component {

  state = {
    showNewViewModal: false,
    newTemplateViewName: '',
    moduleEntity: {},
  }

  componentDidMount () {
    const {
      appID,
      moduleID,
      storeID,
    } = parseParams(this.props);

    const moduleEntity = findModule({props: this.props, appID, storeID, moduleID});

    this.setState({
      moduleEntity,
    })
  }

  handleViewClick = (view) => {
    const { history } = this.props;
    const {
      menuID,
      storeID,
    } = parseParams(this.props);

    let routeUrl = null;

    if (menuID) {
      if (view === common.FORM) {
        routeUrl = createRouteUrl(routes.FORM_VIEW, {}, this.props);
      } else if (view === common.LIST) {
        routeUrl = createRouteUrl(routes.LIST_VIEW, {}, this.props);
      } else if (view === common.ACTION) {
        routeUrl = createRouteUrl(routes.ACTION, {}, this.props);
      } else if (view === common.FILTER_RULES) {
        routeUrl = createRouteUrl(routes.FILTER_RULES_VIEW, {storeID}, this.props);
      } else if (view === common.SCHEDULER) {
        routeUrl = createRouteUrl(routes.SCHEDULER_VIEW, {}, this.props);
      }
    }

    if (!menuID) {
      if (view === common.FORM) {
        routeUrl = createRouteUrl(routes.MODULE_FORM_VIEW, {}, this.props);
      } else if (view === common.LIST) {
        routeUrl = createRouteUrl(routes.MODULE_LIST_VIEW, {}, this.props);
      }
    }

    if (routeUrl) {
      history.push({ pathname: routeUrl });
    }
  }

  handleTemplateClick = (action, templateID) =>{
    const route = routes.LIQUID_TEMPLATE_VIEW;

    const {
      history,
    } = this.props;

    if (action === 'new') {
      this.setState({
        showNewViewModal: true,
      })
    } else if (action === 'view') {
      history.push({ pathname: createRouteUrl(route, {recordID: templateID}, this.props)});
    }
  }

  handleTemplateName = (evt) => {
    this.setState({
      newTemplateViewName: evt.target.value,
    })
  }

  handleRedirect = () => {
    const {
      newTemplateViewName,
    } = this.state;
    const route = routes.LIQUID_TEMPLATE_VIEW;

    const {
      history,
    } = this.props;

    const uuid = createUuid();
    if (newTemplateViewName.length > 0) {
      const item = {
        title: newTemplateViewName,
        name: newTemplateViewName,
        actionName: uuid,
        uuid,
        template: '',
        buttonType: 'exportTemplate',
        icon: 'icon-view',
        iconType: 'bindo',
      }

      this.handleSingleViewData({data: item, operate: 'create'});

      history.push({ pathname: createRouteUrl(route, {recordID: uuid}, this.props)});
    }

  }

  /**
   * @param view view data
   */
  handleDeleteView = (view) => {
    const {
      t,
    } = this.props;

    Modal.confirm({
      title: t('common:module.deleteView'),
      content: view.name,
      okText: t('common:yes'),
      okType: 'danger',
      cancelText: t('common:no'),
      onOk: () => {
        this.handleSingleViewData({data: view, operate: 'remove'})
      },
    })
  }

  // 处理singleView数据
  handleSingleViewData = ({data, operate}) => {
    const {
      dispatch,
    } = this.props;

    const {
      moduleEntity,
    } = this.state;

    const {
      moduleID,
      storeID,
    } = parseParams(this.props);

    const {
      template = {},
    } = moduleEntity || {};

    let {
      singleViews = [],
    } = template;

    if (operate === 'create') {
      singleViews.push(data)
    } else if (operate === 'remove') {
      singleViews = singleViews.filter(item => item.uuid !== data.uuid)
    }
    template.singleViews = singleViews;

    this.setState({
      moduleEntity,
    })

    dispatch({
      type: reduxKey.UPDATE_MODULE, payload: {
        storeID,
        id: moduleID,
        data: moduleEntity,
      },
    });
  }

  // 标记默认的view
  handleMarkDefaultView = ({view}) => {
    const {
      viewType,
    } = view;

    const {
      dispatch,
    } = this.props;

    const {
      moduleEntity,
    } = this.state;

    const {
      moduleID,
      storeID,
    } = parseParams(this.props);

    const {
      template = {},
    } = moduleEntity || {};

    if (viewType){
      template.defaultView = viewType;
    }

    this.setState({
      moduleEntity,
    })

    dispatch({
      type: reduxKey.UPDATE_MODULE, payload: {
        storeID,
        id: moduleID,
        data: moduleEntity,
      },
    });
  }

  // 获取当前module的default view
  getDefaultView = (type) => {
    const {
      moduleEntity,
    } = this.state;

    const {
      template = {},
    } = moduleEntity || {};

    const {
      defaultView = common.LIST,
    } = template;

    if (type === defaultView) return true
  }

  render () {
    const {
      t,
      getBreadcrumbData,
    } = this.props;

    const {
      galaxyState,
      storeSlugs,
      moduleID,
    } = parseParams(this.props);

    const {
      showNewViewModal,
      moduleEntity,
    } = this.state;

    const {
      template = {},
    } = moduleEntity || {};

    const {
      singleViews = [],
    } = template;

    return(
      <Layout.Content className="column">
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            moduleID={moduleID}
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={getBreadcrumbData()}
            {...this.props}
            shortcutData={shortcutData}
          />
        </div>
        <div className={`${galaxyPrefix}-content ${prefix}`}>
          <div className="single-view">
            <div className="title">{t('common:module.singleRecordView')}</div>
            <div className="views-container">
              <ViewItem
                data={{
                  name: t('common:module.formView'),
                  icon: 'icon-form',
                }}
                onBtnClick={() => this.handleViewClick('form')}
              />
              {
                singleViews.map(item => (
                  <ViewItem
                    key={item.uuid}
                    data={{
                      ...item,
                      icon: 'icon-cunstom-module',
                    }}
                    onBtnClick={(value) => this.handleTemplateClick('view', value.uuid)}
                    onMoreClick={(value) => this.handleDeleteView(value)}
                  />
                ))
              }
              <ViewItem
                data={{
                  name: t('common:module.newView'),
                  icon: 'plus',
                  iconType: 'antd',
                }}
                onBtnClick={() => this.handleTemplateClick('new')}
              />
              {
                showNewViewModal &&
                <Modal
                  visible={true}
                  title={t('common:module.newView')}
                  okText={t('common:ok')}
                  cancelText={t('common:cancel')}
                  onOk={this.handleRedirect}
                  onCancel={() => this.setState({
                    showNewViewModal: false,
                  })}
                  width={400}
                >
                  <div style={{marginBottom: 10}}>{t('common:name')}</div>
                  <Input onChange={this.handleTemplateName} />
                </Modal>
              }
            </div>
          </div>
          <div className="molti-view">
            <div className="title">{t('common:module.multiRecordView')}</div>
            <div className="views-container">
              <ViewItem
                data={{
                  name: t('common:module.listView'),
                  icon: 'icon-list',
                }}
                onBtnClick={() => this.handleViewClick(common.LIST)}
                actionList={[
                  {
                    key: common.LIST,
                    name: t('common:module.markAsDefaultView'),
                    onClick: () => this.handleMarkDefaultView({view: {
                      viewType: common.LIST,
                    }}),
                  },
                ]}
                isDefaultView={this.getDefaultView(common.LIST)}
              />
              <ViewItem
                data={{
                  name: t('common:module.kanbanView'),
                  icon: 'icon-kanban',
                }}
                onBtnClick={() => this.handleViewClick('kanban')}
              />
              <ViewItem
                data={{
                  name: t('common:module.treeView'),
                  icon: 'icon-tree',
                }}
                onBtnClick={() => this.handleViewClick('tree')}
              />
              <ViewItem
                data={{
                  name: t('common:module.schedulerView'),
                  icon: 'icon-Scheduler',
                }}
                onBtnClick={() => this.handleViewClick(common.SCHEDULER)}
                actionList={[
                  {
                    key: common.SCHEDULER,
                    name: t('common:module.markAsDefaultView'),
                    onClick: () => this.handleMarkDefaultView({view: {
                      viewType: common.SCHEDULER,
                    }}),
                  },
                ]}
                isDefaultView={this.getDefaultView(common.SCHEDULER)}
              />
            </div>
          </div>
          <div className="molti-view">
            <div className="title">{t('common:module.advancedModuleSettings')}</div>
            <div className="views-container">
              <ViewItem
                data={{
                  name: t('common:module.action'),
                  icon: 'icon-automation',
                }}
                onBtnClick={() => this.handleViewClick('action')}
              />
              <ViewItem
                data={{
                  name: t('common:module.filterRules'),
                  icon: 'icon-filter-rules',
                }}
                onBtnClick={() => this.handleViewClick('filterRules')}
              />
              <ViewItem
                data={{
                  name: t('common:module.accessControls'),
                  icon: 'icon-access-control',
                }}
                onBtnClick={() => this.handleViewClick('accessControl')}
              />
            </div>
          </div>
        </div>
        <div className={`${galaxyPrefix}-footer`}>
          <span>{t('common:module.views')}</span>
        </div>
      </Layout.Content>
    )
  }
}

export default ModuleViewContent;
