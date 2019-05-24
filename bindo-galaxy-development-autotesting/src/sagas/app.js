import {
  put,
  takeEvery,
} from 'redux-saga/effects'
import {
  message,
} from 'antd'
import i18n from '../i18n'
import reduxKey from '../constants/reduxKey'
import operateKey from '../constants/operateKey'
import {
  createApp,
  updateApp,
  deleteApp,
  updateAppPositions,
} from '../data/graphql/app'

function* handleCreateApp({ payload }) {
  const {
    storeID,
    data,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const newApp = yield createApp({
      storeID,
      app: data,
    });

    yield put({
      type: reduxKey.UPDATE_APP_STORES_APPS_MAP,
      payload: [
        {
          operate: operateKey.INSERT,
          data: newApp,
        },
      ],
    });

    if (typeof callback === 'function') {
      callback();
    }

    message.success(i18n.t('common:newSuccess'));
  } catch (error) {
    message.error(i18n.t('common:newFailed'));
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}

function* handleUpdateApp({ payload }) {
  const {
    storeID,
    id,
    data,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const newApp = yield updateApp({
      storeID,
      id,
      app: data,
    });

    yield put({
      type: reduxKey.UPDATE_APP_STORES_APPS_MAP,
      payload: [
        {
          operate: operateKey.UPDATE,
          data: newApp,
        },
      ],
    });

    if (typeof callback === 'function') {
      callback();
    }

    message.success(i18n.t('common:updateSuccess'));
  } catch (error) {
    message.error(i18n.t('common:updateFailed'));
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}

function* handleDeleteApp({ payload }) {
  const {
    storeID,
    appID,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const result = yield deleteApp({
      storeID,
      id: appID,
    });

    if (result === true) {
      yield put({
        type: reduxKey.UPDATE_APP_STORES_APPS_MAP,
        payload: [
          {
            operate: operateKey.REMOVE,
            data: {
              storeID,
              appID,
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

function* handleSortingApps({ payload }) {
  const {
    storeID,
    positions,
    callback,
  } = payload;

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: true,
    },
  });

  try {
    const result = yield updateAppPositions({
      storeID,
      positions,
    });

    if (result === true) {
      yield put({
        type: reduxKey.UPDATE_APP_STORES_APPS_MAP,
        payload: [
          {
            operate: operateKey.SORTING,
            data: {
              storeID,
              positions,
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

function* watchApp() {
  yield takeEvery(reduxKey.CREATE_APP, handleCreateApp);
  yield takeEvery(reduxKey.UPDATE_APP, handleUpdateApp);
  yield takeEvery(reduxKey.DELETE_APP, handleDeleteApp);
  yield takeEvery(reduxKey.SORTING_APPS, handleSortingApps);
}

export default watchApp()
