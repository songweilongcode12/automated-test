import React from 'react';
import moment from 'moment';
import lodash from 'lodash';
import Icon from '../components/Icon';
import i18n from '../i18n';
import {findNode, createUuid} from './index';
import widgets from '../constants/widgets';
import fieldRules from '../constants/fieldRules';
import common from '../constants/common';

const viewTypes = new Set([
  widgets.TEXT,
  widgets.MULTILINE_TEXT,
  widgets.INTEGER_NUMBER,
  widgets.DECIMAL_NUMBER,
  widgets.SELECTION,
  widgets.CHECKBOX,
  widgets.RADIO,
  widgets.BOOLEAN,
  widgets.DATE,
  widgets.DATE_RANGE,
  widgets.TIMEPICKER,
  widgets.UPLOAD,
  widgets.IMAGE,
  widgets.MANY_TO_MANY,
  widgets.ONE_TO_MANY,
  widgets.MANY_TO_ONE,
  widgets.RELATED_FIELD,
  widgets.ONE_TO_ONE,
  widgets.EDITOR,
  widgets.SEQNO,
  widgets.VIDEOPLAYER,
]);

/**
 * 根据uuid, 从viewModels中查找到对应的viewModel
 * @param {*} viewModels
 * @param {*} uuid
 */
export const findViewModel = (viewModels, uuid) => {
  for (let i = 0; i < viewModels.length; i++) {
    const viewModel = viewModels[i];
    if (viewModel.uuid === uuid) {
      return viewModel;
    }
    if (viewModel.children && viewModel.children.length > 0) {
      const tempViewModel = findViewModel(viewModel.children, uuid);
      if (tempViewModel) {
        return tempViewModel;
      }
    }
  }

  return null;
};

/**
 * 根据uuid，找出某个ViewModel的children，如果uuid==='0', 则返回最上层viewModels
 * @param {*} viewModels
 * @param {*} uuid
 */
const findViewModels = (viewModels, uuid) => {
  if (uuid === '0') {
    return viewModels;
  }

  for (let i = 0; i < viewModels.length; i++) {
    const viewModel = viewModels[i];
    if (viewModel.uuid === uuid) {
      return viewModel.children;
    }
    if (viewModel.children && viewModel.children.length > 0) {
      const tempViewModels = findViewModels(viewModel.children, uuid);
      if (tempViewModels) {
        return tempViewModels;
      }
    }
  }

  return null;
};

/**
 * 根据payload中的信息，插入ViewModel
 * 同时, 在Module的fields字段中插入新的field
 * 返回选中项Uuid和激活项TabPane的Key
 * @param {*} editView {index, data}
 * @param {*} viewModels
 * @param {*} fields
 */
export const insertViewModel = (viewModels, editView) => {
  const {index, data} = editView;
  const {parentUuid, uuid, viewType} = data;
  const model = {
    parentUuid,
    uuid,
    viewType,
    hiddenLabel: false,
    helpTooltip: '',
    placeholder: '',
  };

  if (lodash.has(data, 'title')) {
    model.title = data.title;
  }
  if (lodash.has(data, 'format')) {
    model.format = data.format;
  }
  if (lodash.has(data, 'addonBefore')) {
    model.addonBefore = data.addonBefore;
  }
  if (lodash.has(data, 'addonAfter')) {
    model.addonAfter = data.addonAfter;
  }
  if (lodash.has(data, 'visibleRows')) {
    model.visibleRows = data.visibleRows;
  }
  if (lodash.has(data, 'mode')) {
    model.mode = data.mode;
  }
  if (lodash.has(data, 'fontWeight')) {
    model.fontWeight = data.fontWeight;
  }
  if (lodash.has(data, 'fontSize')) {
    model.fontSize = data.fontSize;
  }
  if (lodash.has(data, 'stepValue')) {
    model.stepValue = data.stepValue;
  }
  if (lodash.has(data, 'maxValue')) {
    model.maxValue = data.maxValue;
  }
  if (lodash.has(data, 'minValue')) {
    model.minValue = data.minValue;
  }
  if (lodash.has(data, 'precision')) {
    model.precision = data.precision;
  }
  if (lodash.has(data, 'buttonText')) {
    model.buttonText = data.buttonText;
  }
  if (lodash.has(data, 'children')) {
    model.children = data.children;
  }
  if (lodash.has(data, 'activeKey')) {
    model.activeKey = data.activeKey;
  }
  if (lodash.has(data, 'searchableFields')) {
    model.searchableFields = data.searchableFields;
  }

  if (viewType === widgets.LABEL) {
    if (lodash.has(data, 'label')) {
      model.label = data.label;
    }
  }

  const models = findViewModels(viewModels, parentUuid);
  models.splice(index, 0, model);
};

