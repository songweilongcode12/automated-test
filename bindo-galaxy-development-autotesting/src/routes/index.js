import routes from '../constants/routes';

const routeData = [
  {
    path: routes.LOGIN,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-auth' */ './login'),
  },
  {
    path: routes.PASSWORD_FORGOT,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-auth' */ './login/ForgotPassword'),
  },
  {
    path: routes.PASSWORD_RECOVERY,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-auth' */ './login/Recovery'),
  },
  {
    path: routes.PASSWORD_RESET,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-auth' */ './login/ResetPassword'),
  },
  {
    path: routes.DIRECTORY,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-framework' */ './directory'),
  },
  {
    path: routes.APPS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-framework' */ './apps'),
  },
  {
    path: routes.MENUS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-framework' */ './menus'),
  },
  {
    path: routes.MODULES,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-modules' */ './modules'),
  },
  {
    path: routes.MODELS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-models' */ './models'),
  },
  {
    path: routes.MODEL_FIELDS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-models' */ './model-fields'),
  },
  {
    path: routes.EMBEDDED,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './embedded'),
  },
  {
    path: routes.EMBEDDED_EDIT,
    exact: true,
    load: () =>
      import(/* webpackChunkName: 'bindo-galaxy-editor' */ './embedded-edit'),
  },
  {
    path: routes.WIKI_ONLY,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/wiki-only-view'),
  },
  {
    path: routes.WIKI_ONLY_EDIT,
    exact: true,
    load: () =>
      import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/wiki-only-view'),
  },
  {
    path: routes.RECORDS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/list-view'),
  },
  {
    path: routes.SCHEDULER,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/scheduler-view'),
  },
  {
    path: routes.RECORD,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/form-view'),
  },
  {
    path: routes.RECORD_ACTION,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/form-view'),
  },
  {
    path: routes.SETTINGS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/form-view'),
  },
  {
    path: routes.PERMISSIONS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './permissions'),
  },
  {
    path: routes.VIEWS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './module-views'),
  },
  {
    path: routes.FORM_VIEW,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/form-view'),
  },
  {
    path: routes.LIST_VIEW,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/list-view'),
  },
  {
    path: routes.SCHEDULER_VIEW,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/scheduler-view'),
  },
  {
    path: routes.MODULE_VIEWS,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './module-views'),
  },
  {
    path: routes.MODULE_FORM_VIEW,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/form-view'),
  },
  {
    path: routes.MODULE_LIST_VIEW,
    exact: true,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/list-view'),
  },
  {
    path: routes.WELCOME,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './welcome'),
  },
  {
    path: routes.APP_WELCOME,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './welcome'),
  },
  {
    path: routes.HOME,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './home'),
  },
  // {
  //   path: '/test/formula/editor',
  //   load: () => import(/* webpackChunkName: 'test-formula-editor' */ './test/formula-editor'),
  // },
  // {
  //   path: '/test/filters',
  //   load: () => import(/* webpackChunkName: 'test-formula-editor' */ './test/filters'),
  // },
  // {
  //   path: '/test/dnd',
  //   load: () => import(/* webpackChunkName: 'test-formula-editor' */ './test/reactDnd/DragDropContext'),
  // },
  {
    path: routes.ACTION,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/action-view'),
  },
  {
    path: routes.ACTION_RECORD,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/action-form-view'),
  },
  {
    path: routes.ACTION_RECORD_ACTION,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/action-form-view'),
  },
  {
    path: routes.EDIT_WIKI,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './wiki/Wiki'),
  },
  {
    path: routes.RECORD_EDIT_WIKI,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './wiki/Wiki'),
  },
  {
    path: routes.PARSE_WIKI,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/wiki-view'),
  },
  {
    path: routes.RECORD_PARSE_WIKI,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-parser' */ './parser/wiki-view'),
  },
  {
    path: routes.LIQUID_TEMPLATE_VIEW,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/liquid-template-view'),
  },
  {
    path: routes.FILTER_RULES_VIEW,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/filter-rules-view'),
  },
  {
    path: routes.FILTER_RULES_RECORD,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/filter-rules-form-view'),
  },
  {
    path: routes.FILTER_RULES_RECORD_ACTION,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-editor' */ './editor/filter-rules-form-view'),
  },
  {
    path: routes.SINGLE_VIEW,
    load: () => import(/* webpackChunkName: 'bindo-galaxy-pages' */ './pages/single-view'),
  },
  {
    path: '/test/formula/editor',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/formula-editor'),
  },
  {
    path: '/test/dhtmlx/gantt',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/dhtmlx/gantt'),
  },
  {
    path: '/test/dhtmlx/scheduler',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/dhtmlx/scheduler'),
  },
  {
    path: '/test/liquid',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/liquid'),
  },
  {
    path: '/test/js',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/testjs'),
  },
  {
    path: '/test/geetest',
    load: () => import(/* webpackChunkName: 'bindo-galaxy-test' */ './test/geetest'),
  },
  {
    path: '/test/videoPlayer',
    load: () => import(/* webpackChunkName: 'test-formula-editor' */ './test/videoPlayer'),
  },
];

export default routeData;
