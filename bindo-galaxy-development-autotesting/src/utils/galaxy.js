import moment from 'moment'
import lodash from 'lodash'
import {
  findNode,
  createUuid,
} from './index'
import routes from '../constants/routes'
import common from '../constants/common'
import reduxKey from '../constants/reduxKey'
import fieldRules from '../constants/fieldRules'
import widgets from '../constants/widgets'
import i18n from '../i18n'
import { runFormula } from '../data/MqlParser'
import {
  findMenuBranch,
  parseMenuBranch,
} from './menu'
import {
  findStoresAppsBySlugs,
  findApp,
} from './app'
import {
  findAppModules, findModuleByID,
} from './module'
import galaxyConstant from '../constants/galaxyConstant';

/**
 * 从props解析出params参数
 * @param {*} props
 */
export const parseParams = props => {
  const {
    match: {
      params = {},
    } = {},
    storesSlugRefID,
    storesMap,
  } = props || {};

  const newParams = {};
  Object.keys(params).forEach(key => {
    newParams[key] = params[key];
    if (key === 'storeSlugs') {
      const storeSlugs = params[key];
      newParams.storeIDs = [];
      newParams.stores = [];
      if (storeSlugs && storeSlugs.length > 0) {
        newParams[key] = storeSlugs.split(',');
        newParams[key].forEach(slug => {
          if (storesSlugRefID.has(slug)) {
            newParams.storeIDs.push(storesSlugRefID.get(slug))
          }
          if (storesMap.has(slug)) {
            newParams.stores.push(storesMap.get(slug))
          }
        });
      } else {
        newParams[key] = [];
      }
    }

    if (key === 'slug' && storesSlugRefID) {
      newParams.storeID = storesSlugRefID.get(params[key]);
    }
  });

  return newParams;
}

/**
 * 根据route和params创建url, 如果存在props, 缺省值从props中取
 * @param {*} route 路由地址
 * @param {*} params 路由参数
 * @param {*} props react对象的props
 */
export const createRouteUrl = (route, params = {}, props) => {
  route = route || '';

  if (props && props.match) {
    const { params: matchParams = {}, path } = props.match;
    params = {
      ...matchParams,
      ...params,
    };

    if (route === '') {
      route = path;
    }
  }

  Object.keys(params).forEach(key => {
    route = route.replace(`:${key}`, params[key]);
  });

  return route;
};

/**
 * 根据菜单数据，创建相应的路由
 * @param {*} menuData 菜单数据
 * @param {*} params react对象的props
 * @param {*} props 路由参数
 */
export const createMenuUrl = (menuData, params, props) => {
  const { id: menuID, moduleID, type, appID } = menuData;

  let route = '';
  params = params || {};
  props = props || {};

  const { galaxyState } = params;

  if (type === common.MODULE) {
    if (galaxyState === common.BUILDER) {
      route = routes.VIEWS;
    } else {
      route = routes.RECORDS;
    }
  } else if (type === common.EMBEDDED) {
    if (galaxyState === common.BUILDER) {
      route = routes.EMBEDDED_EDIT;
    } else {
      route = routes.EMBEDDED;
    }
  } else if (type === common.WIKI_ONLY) {
    if (galaxyState === common.BUILDER) {
      route = routes.WIKI_ONLY_EDIT;
    } else {
      route = routes.WIKI_ONLY;
    }
  } else if (type === common.SETTING) {
    if (galaxyState === common.BUILDER) {
      route = routes.FORM_VIEW;
    } else {
      route = routes.SETTINGS;
    }
  }

  return createRouteUrl(
    route,
    {
      page: 1,
      pageSize: 10,
      moduleID,
      menuID,
      appID,
      ...params,
    },
    props
  );
};

