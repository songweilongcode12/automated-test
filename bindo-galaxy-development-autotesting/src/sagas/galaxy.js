import { all, call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import lodash from 'lodash';
import urls from '../constants/urls';
import reduxKey from '../constants/reduxKey';
import {
  findMenuBranch,
  toTree,
  parseMenuBranch,
} from '../utils/menu';
import {
  queryStoresApps,
  queryStoresPermissions,
} from '../data/graphql/app';
import {
  queryStoresMenus,
} from '../data/graphql/menu';
import {
  queryStoresModules,
  searchStoresModules,
  queryTables,
} from '../data/graphql/module';
import {
  queryRecords,
  moduleRecordImportCreate,
  moduleRecordImportCheck,
  moduleRecordImportTemplate,
} from '../data/graphql/record'

function* handleModuleRecordImportCreate({payload}){
  const {
    storeID,
    moduleID,
    importUrl = '',
    callback,
  } = payload;
  if(!storeID || !moduleID || !importUrl){
    return;
  }
  const res = yield moduleRecordImportCreate({
    storeID,
    moduleID,
    importUrl,
  });
  if(typeof callback === 'function'){
    callback(res);
  }
}

function* handleModuleRecordImportCheck({payload}){
  const {
    storeID,
    moduleID,
    importID = '',
    callback,
  } = payload;
  if(!storeID || !moduleID || !importID){
    return;
  }
  const res = yield moduleRecordImportCheck({
    storeID,
    moduleID,
    importID,
  });
  if(typeof callback === 'function'){
    callback(res);
  }
}

function* handleModuleRecordImportTemplate({payload}){
  const {
    storeID,
    moduleID,
    callback,
  } = payload;
  if(!storeID || !moduleID){
    return;
  }
  const res = yield moduleRecordImportTemplate({
    storeID,
    moduleID,
  });
  if(typeof callback === 'function'){
    callback(res);
  }
}

/** haidi start */
function* handleQueryStoresApps({ payload }) {
  const timeStart = new Date();
  log.info('Start loading all applications');
  const {
    storesMap = new Map(),
    storesIDRefSlug = new Map(),
    storesSlugRefID = new Map(),
    storesAppsMap = new Map(),
    storesAppsModulesMap = new Map(),
    storesModulesPermissionsMap = new Map(),
    storesRolesMap = new Map(),
    roleModule = {},
    loginUser = {},
    storeSlug = null,
    storeSlugs = [],
    menuID = null,
    callback,
  } = payload || {};
  try {
    const preCallArray = [];

    let isCallStores = false;
    let storesIndex = 0;
    // 判断是否需要从后台获取店铺列表
    if (storesMap.size < 1) {
      isCallStores = true;
      storesIndex = preCallArray.length;
      preCallArray.push(
        call(axios.get, `${urls.stores}?per_page=99`)
      );
    }

    let isCallMe = false;
    let meIndex = 0;
    // 判断是否需要从后台获取用户的登录信息
    if (!lodash.isObject(loginUser) || !loginUser.id) {
      isCallMe = true;
      meIndex = preCallArray.length;
      preCallArray.push(
        call(axios.get, urls.currentUser)
      );
    }

    const preData = yield all(preCallArray);

    const putPayload = {
      storesMap,
    };

    // 通过api获取店铺信息，并把信息写入storesMap，storesIDRefSlug，storesSlugRefID
    if (isCallStores) {
      const stores = preData[storesIndex] || [];
      stores.forEach(item => {
        const { store } = item || {};
        // chain店的数据不允许修改，不应该出现在Module Builder
        // slug和id是一一对应的，页面路由使用slug, 操作数据使用id
        if (lodash.isObject(store) && store.chain === false && store.id && store.slug) {
          storesMap.set(store.slug, {
            slug: store.slug,
            id: store.id,
            title: store.title,
            roleName: store.associate_type,
            roleType: store.associate_type_id,
            // TODO 此处写死,注意修改-------
            // roleType: 1,
            // roleName: 'MANAGER',
          });
          storesIDRefSlug.set(store.id, store.slug);
          storesSlugRefID.set(store.slug, store.id);
        }

      });
      putPayload.storesMap = storesMap;
      putPayload.storesIDRefSlug = storesIDRefSlug;
      putPayload.storesSlugRefID = storesSlugRefID;
    }

    // 获取登录用户信息，并写入loginUser
    if (isCallMe) {
      const me = preData[meIndex] || {};
      if (lodash.isObject(me) && lodash.isObject(me.user) && me.user.id) {
        putPayload.loginUser = me.user;
      }
    }

    let currentStoreID = storesSlugRefID.get(storeSlug);

    const storeIDs = [];
    storesSlugRefID.forEach(storeID => {
      if (!storesAppsMap.has(storeID)) {
        storeIDs.push(storeID);
      }
    });

    const [
      newStoresAppsMap,
      storesMenusMap,
    ] = yield all([
      queryStoresApps({ storeIDs }),
      queryStoresMenus({ storeIDs }),
    ]);

    let firstMenu = null;

    // 把Menus插入对应的App中, 并查询出第一个菜单项
    newStoresAppsMap.forEach((storeAppsMap, storeID) => {
      let appsMenusMap = new Map();
      if (storesMenusMap.has(storeID)) {
        appsMenusMap = storesMenusMap.get(storeID);
      }

      appsMenusMap.forEach((appMenus, appID) => {
        const storeApp = storeAppsMap.get(appID);
        if (storeApp && storeApp.id && Array.isArray(appMenus)) {
          storeApp.children = toTree(appMenus);

          if (
            !firstMenu
            && (
              !storeSlugs
              || storeSlugs.length < 1
              || (storeSlugs.length > 0 && storeSlugs.indexOf(storesIDRefSlug.get(storeApp.inStoreID)) > -1)
            )
          ) {
            const menuBranch = findMenuBranch(storeApp.children, menuID);
            const {
              menu = null,
              openMenuKeys = [],
            } = parseMenuBranch(menuBranch);

            if (menu && menu.id) {
              firstMenu = menu;
              if (!currentStoreID) {
                currentStoreID = menu.inStoreID;
              }

              if (Array.isArray(openMenuKeys)) {
                openMenuKeys.unshift(`${storeApp.inStoreID}_${appID}`);
                putPayload.openMenuKeys = openMenuKeys;
              }
            }
          }
        }

        storesAppsMap.set(storeID, storeAppsMap);
      })
    });

    putPayload.storesAppsMap = storesAppsMap;

    log.info(`Get permission information for "storeID: ${currentStoreID}"`);
    if (currentStoreID) {
      yield put({
        type: reduxKey.QUERY_USER_STORES_PERMISSIONS,
        payload: {
          storeIDs: [currentStoreID],
          storesAppsModulesMap,
          storesModulesPermissionsMap,
          storesRolesMap,
          roleModule,
        },
      });
    }
    yield put({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: putPayload,
    });

    if (typeof callback === 'function') {
      callback({
        menu: firstMenu,
        storesMap,
      })
    }
  } catch (error) {
    log.error(error);
  }

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  log.info(`Finish loading all applications after ${time} ms`);
}

function* handleQueryUserStoresPermissions({ payload }) {
  const timeStart = new Date();
  log.info('Start loading the current user\'s store permissions');
  const {
    storeIDs = [],
    storesAppsModulesMap = new Map(),
    storesModulesPermissionsMap = new Map(),
    storesRolesMap = new Map(),
    roleModule,
  } = payload || {};

  if (!Array.isArray(storeIDs) || storeIDs.length < 1) {
    log.info('The storeIDs are empty arrays.');
    return;
  }
  log.info(`storeIDs: ${storeIDs}`);
  try {
    const putPayload = {
      permissionsAndModulesDone: true,
      storesAppsModulesMap: new Map(storesAppsModulesMap),
      storesModulesPermissionsMap: new Map(storesModulesPermissionsMap),
      storesRolesMap: new Map(storesRolesMap),
      roleModule,
    };

    const queryModulesStoreIDs = [];
    const queryPermissionsStoreIDs = [];
    const queryRolesStoreIDs = [];
    storeIDs.forEach(storeID => {
      if (!storesAppsModulesMap.get(storeID)) {
        queryModulesStoreIDs.push(storeID)
      }
      if (!storesModulesPermissionsMap.get(storeID)) {
        queryPermissionsStoreIDs.push(storeID)
      }
      if (!storesRolesMap.get(storeID)) {
        queryRolesStoreIDs.push(storeID)
      }
    });

    // 获取Modules数据
    if (queryModulesStoreIDs.length > 0) {
      const storesModulesMap = yield queryStoresModules({
        storeIDs: queryModulesStoreIDs,
      });

      storesModulesMap.forEach(
        (item, key) => putPayload.storesAppsModulesMap.set(key, item)
      );
    }

    // 获取权限数据
    if (queryPermissionsStoreIDs.length > 0) {
      const storesPermissionsMap = yield queryStoresPermissions({
        storeIDs: queryPermissionsStoreIDs,
      });

      storesPermissionsMap.forEach(
        (item, key) => putPayload.storesModulesPermissionsMap.set(key, item)
      );
    }

    // 获取角色Module
    if (!roleModule || !roleModule.id) {
      const roleModules = yield searchStoresModules({
        storeIDs,
        search: {
          page: 1,
          perPage: 200,
          formulas: [{formula: "IN(alias, ['store_roles'])"}],
        },
      });

      let newRoleModule = putPayload.roleModule;
      if (Array.isArray(roleModules) && roleModules.length > 0) {
        [newRoleModule] = roleModules;
      }

      if (newRoleModule && newRoleModule.id) {
        putPayload.roleModule = newRoleModule;
      }
    }

    if (putPayload.roleModule && putPayload.roleModule.id && queryRolesStoreIDs.length > 0) {
      const queryRolesRecords = [];
      queryRolesStoreIDs.forEach(storeID => {
        queryRolesRecords.push(queryRecords({
          storeID,
          moduleID: putPayload.roleModule.id,
          search: {
            orderAsc: 'DESC',
            page: 1,
            perPage: 100,
          },
        }));
      })

      const rolesRecordsData = yield all(queryRolesRecords);
      rolesRecordsData.forEach((item, index) => {
        if (item && Array.isArray(item.recordLists)) {
          putPayload.storesRolesMap.set(queryRolesStoreIDs[index], new Map());
          item.recordLists.forEach(roleRecord => {
            if (lodash.isObject(roleRecord) && lodash.isObject(roleRecord.record)) {
              putPayload.storesRolesMap.get(queryRolesStoreIDs[index]).set(
                roleRecord.id,
                {
                  id: roleRecord.id,
                  name: roleRecord.record.name,
                }
              )
            }
          })
        }
      })
    }

    yield put.resolve({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: putPayload,
    });
  } catch (error) {
    log.error(error);
  }

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  log.info(`Finish loading the current user's store permissions  after ${time} ms`);
}

function* handleQueryBindoTables({ payload }) {
  log.info('Query the bindo database tables');
  const {
    storeID,
    bindoTablesMap = new Map(),
    callback = () => {},
  } = payload || {};

  if (!storeID) {
    log.info('storeID is empty');
    return;
  }

  if (bindoTablesMap.size > 0) {
    return;
  }
  try {
    const tables = yield queryTables({ storeID });

    tables.forEach(table => {
      const { database } = table;
      if (!bindoTablesMap.has(database)) {
        bindoTablesMap.set(database, {
          value: database,
          label: database,
          children: [],
        });
      }

      bindoTablesMap.get(database).children.push({
        ...table,
        value: table.name,
        label: table.name,
      });
    });

    yield put.resolve({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        bindoTablesMap,
      },
    });

    if (typeof callback === 'function') {
      callback();
    }
  } catch (error) {
    log.error(error);
  }
}

