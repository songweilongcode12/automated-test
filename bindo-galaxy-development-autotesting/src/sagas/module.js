import { put, takeEvery } from 'redux-saga/effects'
import { message } from 'antd'
import i18n from '../i18n'
import {
  parseFields,
  filterModuleUpdate,
} from '../utils/module'
import {
  updateModule,
  saveModuleFields,
  queryFields,
  createModule,
} from '../data/graphql/module'
import reduxKey from '../constants/reduxKey'
import operateKey from '../constants/operateKey'

function* handleSaveModule({ payload }) {
  const {
    moduleEntity,
    storeID,
  } = payload;

  try {

    const module = {
      template: moduleEntity.template,
      name: moduleEntity.name,
      tableInfo: moduleEntity.tableInfo,
      appID: moduleEntity.appID,
      permission: moduleEntity.permission,
      queryConditions: moduleEntity.queryConditions,
      crossChain: moduleEntity.crossChain || false,
      globalEnabled: moduleEntity.globalEnabled || false,
    };

    if(Array.isArray(moduleEntity.uniqueIndexes) && moduleEntity.uniqueIndexes.length > 0){
      module.uniqueIndexes = moduleEntity.uniqueIndexes;
    }

    const moduleData = yield updateModule({
      storeID,
      id: moduleEntity.id,
      input: module,
    });

    // 过滤出非自己的fields
    let filterFields;
    if (moduleEntity.fields && Array.isArray(moduleEntity.fields)) {
      filterFields = moduleEntity.fields.filter(item => item.storeID === item.inStoreID)
    }
    let fields = parseFields(filterFields);

    const newFields = parseFields(moduleEntity.newFields || []);

    if (fields.length > 0 || newFields.length > 0) {
      fields = [
        ...yield saveModuleFields({
          storeID,
          moduleID: moduleData.id,
          input: [...fields, ...newFields],
        }),
      ]
    }

    fields.forEach(item => {
      item.inStoreID = storeID;
    })

    moduleData.fields = fields;

    yield put({
      type: reduxKey.UPDATE_MODULE_REDUCER,
      payload: {
        moduleEntity: moduleData,
      },
    });

    yield put({
      type: reduxKey.UPDATE_MODULE_STORES_APPS_MODULES_MAP,
      payload: [
        {
          operate: operateKey.UPDATE,
          data: moduleData,
        },
      ],
    });
    message.success(i18n.t('common:saveSuccess'));
  } catch (error) {
    message.error(i18n.t('common:saveFailed'));
    log.error(error);
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}

/** haidi start */
function* handleCreateModule({ payload }) {
  const {
    storeID,
    data,
    fields,
    callback,
  } = payload;

  let newModule;

  try {
    newModule = yield createModule({
      storeID,
      input: data,
    });

    const newFields = yield saveModuleFields({
      storeID,
      moduleID: newModule.id,
      input: parseFields(fields),
    });

    newModule.fields = newFields;

    yield put({
      type: reduxKey.UPDATE_MODULE_STORES_APPS_MODULES_MAP,
      payload: [
        {
          operate: operateKey.INSERT,
          data: newModule,
        },
      ],
    });

    message.success(i18n.t('common:newSuccess'));
  } catch (error) {
    message.error(i18n.t('common:newFailed'));
  }

  if (typeof callback === 'function') {
    callback(newModule);
  }
}

function* handleUpdateModule({ payload }) {
  const {
    storeID,
    id,
    data,
    callback,
  } = payload;

  let newModule;

  try {
    newModule = yield updateModule({
      storeID,
      id,
      input: filterModuleUpdate({data}),
    });

    yield put({
      type: reduxKey.UPDATE_MODULE_STORES_APPS_MODULES_MAP,
      payload: [
        {
          operate: operateKey.UPDATE,
          data: newModule,
        },
      ],
    });

    message.success(i18n.t('common:updateSuccess'));
  } catch (error) {
    message.error(i18n.t('common:updateFailed'));
  }

  if (typeof callback === 'function') {
    callback(newModule);
  }
}

function* handleInitModule({ payload }) {
  const {
    storeID,
    moduleEntity,
    initStatus = {},
  } = payload;

  try {
    const { tableInfo } = moduleEntity;
    const { database, tableName } = tableInfo || {};

    let bindingTableFields = [];
    if (database && tableName) {
      bindingTableFields = yield queryFields({
        storeID,
        tableInfo,
      });
    }

    yield put({
      type: reduxKey.UPDATE_MODULE_REDUCER,
      payload: {
        moduleEntity,
        bindingTableFields,
        ...initStatus,
      },
    });
  } catch (error) {
    log.error(error);
  }

  yield put({
    type: reduxKey.UPDATE_GALAXY_REDUCER,
    payload: {
      galaxyLoading: false,
    },
  });
}
/** haidi end */

function* watchModule() {
  yield takeEvery(reduxKey.CREATE_MODULE, handleCreateModule);
  yield takeEvery(reduxKey.UPDATE_MODULE, handleUpdateModule);
  yield takeEvery(reduxKey.INIT_MODULE, handleInitModule);
  yield takeEvery(reduxKey.SAVE_MODULE, handleSaveModule);
}

export default watchModule()