/**
 * 根据payload中的信息，更新ViewModel
 * @param {*} payload
 * @param {*} viewModels
 */
export const updateViewModel = (viewModels, editView) => {
  const {uuid, data} = editView;

  const viewModel = findViewModel(viewModels, uuid) || {};

  Object.keys(data).forEach(key => {
    viewModel[key] = data[key];
  });
};

/**
 * 根据payload中的信息，移动ViewModel
 * @param {*} editView { fromUuid, toUuid, oldIndex, newIndex }
 * @param {*} viewModels
 */
export const moveViewModel = (viewModels, editView) => {
  const {fromUuid, toUuid, oldIndex, newIndex} = editView;

  const fromViewModels = findViewModels(viewModels, fromUuid);
  const moveData = fromViewModels.splice(oldIndex, 1);

  if (moveData.length > 0) {
    const toViewModels = findViewModels(viewModels, toUuid);

    toViewModels.splice(newIndex, 0, {
      ...moveData[0],
      parentUuid: toUuid,
    });
  }
};

const getViewModelAndChildrenUuids = viewModel => {
  let uuids = [];

  if (!viewModel) {
    return uuids;
  }

  if (viewModel.children && viewModel.children.length > 0) {
    viewModel.children.forEach(item => {
      uuids = [...uuids, ...getViewModelAndChildrenUuids(item)];
    });
  }

  return [...uuids, viewModel.uuid];
};

/**
 * 根据payload中的信息，移除ViewModel
 * @param {*} payload
 * @param {*} viewModels
 */
export const removeViewModel = (viewModels, editView) => {
  const {uuid} = editView;
  if (uuid === '0') return false;

  for (let i = 0; i < viewModels.length; i++) {
    const viewModel = viewModels[i];
    if (viewModel.uuid === uuid) {
      const uuids = getViewModelAndChildrenUuids(viewModel);
      viewModels.splice(i, 1);
      return uuids;
    }
    if (viewModel.children && viewModel.children.length > 0) {
      const uuids = removeViewModel(viewModel.children, editView);
      if (uuids) {
        return uuids;
      }
    }
  }

  return false;
};

export const findViewModelAndIndex = (viewModels, uuid) => {
  for (let i = 0; i < viewModels.length; i++) {
    const viewModel = viewModels[i];
    if (viewModel.uuid === uuid) {
      return {viewModel, index: i};
    }
    if (viewModel.children && viewModel.children.length > 0) {
      const tempViewModel = findViewModel(viewModel.children, uuid);
      if (tempViewModel) {
        return tempViewModel;
      }
    }
  }

  return null;
};

const updateFieldRule = (rules, type, newRule) => {
  const newRules = [];

  rules.forEach(rule => {
    if (rule.type === type) {
      newRules.push({
        ...rule,
        ...newRule,
        detail: {
          ...rule.detail,
          ...(newRule.detail || {}),
        },
        type,
      });
    } else {
      newRules.push(rule);
    }
  });

  return newRules;
};

const removeFieldRule = (rules, type) => {
  const newRules = [];
  rules.forEach(rule => {
    if (rule.type !== type) {
      newRules.push(rule);
    }
  });

  return newRules;
};

const insertFieldRule = (rules, type) => {
  const newRules = removeFieldRule(rules, type);

  switch (type) {
    case fieldRules.REQUIRED:
      newRules.push({
        type: fieldRules.REQUIRED,
        message: 'This field is required.',
        detail: {},
      });

      break;
    default:
      break;
  }

  return newRules;
};

export const modifyFieldRule = (rules, type, operate, newRule) => {
  if (operate === 'insert') {
    return insertFieldRule(rules, type);
  }
  if (operate === 'remove') {
    return removeFieldRule(rules, type);
  }
  if (operate === 'update') {
    return updateFieldRule(rules, type, newRule);
  }

  return rules;
};

