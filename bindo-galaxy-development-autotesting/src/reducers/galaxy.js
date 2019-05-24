import {
  handleActions,
} from 'redux-actions'
import reduxKey from '../constants/reduxKey'
import operateKey from '../constants/operateKey'
import {
  insertAppIntoStoresAppsMap,
  updateAppIntoStoresAppsMap,
  removeAppFromStoresAppsMap,
  sortingAppsFromStoresAppsMap,
  replaceAppChildrenIntoStoresAppsMap,
} from '../utils/app'
import {
  insertMenuIntoStoresAppsMap,
  updateMenuIntoStoresAppsMap,
  removeMenuFromStoresAppsMap,
} from '../utils/menu'
import {
  insertModuleIntoStoresAppsModulesMap,
  updateModuleIntoStoresAppsModulesMap,
} from '../utils/module'

const initState = {
  storesMap: new Map(), // 当前登录用户的店铺（slug -> store）
  loginUser: {}, // 当前登录用户信息
  storesIDRefSlug: new Map(), // storeID和storeSlug映射关系
  storesSlugRefID: new Map(), // storeSlug和storeID映射关系
  storesAppsMap: new Map(), // 应用和菜单信息
  openMenuKeys: [], // 左侧展开的菜单标识
  roleModule: {}, // 角色Module
  storesAppsModulesMap: new Map(), // 当前用户店铺下的Module列表
  storesModulesPermissionsMap: new Map(), // 当前用户店铺下的Module权限信息
  storesRolesMap: new Map(), // 当前用户店铺下的所有角色信息
  bindoTablesMap: new Map(), // bindo数据库表信息
  loadingContent: false, // 加载内容时显示骨架屏Skeleton
  permissionsAndModulesDone: false, // 权限和modules加载完成
  galaxyLoading: false,
  searchFilter: {},
  relationRecords: {},
}

export default handleActions({
  [reduxKey.UPDATE_GALAXY_REDUCER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [reduxKey.UPDATE_APP_STORES_APPS_MAP]: (state, { payload }) => {
    const { storesAppsMap } = state;
    const newStoresAppsMap = new Map(storesAppsMap);

    let appsOperateArray = [];
    if (Array.isArray(payload) && payload.length > 0) {
      appsOperateArray = payload;
    }

    appsOperateArray.forEach(item => {
      if (item.operate === operateKey.INSERT) {
        insertAppIntoStoresAppsMap({
          app: item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.UPDATE) {
        updateAppIntoStoresAppsMap({
          app: item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.REMOVE) {
        removeAppFromStoresAppsMap({
          ...item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.SORTING) {
        sortingAppsFromStoresAppsMap({
          ...item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.REPLACE_CHILDREN) {
        replaceAppChildrenIntoStoresAppsMap({
          ...item.data,
          storesAppsMap: newStoresAppsMap,
        })
      }
    });

    return {
      ...state,
      storesAppsMap: newStoresAppsMap,
    }
  },
  [reduxKey.UPDATE_MENU_STORES_APPS_MAP]: (state, { payload }) => {
    const { storesAppsMap } = state;
    const newStoresAppsMap = new Map(storesAppsMap);

    let appsOperateArray = [];
    if (Array.isArray(payload) && payload.length > 0) {
      appsOperateArray = payload;
    }

    appsOperateArray.forEach(item => {
      if (item.operate === operateKey.INSERT) {
        insertMenuIntoStoresAppsMap({
          menu: item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.UPDATE) {
        updateMenuIntoStoresAppsMap({
          menu: item.data,
          storesAppsMap: newStoresAppsMap,
        })
      } else if (item.operate === operateKey.REMOVE) {
        removeMenuFromStoresAppsMap({
          ...item.data,
          storesAppsMap: newStoresAppsMap,
        })
      }
    });

    return {
      ...state,
      storesAppsMap: newStoresAppsMap,
    }
  },
  [reduxKey.UPDATE_MODULE_STORES_APPS_MODULES_MAP]: (state, { payload }) => {
    const { storesAppsModulesMap } = state;
    const newStoresAppsModulesMap = new Map(storesAppsModulesMap);

    let appsOperateArray = [];
    if (Array.isArray(payload) && payload.length > 0) {
      appsOperateArray = payload;
    }

    appsOperateArray.forEach(item => {
      if (item.operate === operateKey.INSERT) {
        insertModuleIntoStoresAppsModulesMap({
          module: item.data,
          storesAppsModulesMap: newStoresAppsModulesMap,
        })
      } else if (item.operate === operateKey.UPDATE) {
        updateModuleIntoStoresAppsModulesMap({
          module: item.data,
          storesAppsModulesMap: newStoresAppsModulesMap,
        })
      }
    });

    return {
      ...state,
      storesAppsModulesMap: newStoresAppsModulesMap,
    }
  },
  [reduxKey.SET_OPEN_MENU_KEYS]: (state, { payload }) => ({
    ...state,
    openMenuKeys: payload,
  }),
  [reduxKey.UPDATE_RELATION_RECORDS]: (state, { payload }) => {
    const {
      relationRecords = {},
    } = state;

    return {
      ...state,
      relationRecords: {
        ...relationRecords,
        ...payload,
      },
    }
  },
  [reduxKey.CLEAR_RELATION_RECORDS]: (state) => ({
    ...state,
    relationRecords: {},
  }),
}, initState);
