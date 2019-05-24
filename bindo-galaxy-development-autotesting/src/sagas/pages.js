import { put, takeEvery } from 'redux-saga/effects';
// import { call, put, takeEvery } from 'redux-saga/effects';
// import axios from 'axios';
// import lodash from 'lodash';
// import urls from '../constants/urls';
import reduxKey from '../constants/reduxKey';

/** haidi start */
function* handleQueryStore({ payload }) {
  const timeStart = new Date();
  log.info('Start loading store');
  const {
    storesMap = new Map(),
    storesIDRefSlug = new Map(),
    storesSlugRefID = new Map(),
    storesAppsModulesMap = new Map(),
    slug = null,
  } = payload || {};
  try {
    if (!storesMap.has(slug)) {
      // const values = {
      //   client_id: urls.client_id,
      //   client_secret: urls.client_secret,
      // }
      // yield call(axios.get, urls.store.replace('{storeID}', 4751), values)
      // {"95e" => 4751}
      const store = {
        slug: '95e',
        id: 4751,
        title: 'Offline Restaurant Test Store',
      }
      storesMap.set(store.slug, {
        slug: store.slug,
        id: store.id,
        title: store.title,
      });
      storesIDRefSlug.set(store.id, store.slug);
      storesSlugRefID.set(store.slug, store.id);
    }

    const putPayload = {
      storesIDRefSlug,
      storesSlugRefID,
      storesAppsModulesMap,
    };

    yield put({
      type: reduxKey.UPDATE_PAGES_REDUCER,
      payload: putPayload,
    });
  } catch (error) {
    log.error(error);
  }

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  log.info(`Finish loading store after ${time} ms`);
}
function* handleQueryModule({ payload }) {
  const timeStart = new Date();
  log.info('Start loading module');
  const {
    storeID,
    appID,
    moduleID,
    modulesMap = new Map(),
  } = payload || {};

  try {
    const moduleKey = `${storeID}_${appID}_${moduleID}`;
    if (!modulesMap.has(moduleKey)) {
      // const values = {
      //   client_id: urls.client_id,
      //   client_secret: urls.client_secret,
      // }
      // yield call(axios.get, urls.store.replace('{storeID}', 4751), values)
      // {"95e" => 4751}
      const module = {

      };
      modulesMap.set(moduleKey, module);
    }

    const putPayload = {
      modulesMap,
      pageLoading: false,
    };

    yield put({
      type: reduxKey.UPDATE_PAGES_REDUCER,
      payload: putPayload,
    });
  } catch (error) {
    log.error(error);
  }

  const timeEnd = new Date();
  const time = timeEnd.getTime() - timeStart.getTime();
  log.info(`Finish loading module after ${time} ms`);
}
/** haidi end */

function* watchGalaxy() {
  yield takeEvery(reduxKey.QUERY_PAGES_STORE, handleQueryStore);
  yield takeEvery(reduxKey.QUERY_PAGES_MODULE, handleQueryModule);
}

export default watchGalaxy();