function* handleReloadStorePermissions({ payload }) {
  const {
    storeIDs = [],
    storesModulesPermissionsMap = new Map(),
  } = payload || {};

  if (!Array.isArray(storeIDs) || storeIDs.length < 1) {
    return;
  }

  const putPayload = {
    storesModulesPermissionsMap: new Map(storesModulesPermissionsMap),
  };

  try {
    // 获取权限数据
    const storesPermissionsMap = yield queryStoresPermissions({
      storeIDs,
    });

    storesPermissionsMap.forEach(
      (item, key) => putPayload.storesModulesPermissionsMap.set(key, item)
    );

    yield put.resolve({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: putPayload,
    });
  } catch (error) {
    log.error(error);
  }
}
/** haidi end */

function* watchGalaxy() {
  /** haidi start */
  yield takeEvery(reduxKey.QUERY_STORES_APPS, handleQueryStoresApps);
  yield takeEvery(reduxKey.QUERY_USER_STORES_PERMISSIONS, handleQueryUserStoresPermissions);
  yield takeEvery(reduxKey.QUERY_BINDO_TABLES, handleQueryBindoTables);
  yield takeEvery(reduxKey.RELOAD_STORE_PERMISSIONS, handleReloadStorePermissions);
  /** haidi end */

  yield takeEvery(reduxKey.MODULE_RECORD_IMPORT_CREATE, handleModuleRecordImportCreate);
  yield takeEvery(reduxKey.MODULE_RECORD_IMPORT_CHECK, handleModuleRecordImportCheck);
  yield takeEvery(reduxKey.MODULE_RECORD_IMPORT_TEMPLATE, handleModuleRecordImportTemplate);
}

export default watchGalaxy();