export const getMenuUrl = ({
  menu,
  storesMap,
}) => {
  let pathname = null;
  const stores = [...storesMap.values()];

  if (menu && menu.id) {
    let newSlug = null;
    for (let i = 0; i < stores.length; i++) {
      if(stores[i].id === menu.inStoreID) {
        newSlug = stores[i].slug;
        break;
      }
    }

    if (newSlug) {
      pathname = createMenuUrl(
        menu,
        {
          galaxyState: common.DASHBOARD,
          storeSlugs: [newSlug],
          slug: newSlug,
        }
      );
    }
  }

  if (!pathname) {
    if (stores.length > 0) {
      const newSlug = stores[0].slug;
      pathname = createRouteUrl(
        routes.WELCOME,
        {
          galaxyState: common.DASHBOARD,
          storeSlugs: [newSlug],
        },
      );
    } else {
      pathname = '/login';
    }
  }

  return pathname;
}

export const getRules = (ruleList = []) => {
  const rules = [];

  ruleList.forEach(rule => {
    if (rule.type === fieldRules.REQUIRED) {
      rules.push({ required: true, message: rule.message })
    }
  });

  return rules;
}

export const parseInfoByFieldAndRecord = ({
  field,
  record,
}) => {
  const {
    allowValue = {},
  } = field || {};

  const {
    dynamicItemSource = {},
  } = allowValue || {};

  const {
    displayField,
    valueField,
  } = dynamicItemSource || {};

  const info = {
    displayValue: '',
    value: '',
  };

  record = {
    ...(record || {}),
  }

  record = {
    ...record,
    ...(record.record || {}),
  }

  if (displayField) {
    info.displayValue = record[displayField] || '';
  }

  if (valueField) {
    info.value = record[valueField] || '';
  }

  return info;
}

/**
 * 修正Module提交的数据
 * @param {*} {
 *  values: from values
 *  field: module feild
 *  format: 时间格式化
 * }
 */
export const repairModuleFormData = ({ formData, field, format }) => {
  if (!formData || !field) return;
  if (!formData[field.name]) return;
  if (field.viewType === widgets.TEXT) {
    const beforeValue = formData[`prefixBefore${field.name}`] || '';
    const afterValue = formData[`prefixAfter${field.name}`] || '';
    formData[field.name] = `${beforeValue}${formData[field.name] || ''}${afterValue}`;

    delete formData[`prefixBefore${field.name}`];
    delete formData[`prefixAfter${field.name}`];
  } else if (field.viewType === widgets.DATE) {
    format = format || 'YYYY-MM-DD';
    if (format === 'YYYY-MM-DD' || format === 'YYYY-MM' || format === 'YYYY') {
      formData[field.name] = moment(formData[field.name], format).format(format);
    } else {
      formData[field.name] = moment(formData[field.name], format).toISOString();
    }
  } else if (field.viewType === widgets.DATE_RANGE) {
    format = format || 'YYYY-MM-DD';
    const dateRangeValue = formData[field.name] || [];

    const newDateRangeValues = [];
    if (dateRangeValue && Array.isArray(dateRangeValue)) {
      if (dateRangeValue.length > 0 && dateRangeValue[0]) {
        // newDateRangeValues.push(moment(dateRangeValue[0], format).format(format));
        newDateRangeValues.push(moment(dateRangeValue[0], format).toISOString());
      }
      if (dateRangeValue.length > 1 && dateRangeValue[1]) {
        // newDateRangeValues.push(moment(dateRangeValue[1], format).format(format));
        newDateRangeValues.push(moment(dateRangeValue[1], format).toISOString());
      }
    }

    formData[field.name] = newDateRangeValues;
  } else if (field.viewType === widgets.TIMEPICKER) {
    format = format || 'HH:mm:ss';
    formData[field.name] = moment(formData[field.name], format).format(format);
  }
}

const specialRepair = new Set([
  widgets.ONE_TO_ONE,
])

/**
 * 解析并修正Module提交的数据
 * @param {*} param0 {
 *  data: from values
 * }
 */
