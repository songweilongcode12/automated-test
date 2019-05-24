import { handleActions } from 'redux-actions';
import lodash from 'lodash'
import * as moduleUtil from '../utils/module';
import common from '../constants/common';
import reduxKey from '../constants/reduxKey';

const initState = {
  moduleEntity: {},
  selectedViewUuid: 'name',
  activeTab: 'view',
  viewType: common.FORM, // 'list', 'form'
  existingModules: [],
  bindingTableFields: [],
};

export default handleActions({
  [reduxKey.UPDATE_MODULE_REDUCER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [reduxKey.SET_MODULE_ACTIVE_TAB]: (state, { payload }) => ({
    ...state,
    activeTab: payload,
  }),
  [reduxKey.SET_SELECTED_VIEW_UUID]: (state, { payload }) => ({
    ...state,
    activeTab: 'properties',
    selectedViewUuid: payload,
  }),
  [reduxKey.UPDATE_MODULE_ENTITY]: (state, { payload }) => {
    const { moduleEntity, viewType } = state;
    const {
      fields,
      newFields = [],
      template = {},
    } = moduleEntity;
    moduleEntity.newFields = newFields;
    const {
      funcBtns = {},
      scheduler = {},
    } = template || {};

    let {
      queryConditions = [],
    } = moduleEntity;

    // 后台默认值为null, 这里转为空数组[]
    if (lodash.isEmpty(queryConditions)) {
      queryConditions = []
    }
    moduleEntity.queryConditions = queryConditions;
    let {
      singleViews= [],
    } = template || {};

    const {
      editFuncBtn,
      editViews,
      properties,
      actions,
      updateField,
      addField,
      removeField,
      viewsParams,
      templateParams,
      editSingleViews,
      queryConditionsItem,
      editScheduler,
    } = payload;

    const otherState = {};

    if (
      lodash.isObject(editScheduler)
    ) {
      template.scheduler = {
        ...scheduler,
        ...editScheduler,
      };
    }

    if (
      lodash.isObject(editFuncBtn)
      && editFuncBtn.viewType
      && editFuncBtn.operate
      && lodash.isObject(editFuncBtn.data)
      && editFuncBtn.data.uuid
    ) {
      const { operate, data, viewType: btnInViewType } = editFuncBtn;
      if (!Array.isArray(funcBtns[btnInViewType])) {
        funcBtns[btnInViewType] = [];
      }
      if (operate === 'insert') {
        funcBtns[btnInViewType] = [
          ...funcBtns[btnInViewType],
          {
            ...data,
          },
        ];
      } else if (operate === 'edit') {
        funcBtns[btnInViewType] = funcBtns[btnInViewType].map(item => {
          if (item.uuid === data.uuid) {
            return {
              ...item,
              ...data,
            };
          }

          return item;
        });
      } else if (operate === 'remove') {
        funcBtns[btnInViewType] = funcBtns[btnInViewType].filter(
          item => item.uuid !== data.uuid
        );
      }
      template.funcBtns = funcBtns;
    }

    if (lodash.isObject(queryConditionsItem)
      && queryConditionsItem.operate
      && lodash.isObject(queryConditionsItem.data)
      && queryConditionsItem.data.uuid
    ) {
      const {
        operate,
        data,
      } = queryConditionsItem;
      if (operate === 'insert') {
        queryConditions.push(data)
      } else if (operate === 'edit') {
        queryConditions = queryConditions.map(item => {
          if (item.uuid === data.uuid) {
            return {
              ...item,
              ...data,
            }
          }
          return item;
        })
      } else if (operate === 'remove') {
        queryConditions = queryConditions.filter(item => item.uuid !== data.uuid)
      }
      moduleEntity.queryConditions = queryConditions;
    }

    if (
      lodash.isObject(editSingleViews)
      && editSingleViews.operate
      && lodash.isObject(editSingleViews.data)
      && editSingleViews.data.uuid
    ) {
      const {
        operate,
        data,
      } = editSingleViews;
      if (operate === 'insert') {
        singleViews.push(data)
      } else if (operate === 'edit') {
        singleViews = singleViews.map(item =>{
          if (item.uuid === data.uuid) {
            return {
              ...item,
              ...data,
            }
          }
          return item;
        })
      } else if (operate === 'remove') {
        singleViews = singleViews.filter(item => item.uuid !== data.uuid)
      }
      template.singleViews = singleViews;
    }

    if (editViews && editViews.length > 0) {
      if (!moduleEntity.template[viewType]) {
        moduleEntity.template[viewType] = [];
      }
      const viewModels = moduleEntity.template[viewType];
      editViews.forEach(editView => {
        const { operate } = editView;
        let uuids = [];
        if (operate === 'remove') {
          uuids = moduleUtil[`${operate}ViewModel`](viewModels, editView);
        } else if (operate) {
          moduleUtil[`${operate}ViewModel`](viewModels, editView);
        }

        if (operate === 'insert') {
          otherState.selectedViewUuid = editView.data.uuid;
          otherState.activeTab = 'properties';

          if (viewType === common.FORM) {
            moduleUtil.addField(newFields, editView.data, viewType);
          }
        }

        if (operate === 'remove') {
          if (viewType === common.FORM) {
            moduleUtil.removeFieldAndOther(
              uuids,
              fields,
              newFields,
              moduleEntity.template[common.LIST],
              moduleEntity.template[common.SEARCH],
            );
          }
        }
      });
    }

    if (actions) {
      moduleEntity.template.actions = {
        ...moduleEntity.template.actions,
        ...actions,
      };
    }

    if (viewsParams) {
      if (!moduleEntity.template.viewsParams) {
        moduleEntity.template.viewsParams = {};
      }
      moduleEntity.template.viewsParams = {
        ...moduleEntity.template.viewsParams,
        ...viewsParams,
      };
    }

    if (templateParams) {
      if (!moduleEntity.template) {
        moduleEntity.template = {};
      }
      moduleEntity.template = {
        ...moduleEntity.template,
        ...templateParams,
      };
    }

    let otherProperties = {};

    if (properties) {
      otherProperties = {
        ...otherProperties,
        ...properties,
      }
    }

    if (updateField) {
      fields.forEach(field => {
        if (updateField.uuid === field.uuid) {
          Object.keys(updateField).forEach(key => {
            field[key] = updateField[key];
          });
        }
      });
      newFields.forEach(field => {
        if (updateField.uuid === field.uuid) {
          Object.keys(updateField).forEach(key => {
            field[key] = updateField[key];
          });
        }
      });
    }

    if (addField) {
      if (addField.isNewField) {
        newFields.push(addField.field);
      } else {
        fields.push(addField.field);
      }
    }

    if (removeField) {
      moduleUtil.removeFieldAndOther(removeField.uuid, fields, newFields);
    }

    return {
      ...state,
      moduleEntity: {
        ...moduleEntity,
        ...otherProperties,
      },
      ...otherState,
    }
  },
}, initState);
