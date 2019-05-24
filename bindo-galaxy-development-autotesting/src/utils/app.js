import lodash from 'lodash';
import common from '../constants/common';

/**
 * 处理并拷贝App, 返回全新的App
 * @param {*} app
 * @param {*} storeID
 */
export const handleAndCloneApp = ({
  app,
  storeID,
}) => {
  const newApp = lodash.cloneDeep(app);
  newApp.inStoreID = storeID;
  newApp.$type = common.APP;

  return newApp;
};

/**
 * 从store中获取用户店铺中的所有Apps
 * @param {*} props react组件中的props
 * @param {*} slugs 路由中的storeSlugs
 */
export const findStoresAppsBySlugs = ({
  props,
  slugs = [],
}) => {
  const storesApps = [];

  const {
    storesSlugRefID,
    storesAppsMap,
  } = props;

  slugs.forEach(slug => {
    const storeID = storesSlugRefID.get(slug);
    let storeAppsMap;
    if (storeID) {
      storeAppsMap = storesAppsMap.get(storeID);
    }

    let storeApps;
    if (storeAppsMap) {
      storeApps = [...storeAppsMap.values()];
    }

    if (storeApps && storeApps.length > 0) {
      storesApps.push(...storeApps);
    }
  });

  return storesApps;
};

/**
 * 从storesAppsMap获取店下的appsMap(appID -> App Object)
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 */
export const findStoreAppsMap = ({
  props,
  storeID,
}) => {
  let storeAppsMap;

  const {
    storesAppsMap,
  } = props || {};

  if (lodash.isMap(storesAppsMap)) {
    storeAppsMap = storesAppsMap.get(storeID);
  }

  if (!lodash.isMap(storeAppsMap)) {
    storeAppsMap = new Map();
  }

  return storeAppsMap;
}

/**
 * 从storesAppsMap获取店铺下的apps，返回app数组
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 */
export const findStoreApps = ({
  props,
  storeID,
}) => {
  const apps = [];

  const storeAppsMap = findStoreAppsMap({
    props,
    storeID,
  });

  if (lodash.isMap(storeAppsMap)) {
    apps.push(...storeAppsMap.values())
  }

  return apps;
}

/**
 * 从storesAppsMap获取app
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 */
export const findApp = ({
  props,
  storeID,
  appID,
}) => {
  let app = null;

  const storeAppsMap = findStoreAppsMap({
    props,
    storeID,
  });

  if (lodash.isMap(storeAppsMap)) {
    app = storeAppsMap.get(appID);
  }

  return app;
}

/**
 * 插入app到storesAppsMap集合中
 * @param {*} app 需要插入的应用
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const insertAppIntoStoresAppsMap = ({
  app,
  storesAppsMap,
}) => {
  const {
    id,
    inStoreID: storeID,
  } = app || {};

  let appsMap = null;
  if (storeID) {
    appsMap = storesAppsMap.get(storeID);

    if (!lodash.isMap(appsMap)) {
      appsMap = new Map();
      storesAppsMap.set(storeID, appsMap);
    }
  }

  if (id && lodash.isMap(appsMap)) {
    appsMap.set(id, app);
  }
}

/**
 * 插入app到storesAppsMap集合中
 * @param {*} app 需要更新的应用
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const updateAppIntoStoresAppsMap = ({
  app,
  storesAppsMap,
}) => {
  const {
    id,
    inStoreID: storeID,
  } = app || {};

  let appsMap = null;
  if (storeID) {
    appsMap = storesAppsMap.get(storeID);

    if (!lodash.isMap(appsMap)) {
      appsMap = new Map();
      storesAppsMap.set(storeID, appsMap);
    }
  }

  let targetApp;
  if (id && lodash.isMap(appsMap)) {
    targetApp = appsMap.get(id);
  }

  if (lodash.isObject(app) && lodash.isObject(targetApp)) {
    Object.keys(app).forEach(key => {
      targetApp[key] = app[key];
    });
  }
}

/**
 * 根据storeID和appID，从storesAppsMap集合中移除app
 * @param {*} storeID 店铺ID
 * @param {*} appID 需要移除应用的ID
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const removeAppFromStoresAppsMap = ({
  storeID,
  appID,
  storesAppsMap,
}) => {
  let appsMap = null;
  if (storeID) {
    appsMap = storesAppsMap.get(storeID)
  }

  if (lodash.isMap(appsMap)) {
    appsMap.delete(appID);
  }
}

/**
 * 根据条件，更新app下的children(menus)到storesAppsMap集合中
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 * @param {*} children menus菜单
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const replaceAppChildrenIntoStoresAppsMap = ({
  storeID,
  appID,
  children,
  storesAppsMap,
}) => {
  let appsMap = null;
  if (storeID) {
    appsMap = storesAppsMap.get(storeID);
  }

  let targetApp;
  if (appID && lodash.isMap(appsMap)) {
    targetApp = appsMap.get(appID);
  }

  if (lodash.isObject(targetApp) && targetApp.id && Array.isArray(children)) {
    targetApp.children = children
  }
}

/**
 * 根据storeID和appID，从storesAppsMap集合中移除app
 * @param {*} storeID 店铺ID
 * @param {*} positions 需要排序的应用位置信息
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const sortingAppsFromStoresAppsMap = ({
  storeID,
  positions,
  storesAppsMap,
}) => {
  if (!Array.isArray(positions)) {
    return;
  }
  let appsMap = null;
  if (storeID) {
    appsMap = storesAppsMap.get(storeID)
  }

  const newAppsMap = new Map();
  positions.forEach(item => {
    const app = appsMap.get(item.id);

    if (app) {
      newAppsMap.set(item.id, app);
    }
  });

  storesAppsMap.set(storeID, newAppsMap);
}