export const parseModuleFormData = ({
  data,
  module,
  props,
  storeID,
  appID,
  moduleRelationRecords,
  sourceData,
}) => {
  const {
    fields: baseFields = [],
    template,
  } = module || {};

  let {
    moduleParent,
  } = module || {};

  if (lodash.isEmpty(moduleParent)) {
    moduleParent = {
      fields: [],
      template: {
        form: [],
      },
    }
  }

  const {
    fields: moduleParentFields = [],
    template: {
      form: moduleParentForm = [],
    },
  } = moduleParent;

  const {
    form: baseViews = [],
  } = template || {};
  const formViews = [...moduleParentForm, ...baseViews]
  const fields = [...moduleParentFields, ...baseFields]

  const newData = {};
  const formData = { ...data };

  fields.forEach(field => {
    const {
      viewType,
    } = field;

    if (field.name === 'created_at' || field.name === 'updated_at') {
      return;
    }

    let view = {};
    if (
      viewType === widgets.DATE
      || viewType === widgets.DATE_RANGE
      || viewType === widgets.TIMEPICKER
    ) {
      view = findNode(formViews, 'uuid', field.uuid) || {};
    }

    repairModuleFormData({ formData, field, format: view.format });

    // 控件不显示，并且是可编辑的，传默认值
    if (!specialRepair.has(viewType) && !field.invisible && !field.readOnly) {
      // eslint-disable-next-line no-prototype-builtins
      if (!formData.hasOwnProperty(field.name)) {
        newData[field.name] = field.defaultValue;
        return;
      }
    }

    if (field.viewType === widgets.SELECTION && field.allowMultiValue) {
      if (!lodash.isArray(formData[field.name])) {
        formData[field.name] = [];
      }
    }

    if (field.viewType === widgets.BOOLEAN) {
      if (!lodash.isBoolean(formData[field.name])) {
        formData[field.name] = false;
      }
    }

    if (field.viewType === widgets.IMAGE) {
      if (!lodash.startsWith(formData[field.name], 'http')) {
        formData[field.name] = '';
      }
    }

    if (field.viewType === widgets.UPLOAD) {
      if (!lodash.isArray(formData[field.name])) {
        formData[field.name] = [];
      }
    }

    if (field.viewType === widgets.INTEGER_NUMBER) {
      if (!lodash.isInteger(formData[field.name])) {
        formData[field.name] = lodash.toInteger(formData[field.name]);
      }
    }

    if (field.viewType === widgets.DECIMAL_NUMBER) {
      if (!lodash.isNumber(formData[field.name]) && formData[field.name]) {
        formData[field.name] = lodash.toNumber(formData[field.name]);
        // precision不存在field里,且如果是number则无需转换
        // if (formData[field.name]) {
        //   formData[field.name] = lodash.round(formData[field.name], formViews[field.name].precision);
        // }
      }
    }

    // if (field.viewType === widgets.MANY_TO_ONE) {
    //   if (formData[field.name]) {
    //     formData[field.name] = [formData[field.name]];
    //   } else {
    //     formData[field.name] = [];
    //   }
    // }

    if (field.viewType === widgets.MANY_TO_MANY || field.viewType === widgets.ONE_TO_MANY) {
      const newRecords = moduleRelationRecords[`${module.id}_${field.name}`] || [];
      newRecords.forEach(item => {
        delete item.key;
        delete item.$id;
      })
      if (formData[field.name]) {
        formData[field.name] = {
          ids: [...formData[field.name]],
          new_records: newRecords,
        };
        // one2Many 不需要ids
        if (field.viewType === widgets.ONE_TO_MANY) {
          delete formData[field.name].ids
        }
      } else {
        formData[field.name] = {
          new_records: newRecords,
        };
      }
    }

    if (formData[field.name] === undefined) {
      formData[field.name] = null;
    }

    if (
      field.viewType !== widgets.RELATED_FIELD
      && formData[field.name] !== null
      && formData[field.name] !== undefined
    ) {
      newData[field.name] = formData[field.name];
    }

    if (field.viewType === widgets.ONE_TO_ONE) {
      const {
        relation: {
          relatedModuleID = '',
        } = {},
      } = field;

      findModuleByID()
      const relationModule = findModuleByID({
        props,
        storeID,
        moduleID: relatedModuleID,
      })

      if (lodash.isObject(relationModule)) {
        const fieldNamePrefix = `${relatedModuleID}_${field.name}_`;
        const one2OneData = {};
        let hasOne2OneData = false;
        Object.keys(data).forEach(key => {
          if (key.indexOf(fieldNamePrefix) > -1) {
            hasOne2OneData = true;
            const hasOne2OneFieldName = key.replace(fieldNamePrefix, '');
            one2OneData[hasOne2OneFieldName] = data[key];
          }
        });

        const newRecords = parseModuleFormData({
          storeID,
          appID,
          props,
          data: one2OneData,
          module: relationModule,
          moduleRelationRecords,
        })

        if (
          lodash.isObject(sourceData)
          && lodash.isObject(sourceData[field.name])
          && lodash.isString(sourceData[field.name].id)
        ) {
          newRecords.id = sourceData[field.name].id;
        }

        if (hasOne2OneData) {
          newData[field.name] = {
            new_records: [
              newRecords,
            ],
          };
        }
      }
    }

    if (newData[field.name] === undefined) {
      newData[field.name] = null;
    }
    if (newData[field.name] === null || newData[field.name] === undefined) {
      if (sourceData[field.name] === null || sourceData[field.name] === undefined) {
        delete newData[field.name];
      } else if (!lodash.isObject(sourceData[field.name])) {
        newData[field.name] = sourceData[field.name];
      } else if (
        field.viewType === widgets.SELECTION
        || field.viewType === widgets.RADIO
        || field.viewType === widgets.CHECKBOX
        || field.viewType === widgets.MANY_TO_ONE
      ) {
        const {
          value: tempValue,
        } = parseInfoByFieldAndRecord({
          field,
          record: sourceData,
        })
        newData[field.name] = tempValue;
      }
    }
  });

  const app = findApp({
    props,
    storeID,
    appID,
  })

  if (app.type !== common.SYSTEM) {
    delete newData.store_id;
  }

  Object.keys(newData).forEach(key => {
    if (newData[key] === null || newData[key] === undefined) {
      if (sourceData[key] === null || sourceData[key] === undefined) {
        delete newData[key];
      } else {
        newData[key] = sourceData[key];
      }
    }
  });

  return newData;
}

