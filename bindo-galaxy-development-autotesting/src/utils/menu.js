import lodash from 'lodash'
import common from '../constants/common'
import {
  findStoreAppsMap, findApp,
} from './app'
import {
  findNode,
} from './index'

const itemTypes = new Set([
  common.MODULE,
  common.SETTING,
  common.EMBEDDED,
  common.WIKI_ONLY,
]);

/**
 * 处理并拷贝Menu, 返回全新的Menu
 * @param {*} menu
 * @param {*} storeID
 */
export const handleAndCloneMenu = ({
  menu,
  storeID,
}) => {
  const newMenu = lodash.cloneDeep(menu);

  newMenu.inStoreID = storeID;
  newMenu.key = `${storeID}_${menu.id}`;

  const {
    position,
    newPosition,
    parentID,
    newParentID,
  } = newMenu;

  newMenu.realPosition = position;
  if (newPosition) {
    newMenu.realPosition = newPosition;
  }

  newMenu.realParentID = parentID;
  if (newParentID) {
    newMenu.realParentID = newParentID;
  }

  return newMenu;
}

export const findMenuBranch = (menuList, menuID) => {

  for (let i = 0; i < menuList.length; i++) {
    const menu = menuList[i];
    if(menu === undefined){
      return null;
    }

    if (menu.type === common.SUBMENU || menu.$type === common.APP) {
      let menus = null;
      if (menu.children && menu.children.length > 0) {
        menus = findMenuBranch(menu.children, menuID);
      }

      if (menus) {
        return [menu, ...menus]
      }
    } else if (itemTypes.has(menu.type)) {
      if (menu.id === menuID || !menuID) {
        return [menu];
      }
    }
  }

  return null;
}

export const parseMenuBranch = (menuBranch) => {
  const openMenuKeys = [];
  let menu = null;

  if (menuBranch && Array.isArray(menuBranch)) {
    const len = menuBranch.length;
    for (let i = 0; i < len; i++) {
      if (i !== len - 1) {
        openMenuKeys.push(`${menuBranch[i].inStoreID}_${menuBranch[i].id}`);
      }
    }

    if (len > 0) {
      menu = menuBranch[len - 1];
    }
  }

  return {menu, openMenuKeys};
}

/**
 * 把菜单数组转为树形数据结构
 * @param {*} menuList
 */
export const toTree = (menuList = []) => {

  if (!menuList) {
    return [];
  }

  menuList = menuList.sort((menu1, menu2) => {
    if (menu1.realPosition < menu2.realPosition) {
      return -1;
    } else if (menu1.realPosition > menu2.realPosition) {
      return 1;
    } else {
      return 0;
    }
  });

  const newChildren = [];
  const menuMap = {};
  for (let j = 0; j < menuList.length; j++) {
    const menu = menuList[j];

    if (menu.realParentID === '0') {
      newChildren.push(menu);
    }

    delete menu.children;
    menuMap[menu.id] = menu;
  }

  for (let j = 0; j < menuList.length; j++) {
    const { realParentID } = menuList[j];

    if (menuMap[realParentID]) {

      if (!menuMap[realParentID].children) {
        menuMap[realParentID].children = [];
      }

      menuMap[realParentID].children.push(menuList[j])
    }
  }

  return newChildren;
}

/**
 * 从storesAppsMap获取应用下的菜单menus
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 */
export const findAppMenus = ({
  props,
  storeID,
  appID,
}) => {
  const menus = [];
  const storeAppsMap = findStoreAppsMap({
    props,
    storeID,
  });

  let app;
  if (lodash.isMap(storeAppsMap)) {
    app = storeAppsMap.get(appID);
  }

  if (lodash.isObject(app) && Array.isArray(app.children)) {
    menus.push(...app.children);
  }

  return menus;
}

/**
 * 从storesAppsMap获取菜单menu
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 * @param {*} menuID 菜单ID
 */
export const findMenu = ({
  props,
  storeID,
  appID,
  menuID,
}) => {
  let menu = null;

  const menus = findAppMenus({
    props,
    storeID,
    appID,
  });

  if (Array.isArray(menus)) {
    menu = findNode(menus, 'id', menuID);
  }

  return menu;
}

/**
 * 插入menu到storesAppsMap集合中
 * @param {*} menu 需要插入的菜单
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const insertMenuIntoStoresAppsMap = ({
  menu,
  storesAppsMap,
}) => {
  const {
    appID,
    inStoreID: storeID,
  } = menu || {};

  const app = findApp({
    props: {
      storesAppsMap,
    },
    storeID,
    appID,
  });

  if (lodash.isObject(app)) {
    if (!Array.isArray(app.children)) {
      app.children = [];
    }

    app.children.push(menu);
  }
}

/**
 * 插入menu到storesAppsMap集合中
 * @param {*} menu 需要更新的菜单
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const updateMenuIntoStoresAppsMap = ({
  menu,
  storesAppsMap,
}) => {
  const {
    id,
    appID,
    inStoreID: storeID,
  } = menu || {};

  const app = findApp({
    props: {
      storesAppsMap,
    },
    storeID,
    appID,
  });

  let menus = null;

  if (lodash.isObject(app)) {
    menus = app.children;
  }

  if (Array.isArray(menus)) {
    const targetMenu = findNode(menus, 'id', id);

    if (lodash.isObject(menu) && lodash.isObject(targetMenu)) {
      Object.keys(menu).forEach(key => {
        targetMenu[key] = menu[key];
      });
    }
  }
}

/**
 * 根据id, 从menus数据结构中移除菜单
 * @param {*} id 要移除的菜单ID
 * @param {*} menus 菜单数据结构
 */
export const removeMenu = ({
  id,
  menus,
}) => {
  if (!id || !Array.isArray(menus)) {
    return false
  }

  for (let i = 0; i < menus.length; i++) {
    const menu = menus[i]
    if (menu.id === id) {
      menus.splice(i, 1);
      return menu
    } else if (Array.isArray(menus.children)) {
      const tempMenu = removeMenu({
        id,
        menus: menus.children,
      });
      if (tempMenu) {
        return tempMenu;
      }
    }
  }

  return false
}

/**
 * 根据storeID、appID、menuID，从storesAppsMap集合中移除menu
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 * @param {*} menuID 需要移除菜单的ID
 * @param {*} storesAppsMap reducers/storesAppsMap
 */
export const removeMenuFromStoresAppsMap = ({
  storeID,
  appID,
  menuID,
  storesAppsMap,
}) => {
  const app = findApp({
    props: {
      storesAppsMap,
    },
    storeID,
    appID,
  });

  let menus = null;

  if (lodash.isObject(app)) {
    menus = app.children;
  }

  if (Array.isArray(menus)) {
    removeMenu({
      id: menuID,
      menus,
    });
  }
}

/**
 * 从store中获取某个应用的所有菜单
 * @param {*} props react组件中的props
 * @param {*} slug 路由中的slug
 * @param {*} appID 应用ID
 */
export const findAppMenusBySlug = ({
  props,
  slug,
  appID,
}) => {
  const appMenus = [];

  const {
    storesSlugRefID,
  } = props;

  const storeID = storesSlugRefID.get(slug);

  const storeApp = findApp({
    props,
    storeID,
    appID,
  });

  if (lodash.isObject(storeApp) && Array.isArray(storeApp.children)) {
    appMenus.push(...storeApp.children)
  }

  return appMenus;
}