const realRemoveField = (fields, uuid) => {
  let fieldIndex = -1;

  fields.forEach((field, idx) => {
    if (field && field.uuid === uuid) {
      fieldIndex = idx;
      // field.deleted = true;
    }
  });

  if (fieldIndex >= 0) {
    fields.splice(fieldIndex, 1);
  }
};

export const removeFieldAndOther = (uuids, fields, newFields, list, search) => {
  if (!uuids || uuids.length < 1) {
    return;
  }

  uuids.forEach(uuid => {
    let itemIndex = -1;
    let searchItemIndex = -1;

    realRemoveField(fields, uuid);
    realRemoveField(newFields, uuid);

    if (list) {
      list.forEach((item, idx) => {
        if (item && item.uuid === uuid) {
          itemIndex = idx;
        }
      });
    }

    if (search) {
      search.forEach((item, idx) => {
        if (item && item.uuid === uuid) {
          searchItemIndex = idx;
        }
      });
    }

    if (itemIndex >= 0) {
      list.splice(itemIndex, 1);
    }

    if (searchItemIndex >= 0) {
      search.splice(searchItemIndex, 1);
    }
  });
};

const multiViewTypes = new Set([
  widgets.SELECTION,
  widgets.CHECKBOX,
  widgets.RADIO,
]);

const getDateString = (newText, format) => {
  let dateValue;
  if (newText && newText.indexOf('T') > -1) {
    dateValue = moment(newText, moment.ISO_8601).format(format);
  } else {
    dateValue = moment(newText, format).format(format);
  }

  return dateValue;
};

export const fieldToColumn = ({field, view: tempView}) => {
  const view = tempView || {};
  const {label, name, viewType, multiValue} = field;

  const column = {
    title: label,
    dataIndex: name,
    key: name,
    // width: 200,
    // className: 'findtdClass',
    render: text => {
      let newText = text;
      if (viewType === widgets.RELATED_FIELD) {
        newText = '';
        if (text && typeof text === 'object' && text.length > 0) {
          const fieldData = text[0];

          if (fieldData && view.showRelationField) {
            return fieldData[view.showRelationField];
          }
        }
        return '';
      }

      // todo 需要改进Field中的allowValue.dynamicItemSource属性（displayField）显示正确的信息
      if (viewType === widgets.MANY_TO_ONE) {
        const {allowValue: {dynamicItemSource} = {}} = field;

        if (lodash.isObject(text)) {
          const {displayField} = dynamicItemSource || {};
          const initValueTemp = {
            ...text,
            ...(text.record || {}),
          };
          newText = initValueTemp[displayField] || '--';
        } else {
          newText = '--';
        }
      }

      if (multiViewTypes.has(viewType)) {
        const {
          allowValue: {type, staticItems = [], dynamicItemSource},
        } = field;
        if (type === common.STATIC) {
          if (lodash.isArray(text)) {
            const textArr = [];
            const textSet = new Set(text);
            for (let i = 0; i < staticItems.length; i++) {
              const item = staticItems[i];
              if (textSet.has(item.key)) {
                textArr.push(item.value);
              }
            }
            newText = textArr.join(',');
          } else {
            for (let i = 0; i < staticItems.length; i++) {
              const item = staticItems[i];
              if (item.key === text) {
                newText = item.value;
              }
            }
          }
        } else if (lodash.isObject(text) && lodash.isObject(text.record)) {
          const {displayField} = dynamicItemSource || {};
          const initValueTemp = {
            ...text,
            ...text.record,
          };
          newText = initValueTemp[displayField] || '--';
        } else {
          newText = '--';
        }
      }

      if (
        viewType === widgets.DATE ||
        name === 'updatedAt' ||
        name === 'createdAt'
      ) {
        const {format = 'YYYY-MM-DD HH:mm:ss'} = view;
        if (newText) {
          // newText = moment(newText, format).format(format)
          newText = getDateString(newText, format);
        } else {
          newText = '';
        }
      }

      if (viewType === widgets.DATE_RANGE) {
        const {format = 'YYYY-MM-DD'} = view;
        if (Array.isArray(newText)) {
          // newText = `${moment(newText[0], format).format(format)} ~ ${moment(newText[1], format).format(format)}`
          newText = `${getDateString(newText[0], format)} ~ ${getDateString(
            newText[1],
            format,
          )}`;
        }
      }

      if (multiValue && typeof newText === 'object' && newText.join) {
        newText = newText.join(', ');
      }

      if (viewType === widgets.BOOLEAN) {
        if (newText === true) {
          return 'true';
        }
        return 'false';
      }

      return newText;
    },
  };

  return column;
};