export const filterOption = (input, option) => {
  if (!input) {
    return true;
  }

  if (option.props.children === undefined || option.props.children === null) {
    return false;
  }

  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export const isStaffRole = (props) => {
  const {
    loginUser = {},
  } = props || {};
  const {
    is_staff: isStaff = false,
  } = loginUser || {};

  return (!loginUser || !loginUser.id) || isStaff;
}

export const getFieldInvisible = ({
  field,
  view,
  getFieldValue,
}) => {
  const {
    listens = [],
  } = field;

  const listenList = listens || [];

  let formula = '';
  for (let i = 0; i < listenList.length; i++) {
    const listen = listenList[i];
    if (listen && listen.type === common.INVISIBLE) {
      ({ formula = '' } = listen);
    }
  }

  let formulaValue = true;
  if (lodash.isString(formula) && formula.length > 0) {
    formulaValue = runFormula(formula, {
      selfFieldCallback: fieldName => getFieldValue(fieldName),
    });
  }

  const {
    invisible: fieldInvisible,
  } = field;
  const {
    invisible: viewInvisible,
  } = view;

  return (fieldInvisible || viewInvisible) && formulaValue;
}

export const roleRefScirpt = {
  New: 'CREATE',
  Edit: 'EDIT',
  Delete: 'DELETE',
  View: 'VIEW',
  Import: 'IMPORT',
  Export: 'EXPORT',
  Global: 'GLOBAL',
};

export const getModuleType = (props) => {
  const {
    storeID,
    appID,
    menuID,
  } = parseParams(props);

  const app = findApp({
    props,
    storeID,
    appID,
  })

  if (menuID && app && Array.isArray(app.children)) {
    const menu = findNode(app.children, 'id', menuID);
    if (menu) {
      return menu.type;
    }
  }

  return null;
}

export const repairRecords = ({records, module}) => {
  if (
    !lodash.isArray(records)
    || !lodash.isObject(module)
  ) {
    return;
  }

  const {
    fields = [],
  } = module;

  fields.forEach(field => {
    const {
      viewType,
      allowValue,
      name,
    } = field;
    const {
      dynamicItemSource,
    } = allowValue || {};
    const {
      exportFields = [],
    } = dynamicItemSource || {};
    if (
      viewType === widgets.MANY_TO_ONE
      && name
      && lodash.isArray(exportFields)
      && exportFields.length > 0
    ) {
      records.forEach(item => {
        if (
          lodash.isObject(item)
          && lodash.isObject(item.record)
          && lodash.isObject(item.record[name])
        ) {
          const record = item.record[name];

          if (lodash.isObject(record) && lodash.isObject(record.record)) {
            const tempRecord = {
              ...record,
              ...record.record,
            }

            exportFields.forEach(exportField => {
              if (exportField.destField && exportField.fromField) {
                item.record[exportField.destField] = tempRecord[exportField.fromField]
              }
            })
          }
        }
      })
    }
  })
}

/**
 * 从data中获取指定语言的国际化值
 * getCurrentI18nValue('name', 'chZH', data)
 * @param {*} key data数据中国际化字段名称 ’name‘
 * @param {*} language chZH
 * @param {*} data data{ name: 'name', i18n: {name: {chZH: '名称', enUS: 'name', zhHK: '名稱'}}}
 */
export const getI18nValue = (key, language, data) => {
  if (!key || !data || !data[key]) {
    return '';
  }

  if (!language) {
    return data[key];
  }

  const lng = i18n.language.replace(/-/g, '');

  if (data.i18n && data.i18n[key] && data.i18n[key][lng]) {
    return data.i18n[key][lng];
  }

  return data[key];
}

/**
 * 从data中获取当前语言的国际化值
 * getCurrentI18nValue('name', data)
 * @param {*} key data数据中国际化字段名称 ’name‘
 * @param {*} data data{ name: 'name', i18n: {name: {chZH: '名称', enUS: 'name', zhHK: '名稱'}}}
 */
export const getCurrentI18nValue = (key, data) => getI18nValue(key, i18n.language, data);

/**
 * 当路由中没有slug时，跳转到左侧菜单栏的第一个菜单
 * @param {*} props react组件中的props
 */
export const gotoDashboard = (props) => {
  const {
    history,
    dispatch,
    storesIDRefSlug,
    storesSlugRefID,
  } = props;
  const {
    slug,
    appID,
    storeSlugs,
  } = parseParams(props);
  const storesApps = [];

  if (slug && appID) {
    const app = findApp({
      props,
      storeID: storesSlugRefID.get(slug),
      appID,
    });
    storesApps.push(app);
  } else {
    storesApps.push(
      ...findStoresAppsBySlugs({
        props,
        slugs: storeSlugs,
      })
    );
  }

  const menuBranch = findMenuBranch(storesApps);
  const {
    menu = null,
    openMenuKeys = [],
  } = parseMenuBranch(menuBranch);
  if (menu) {
    const newSlug = storesIDRefSlug.get(menu.inStoreID);
    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        openMenuKeys,
      },
    });
    history.push({
      pathname: createMenuUrl(
        menu,
        {
          galaxyState: common.DASHBOARD,
          storeSlugs: storeSlugs.join(','),
          slug: newSlug,
        },
      ),
    });
  } else {
    history.push({
      pathname: createRouteUrl(
        slug && appID ? routes.APP_WELCOME : routes.WELCOME,
        {
          galaxyState: common.DASHBOARD,
          storeSlugs: storeSlugs.join(','),
          slug,
          appID,
        },
      ),
    });
  }
}

