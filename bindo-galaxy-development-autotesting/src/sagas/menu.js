import {
  put,
  takeEvery,
} from 'redux-saga/effects';
import {
  message,
} from 'antd';
import i18n from '../i18n';
import {
  queryMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  updateMenusPosition,
} from '../data/graphql/menu';
import {
  toTree,
} from '../utils/menu';
import reduxKey from '../constants/reduxKey'
import operateKey from '../constants/operateKey'

function* handleCreateMenu({ payload }) {
  const {
    storeID,
    data,
    callback,
  } = payload;

  try {
    const newMenu = yield createMenu({
      storeID,
      input: data,
    });

    yield put({
      type: reduxKey.UPDATE_MENU_STORES_APPS_MAP,
      payload: [
        {
          operate: operateKey.INSERT,
          data: newMenu,
        },
      ],
    });

    // message.success(i18n.t('common:newSuccess'));
  } catch (error) {
    message.error(i18n.t('common:newFailed'));
  }

  if (typeof callback === 'function') {
    callback();
  }
}

function* handleUpdateMenu({ payload }) {
  const {
    storeID,
    menuID,
    data,
    callback,
  } = payload;

  try {
    const newMenu = yield updateMenu({
      storeID,
      id: menuID,
      input: data,
    });

    yield put({
      type: reduxKey.UPDATE_MENU_STORES_APPS_MAP,
      payload: [
        {
          operate: operateKey.UPDATE,
          data: newMenu,
        },
      ],
    });

    message.success(i18n.t('common:updateSuccess'));
  } catch (error) {
    message.error(i18n.t('common:updateFailed'));
  }

  if (typeof callback === 'function') {
    callback();
  }
}

function* handleDeleteMenu({ payload }) {
  const {
    storeID,
    appID,
    menuID,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const result = yield deleteMenu({
      storeID,
      id: menuID,
    });

    if (result === true) {
      yield put({
        type: reduxKey.UPDATE_MENU_STORES_APPS_MAP,
        payload: [
          {
            operate: operateKey.REMOVE,
            data: {
              storeID,
              appID,
              menuID,
            },
          },
        ],
      });

      if (typeof callback === 'function') {
        callback();
      }
    }

    message.success(i18n.t('common:deleteSuccess'));
  } catch (error) {
    message.error(i18n.t('common:deleteFailed'));
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}

function* handleQueryMenus({ payload }) {
  const {
    storeID,
    appID,
    callback,
  } = payload;

  try {
    const appMenus = yield queryMenus({
      storeID,
      appID,
    });

    const menusTree = toTree(appMenus);

    if (Array.isArray(menusTree)) {
      yield put({
        type: reduxKey.UPDATE_APP_STORES_APPS_MAP,
        payload: [
          {
            operate: operateKey.REPLACE_CHILDREN,
            data: {
              storeID,
              appID,
              children: menusTree,
            },
          },
        ],
      });

      if (typeof callback === 'function') {
        callback();
      }
    }
  } catch (error) {
    log.error(error);
  }
}

function* handleSortingMenus({ payload }) {
  const {
    storeID,
    appID,
    menusPosition,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const result = yield updateMenusPosition({
      storeID,
      appID,
      positions: menusPosition,
    });

    if (result === true) {
      yield put({
        type: reduxKey.QUERY_MENUS,
        payload: {
          storeID,
          appID,
          callback,
        },
      });
    }

    message.success(i18n.t('common:sortSuccess'));
  } catch (error) {
    message.success(i18n.t('common:sortFailed'));
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}

function* watchMenu() {
  yield takeEvery(reduxKey.QUERY_MENUS, handleQueryMenus);
  yield takeEvery(reduxKey.CREATE_MENU, handleCreateMenu);
  yield takeEvery(reduxKey.UPDATE_MENU, handleUpdateMenu);
  yield takeEvery(reduxKey.DELETE_MENU, handleDeleteMenu);
  yield takeEvery(reduxKey.SORTING_MENUS, handleSortingMenus);
}

export default watchMenu()