// 需判断是否是image组件
const handleHyperLink = record => {
  const regex = /http(s)?:\/\/*/;
  Object.keys(record).forEach(key => {
    if (regex.test(record[key])) {
      record[key] = (
        <a href={record[key]} target="_blank" rel="noreferrer noopener">
          <Icon type="icon-view" />
          <span>Click to view</span>
        </a>
      );
    }
  });
  return record;
};

export const parseTableData = ({data, fields: tempFields}) => {
  const fields = tempFields || [];
  let record = {...data};
  if (record.record) {
    record = {
      ...record,
      ...record.record,
    };
    delete record.record;
  }

  fields.forEach(item => {
    if (item.viewType === widgets.MANY_TO_ONE) {
      const {allowValue: {dynamicItemSource} = {}} = item;

      const {exportFields = []} = dynamicItemSource;

      if (!Array.isArray(exportFields)) {
        return;
      }

      let manyToOneRecord = record[item.name];

      if (!lodash.isObject(manyToOneRecord)) {
        manyToOneRecord = {};
      }

      manyToOneRecord = {
        ...manyToOneRecord,
        ...(manyToOneRecord.record || {}),
      };

      exportFields.forEach(exportField => {
        const {destField, fromField} = exportField;

        if (destField && fromField) {
          record[destField] = manyToOneRecord[fromField] || null;
        }
      });
    }

    if (item.viewType === widgets.UPLOAD) {
      const tempUpload = record[item.name];
      const newUpload = [];
      if (tempUpload && Array.isArray(tempUpload)) {
        // 截取url里的文件名
        tempUpload.forEach(url => {
          newUpload.push(url.slice(url.lastIndexOf('/') + 1));
        });
      }
      record[item.name] = newUpload.map(fileName => (
        <span key={fileName}>
          {fileName}
          <br />
        </span>
      ));
    }
  });

  record = handleHyperLink(record);
  const newData = {
    key: data.id,
    ...record,
  };

  return newData;
};

export const parseField = field => {
  const newField = {};

  if (field) {
    newField.uuid = field.uuid;
    newField.name = field.name;
    newField.label = field.label;
    newField.type = field.type;
    newField.dataType = field.dataType;
    newField.viewType = field.viewType;
    newField.allowMultiValue = field.allowMultiValue;
    newField.isBindField = field.isBindField;
    newField.readOnly = field.readOnly;
    newField.invisible = field.invisible;
    newField.required = field.required;
    newField.i18n = field.i18n;
    newField.seqNoConfig = field.seqNoConfig;

    if (field.allowValue) {
      newField.allowValue = field.allowValue;
    }
    if (field.relation) {
      newField.relation = field.relation;
    }
    if (field.link) {
      newField.link = field.link;
    }
    if (field.queryConditions) {
      newField.queryConditions = field.queryConditions;
    }
    if (field.queryOrder) {
      newField.queryOrder = field.queryOrder;
    }
    if (field.queryEvaluation) {
      newField.queryEvaluation = field.queryEvaluation;
    }
    if (field.listens) {
      newField.listens = field.listens;
    }
    if (field.validations) {
      newField.validations = field.validations;
    }
    if (field.defaultValue) {
      newField.defaultValue = field.defaultValue;
    }
    if (field.seqNoConfig) {
      newField.seqNoConfig = field.seqNoConfig;
    }
  }

  return newField;
};

export const parseFields = (fields = []) => {
  const newFields = [];
  fields.forEach(field => newFields.push(parseField(field)));

  return newFields;
};

export const addField = (fields, data) => {
  const {viewType} = data;

  if (!viewTypes.has(viewType)) {
    return;
  }

  fields.push(parseField(data));
};

export const getInitFuncBtns = () => ({
  form: [
    {
      title: 'common:editor.view',
      scriptName: 'View',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE, // active/invalid
      params: {},
      icon: 'icon-view',
      iconType: 'bindo',
    },
    {
      title: 'common:editor.edit',
      scriptName: 'Edit',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE,
      params: {},
      icon: 'icon-edit',
      iconType: 'bindo',
    },
    {
      title: 'common:editor.delete',
      scriptName: 'Delete',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE,
      params: {},
      icon: 'icon-delete',
      iconType: 'bindo',
    },
    {
      title: 'common:editor.recordGlobal',
      scriptName: common.GLOBAL,
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE,
      params: {},
      icon: 'icon-image',
      iconType: 'bindo',
    },
  ],
  list: [
    {
      title: 'common:editor.new',
      scriptName: 'New',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE, // active/invalid
      params: {},
      icon: '',
      iconType: '',
    },
    {
      title: 'common:editor.import',
      scriptName: 'Import',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE,
      params: {},
      icon: '',
      iconType: '',
    },
    {
      title: 'common:editor.export',
      scriptName: 'Export',
      uuid: createUuid(),
      type: common.DEFAULT,
      status: common.ACTIVE,
      params: {},
      icon: '',
      iconType: '',
    },
  ],
});

/**
 * 初始化Module
 * 若存在父module则不创建name属性,避免与父的name冲突
 * TODO
 * 1. 初始化时uuid不写死
 * 2. 在编辑控件时判断是否与父控件uuid重复
 */
export const initModule = ({
  hasName = true,
  fieldSet = new Set(),
  appID,
  storeID,
  name = 'Module name',
  // isBindTable = false,
}) => {
  const formView = [];
  const listView = [];
  const fields = [];

  if (hasName && fieldSet.has('name')) {
    formView.push({
      parentUuid: '0',
      uuid: 'name',
      viewType: widgets.TEXT,
      helpTooltip: '',
      hiddenLabel: false,
      placeholder: '',
      addonBefore: [],
      addonAfter: [],
    });
    listView.push({
      parentUuid: '0',
      uuid: 'name',
      viewType: widgets.TEXT,
    });
    fields.push({
      uuid: 'name',
      name: 'name',
      label: i18n.t('common:editor.name'),
      type: common.BASIC,
      dataType: widgets.TEXT,
      viewType: widgets.TEXT,
      allowMultiValue: false,
      isBindField: false,
      readOnly: false,
      invisible: false,
      required: true,
      i18n: {},
      fieldRules: modifyFieldRule([], fieldRules.REQUIRED, 'insert'),
    });
  }

  if (fieldSet.has('created_at')) {
    listView.push({
      parentUuid: '0',
      uuid: 'createdAt',
      viewType: widgets.DATE,
    });
    fields.push({
      uuid: 'createdAt',
      name: 'created_at',
      label: i18n.t('common:editor.createdAt'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  if (fieldSet.has('updated_at')) {
    listView.push({
      parentUuid: '0',
      uuid: 'updatedAt',
      viewType: widgets.DATE,
    });
    fields.push({
      uuid: 'updatedAt',
      name: 'updated_at',
      label: i18n.t('common:editor.updatedAt'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  if (fieldSet.has('id')) {
    fields.push({
      uuid: 'id',
      name: 'id',
      label: i18n.t('common:editor.id'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  if (fieldSet.has('store_id')) {
    fields.push({
      uuid: 'storeID',
      name: 'store_id',
      label: i18n.t('common:editor.storeID'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  if (fieldSet.has('deleted_at')) {
    fields.push({
      uuid: 'deletedAt',
      name: 'deleted_at',
      label: i18n.t('common:editor.deletedAt'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  if (fieldSet.has('module_id')) {
    fields.push({
      uuid: 'moduleID',
      name: 'module_id',
      label: i18n.t('common:editor.moduleID'),
      type: common.BASIC,
      dataType: widgets.DATE,
      viewType: widgets.DATE,
      allowMultiValue: false,
      isBindField: true,
      readOnly: true,
      invisible: true,
      required: false,
      i18n: {},
    });
  }

  return {
    appID,
    storeID,
    name,
    template: {
      funcBtns: getInitFuncBtns(),
      singleViews: [],
      viewsParams: {
        showSearch: true,
      },
      [common.FORM]: formView,
      [common.LIST]: listView,
    },
    fields,
  };
};

export const isBindingExistingTable = moduleEntity => {
  const {tableInfo = {}} = moduleEntity || {};
  return (tableInfo && tableInfo.tableName) || false;
};

export const listToColumns = moduleEntity => {
  const {fields, template} = moduleEntity || {};

  let {
    moduleParent = {}, // 后台默认值为 null
  } = moduleEntity || {};

  if (lodash.isEmpty(moduleParent)) {
    moduleParent = {
      fields: [],
      template: {
        form: [],
      },
    };
  }

  const {
    fields: moduleParentFields = [],
    template: {form: moduleParentForm = []},
  } = moduleParent;

  // // 给继承来的moduel的fieldlabel和uuid区别
  // if (Array.isArray(moduleParentFields) && moduleParentFields.length > 0) {
  //   moduleParentFields.forEach(item => {
  //     if(item.uuid.indexOf('moduleParent') < 0){
  //       item.label = `moduleParent_${item.label}`
  //       item.uuid = `moduleParent_${item.uuid}`
  //     }
  //   })
  // }

  // // 子module的list已经存了带moduleParent的uuid
  // if (Array.isArray(moduleParentForm) && moduleParentForm.length > 0) {
  //   moduleParentForm.forEach(item => {
  //     if(item.uuid.indexOf('moduleParent') < 0){
  //       item.uuid = `moduleParent_${item.uuid}`
  //     }
  //   })
  // }

  const {list = [], form = []} = template || {};

  // TODO这里es6语法报错...未知原因
  const moduleForm = [...moduleParentForm, ...form];
  // const moduleFields = [...moduleParentFields,...fields];
  const moduleFields = moduleParentFields.concat(fields);

  const columns = [];

  list.forEach(item => {
    const field = findNode(moduleFields, 'uuid', item.uuid);
    const view = findNode(moduleForm, 'uuid', item.uuid);

    if (field && field.uuid) {
      columns.push(fieldToColumn({field, view}));
    }
  });
  return columns;
};

/**
 * @param btnData List button data
 * @param param button bind function
 */

export const handleMoreBtnEvent = (btnData, param) => {
  if (!lodash.isObject(btnData)) {
    return;
  }

  let buttonScriptName = btnData.scriptName;

  buttonScriptName =
    buttonScriptName.charAt(0).toUpperCase() + buttonScriptName.slice(1);

  if (btnData.type === common.DEFAULT) {
    if (typeof param[`handle${buttonScriptName}Click`] === 'function') {
      param[`handle${buttonScriptName}Click`]();
    }
  } else if (btnData.type === common.CUSTOM) {
    if (btnData.actionType && btnData.actionType === common.BIND_TEMPLATE) {
      if (typeof param.handleExportTemplateClick === 'function') {
        param.handleExportTemplateClick();
      }
    } else if (
      btnData.actionType &&
      btnData.actionType === common.BIND_ACTION
    ) {
      if (typeof param.handleCustomClick === 'function') {
        param.handleCustomClick();
      }
    }
  }
};

/**
 * 处理并拷贝Module, 返回全新的Module
 * @param {*} module
 * @param {*} storeID
 */
export const handleAndCloneModule = ({module, storeID}) => {
  const newModule = lodash.cloneDeep(module);

  newModule.inStoreID = storeID;
  if (newModule.fields && Array.isArray(newModule.fields)) {
    newModule.fields.forEach(item => {
      item.inStoreID = storeID;
    });
  }
  return newModule;
};

/**
 * 获取店下的modulesMap(moduleID -> Module Object)
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 */
export const findStoreModulesMap = ({props, storeID}) => {
  let appsModulesMap;

  const {storesAppsModulesMap} = props || {};

  if (lodash.isMap(storesAppsModulesMap)) {
    appsModulesMap = storesAppsModulesMap.get(storeID);
  }

  if (!lodash.isMap(appsModulesMap)) {
    appsModulesMap = new Map();
  }

  return appsModulesMap;
};

/**
 * 获取应用下的modulesMap(moduleID -> Module Object)
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 */
export const findAppModulesMap = ({props, storeID, appID}) => {
  const appsModulesMap = findStoreModulesMap({
    props,
    storeID,
  });

  let appModulesMap;

  if (lodash.isMap(appsModulesMap)) {
    appModulesMap = appsModulesMap.get(appID);
  }

  if (!lodash.isMap(appModulesMap)) {
    appModulesMap = new Map();
  }

  return appModulesMap;
};

/**
 * 获取店铺下的modules，返回module数组
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 */
export const findStoreModules = ({props, storeID}) => {
  const modules = [];

  const appsModulesMap = findStoreModulesMap({
    props,
    storeID,
  });

  if (lodash.isMap(appsModulesMap)) {
    appsModulesMap.forEach(modulesMap => {
      if (lodash.isMap(modulesMap)) {
        modules.push(...modulesMap.values());
      }
    });
  }

  return modules;
};

/**
 * 获取应用下的modules，返回module数组
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 */
export const findAppModules = ({props, storeID, appID}) => {
  const modules = [];

  const modulesMap = findAppModulesMap({
    props,
    storeID,
    appID,
  });

  if (lodash.isMap(modulesMap)) {
    modules.push(...modulesMap.values());
  }

  return modules;
};

/**
 * 根据条件获取module，返回module对象
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} appID 应用ID
 * @param {*} moduleID
 */
export const findModule = ({props, storeID, appID, moduleID}) => {
  let module;

  const modulesMap = findAppModulesMap({
    props,
    storeID,
    appID,
  });

  if (lodash.isMap(modulesMap)) {
    module = modulesMap.get(moduleID);
  }

  return module;
};

/**
 * 根据条件获取module，返回module对象
 * @param {*} props react组件中的props
 * @param {*} storeID 店铺ID
 * @param {*} moduleID
 */
export const findModuleByID = ({props, storeID, moduleID}) => {
  let module;

  const modulesMap = findStoreModulesMap({
    props,
    storeID,
  });

  modulesMap.forEach(item => {
    if (lodash.isMap(item) && item.has(moduleID)) {
      module = item.get(moduleID);
    }
  });

  return module;
};

/**
 * 插入module到storesAppsModulesMap集合中
 * @param {*} module 需要插入的Module
 * @param {*} storesAppsModulesMap reducers/storesAppsModulesMap
 */
export const insertModuleIntoStoresAppsModulesMap = ({
  module,
  storesAppsModulesMap,
}) => {
  const {id, appID, inStoreID: storeID} = module || {};

  let storeAppsModulesMap = null;
  if (storeID) {
    storeAppsModulesMap = storesAppsModulesMap.get(storeID);

    if (!lodash.isMap(storeAppsModulesMap)) {
      storeAppsModulesMap = new Map();

      storesAppsModulesMap.set(storeID, storeAppsModulesMap);
    }
  }

  let appModulesMap = null;
  if (lodash.isMap(storeAppsModulesMap)) {
    appModulesMap = storeAppsModulesMap.get(appID);

    if (!lodash.isMap(appModulesMap)) {
      appModulesMap = new Map();

      storeAppsModulesMap.set(appID, appModulesMap);
    }
  }

  if (id && lodash.isMap(appModulesMap)) {
    appModulesMap.set(id, module);
  }
};

/**
 * 根据条件，从storesAppsModulesMap集合中替换module
 * @param {*} module 需要替换的Module
 * @param {*} storesAppsModulesMap reducers/storesAppsModulesMap
 */
export const updateModuleIntoStoresAppsModulesMap = ({
  module,
  storesAppsModulesMap,
}) => {
  const {id, appID, inStoreID: storeID} = module || {};

  let storeAppsModulesMap = null;
  if (storeID) {
    storeAppsModulesMap = storesAppsModulesMap.get(storeID);
  }

  let appModulesMap = null;
  if (lodash.isMap(storeAppsModulesMap)) {
    appModulesMap = storeAppsModulesMap.get(appID);
  }

  if (id && lodash.isMap(appModulesMap)) {
    appModulesMap.set(id, module);
  }
};

/**
 * 获取Module中的功能按钮集合
 * @param {*} module
 */
export const getModuleFuncBtns = ({module}) => {
  const {template} = module || {};

  const {funcBtns = {}} = template || {};

  const {form: formFuncBnts = [], list: listFuncBnts = []} = funcBtns || {};

  const formSet = new Set();
  const listSet = new Set();

  formFuncBnts.forEach(item => {
    if (item.status === common.ACTIVE) {
      formSet.add(item.scriptName);
    }
  });

  listFuncBnts.forEach(item => {
    if (item.status === common.ACTIVE) {
      listSet.add(item.scriptName);
    }
  });

  return {
    formSet,
    listSet,
  };
};

export const filterModuleUpdate = ({data}) => {
  // 定义后台接口需要的字段
  const apiData = new Set([
    'template',
    'name',
    'tableInfo',
    'appID',
    'crossChain',
    'queryConditions',
    'moduleParentID',
    'uniqueIndexes',
    'globalEnabled',
  ]);
  // 仅传定义的数据
  const apiModule = {};
  Object.keys(data).forEach(item => {
    if (apiData.has(item)) {
      apiModule[item] = data[item];
    }
  });
  return apiModule;
};