/**
 * 初始化Module权限Map
 */
export const initModulePermissionMap = () => {
  const permissionMap = new Map();
  permissionMap.set(galaxyConstant.ACTIONS, new Set());
  permissionMap.set(galaxyConstant.SCRIPT_NAMES, new Set());

  return permissionMap;
}

/**
 * 获取当前用户拥有对Module的操作权限
 * @param {*} props react组件中的props
 */
export const getModulePermissionsMap = ({
  props,
}) => {
  const permissionMap = initModulePermissionMap();

  const {
    storesMap,
    storesModulesPermissionsMap,
  } = props;

  const {
    storeID,
    appID,
    moduleID,
    slug,
  } = parseParams(props);

  let storeModulesPermissionsMap
  if (lodash.isMap(storesModulesPermissionsMap)) {
    storeModulesPermissionsMap = storesModulesPermissionsMap.get(storeID);
  }

  let appModulesPermissionsMap
  if (lodash.isMap(storeModulesPermissionsMap)) {
    appModulesPermissionsMap = storeModulesPermissionsMap.get(appID);
  }

  let modulePermissions
  if (lodash.isMap(appModulesPermissionsMap)) {
    modulePermissions = appModulesPermissionsMap.get(moduleID);
  }

  let store
  if (lodash.isMap(storesMap)) {
    store = storesMap.get(slug);
  }

  const {
    roleType,
  } = store || {};

  let permission;
  if (Array.isArray(modulePermissions) && roleType) {
    for (let i = 0; i < modulePermissions.length; i++) {
      const tempPermission = modulePermissions[i];
      // eslint-disable-next-line
      if (tempPermission.storeRoleID == roleType) {
        permission = tempPermission;
        break;
      }
    }
  }

  const {
    actions = [],
    scriptNames = [],
  } = permission || {};

  if (Array.isArray(actions)) {
    permissionMap.set(galaxyConstant.ACTIONS, new Set(actions));
  }

  if (Array.isArray(scriptNames)) {
    permissionMap.set(galaxyConstant.SCRIPT_NAMES, new Set(scriptNames));
  }

  return permissionMap
}

const checkAuthValue = ({
  storeID,
  roleID,
  appID,
  destID,
  destIDKey,
  existingPermissions,
}) => {
  for (let i = 0; i < existingPermissions.length; i++) {
    const permission = existingPermissions[i];
    if (
      permission.storeID === storeID
      && permission.storeRoleID === roleID
      && permission.appID === appID
      && permission[destIDKey] === destID
    ) {
      return {
        permissionID: permission.id,
        scriptNames: new Set(permission.scriptNames || []),
        actions: new Set(permission.actions || []),
      };
    }
  }

  return {
    scriptNames: new Set([]),
    actions: new Set([]),
  }
}

const getScirptKeyValue = (authValues, funcBtn) => {
  let key = funcBtn.scriptName;
  let value = false;
  if (funcBtn.type === common.DEFAULT) {
    key = roleRefScirpt[funcBtn.scriptName];
    value = authValues.actions.has(key);
  } else {
    value = authValues.scriptNames.has(key);
  }

  return {
    key,
    value,
  }
}

const parseRolesAndAuths = ({
  module,
  modules,
  rolesRecords = [],
  existingPermissions = [],
}) => {
  rolesRecords.forEach(role => {
    const roleAuth = {
      id: role.id,
      uuid: createUuid(),
      name: role.name,
    }

    let authValues = null;

    if (module.type === common.MODULE) {
      roleAuth.permissions = [];

      const moduleTemp = findNode(modules, 'id', module.moduleID);
      const {
        template,
      } = moduleTemp || {};
      const {
        funcBtns,
      } = template || {};
      let {
        form = [],
        list = [],
      } = funcBtns || {};
      form = form || [];
      list = list || [];

      authValues = checkAuthValue({
        storeID: module.storeID,
        roleID: role.id,
        appID: module.appID,
        destID: module.moduleID,
        destIDKey: 'moduleID',
        existingPermissions,
      });

      form.forEach(item => {
        if (lodash.isString(item.scriptName) && item.scriptName.length > 0) {
          roleAuth.permissions.push({
            title: item.title,
            ...getScirptKeyValue(authValues, item),
            type: item.type,
            uuid: createUuid(),
          })
        }
      });
      list.forEach(item => {
        if (lodash.isString(item.scriptName) && item.scriptName.length > 0) {
          roleAuth.permissions.push({
            title: item.title,
            ...getScirptKeyValue(authValues, item),
            type: item.type,
            uuid: createUuid(),
          })
        }
      });
    } else if (module.type === common.SETTING) {
      authValues = checkAuthValue({
        storeID: module.storeID,
        roleID: role.id,
        appID: module.appID,
        destID: module.moduleID,
        destIDKey: 'moduleID',
        existingPermissions,
      });
      roleAuth.permissions = [{
        title: 'common:editor.view',
        key: 'VIEW',
        value: authValues.actions.has('VIEW'),
        type: common.DEFAULT,
        uuid: createUuid(),
      }, {
        title: 'common:editor.edit',
        key: 'EDIT',
        value: authValues.actions.has('EDIT'),
        type: common.DEFAULT,
        uuid: createUuid(),
      }];
    } else if (module.type === common.EMBEDDED || module.type === common.WIKI_ONLY) {
      authValues = checkAuthValue({
        storeID: module.storeID,
        roleID: role.id,
        appID: module.appID,
        destID: module.menuID,
        destIDKey: 'menuID',
        existingPermissions,
      });
      roleAuth.permissions = [{
        title: 'common:editor.view',
        key: 'VIEW',
        value: authValues.actions.has('VIEW'),
        type: common.DEFAULT,
        uuid: createUuid(),
      }];
    }

    if (roleAuth.permissions && roleAuth.permissions.length > 0) {
      roleAuth.permissionID = authValues.permissionID;
      module.roles.push(roleAuth)
    }
  })
}

const MenuTypes = new Set([
  common.MODULE,
  common.SETTING,
  common.EMBEDDED,
  common.WIKI_ONLY,
]);

/**
 * 获取当前store的roles信息
 * @param {*} storesRolesMap react中的props
 */
export const parseStoreRoles = ({props, storeID}) => {
  const {
    storesRolesMap,
  } = props;

  const roles = [];

  let currentStoreRoles
  if (lodash.isMap(storesRolesMap)) {
    currentStoreRoles = storesRolesMap.get(storeID);
  }

  if (lodash.isMap(currentStoreRoles)) {
    roles.push(...currentStoreRoles.values())
  }

  return roles;
}

const parseMenuTreeToLine = (menusTree, menus) => {
  if (!Array.isArray(menusTree) || !Array.isArray(menus)) {
    return
  }

  menusTree.forEach(item => {
    if (MenuTypes.has(item.type)) {
      menus.push(item);
    }

    if (Array.isArray(item.children)) {
      parseMenuTreeToLine(item.children, menus);
    }
  })
}

/**
 * 获取应用权限信息
 * @param {*} props
 */
export const getAppAuthInfo = (props) => {
  const authInfo = [];

  const {
    storeID,
    appID,
  } = parseParams(props);

  const {
    storesModulesPermissionsMap,
  } = props;

  let storeModulesPermissionsMap;
  if (lodash.isMap(storesModulesPermissionsMap)) {
    storeModulesPermissionsMap = storesModulesPermissionsMap.get(storeID);
  }

  let appModulesPermissionsMap;
  if (lodash.isMap(storeModulesPermissionsMap)) {
    appModulesPermissionsMap = storeModulesPermissionsMap.get(appID);
  }

  const app = findApp({
    props,
    storeID,
    appID,
  })

  if (!app || !app.id) {
    return authInfo
  }

  const menusTree = app.children || [];
  const menus = [];
  parseMenuTreeToLine(menusTree, menus);

  const appAuth = {
    appID: app.id,
    storeID: app.inStoreID,
    name: app.name,
    modules: [],
  }

  const modules = [];

  const appModules = findAppModules({
    props,
    storeID,
    appID,
  });

  const rolesRecords = parseStoreRoles({
    props,
    storeID,
  });

  menus.forEach(model => {
    // module setting iframe
    const itemModel = {
      menuID: model.id,
      appID: app.id,
      storeID: app.inStoreID,
      name: model.name,
      type: model.type,
      moduleID: model.moduleID,
      roles: [],
    }

    let existingPermissions = [];
    if (lodash.isMap(appModulesPermissionsMap)) {
      let destIDKey = 'moduleID';
      if (model.type === common.EMBEDDED || model.type === common.WIKI_ONLY) {
        destIDKey = 'menuID';
      }
      existingPermissions = appModulesPermissionsMap.get(model[destIDKey]);
    }

    if (!Array.isArray(existingPermissions)) {
      existingPermissions = []
    }

    parseRolesAndAuths({
      module: itemModel,
      modules: appModules,
      rolesRecords,
      existingPermissions,
    });

    if (itemModel.roles.length > 0) {
      modules.push(itemModel);
    }
  })

  appAuth.modules = modules;

  authInfo.push(appAuth);

  return authInfo;
}
