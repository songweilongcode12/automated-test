import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import SortableJS from 'sortablejs';
import { Modal, Select } from 'antd';
import { create } from './ViewFactory';
import widgets from '../../constants/widgets';
import common from '../../constants/common';
import reduxKey from '../../constants/reduxKey';
import { createUuid } from '../../utils';
import { filterOption } from '../../utils/galaxy';

let selectionMode = common.RADIO;
let columnCount = 2;
let relationModuleID = '';

@translate()
@connect(({ module }) => ({ ...module }))
class Sortable extends Component {
  static defaultProps = {
    options: {},
  };

  componentDidMount() {
    const {
      options,
      sortableDisabled = false,
    } = this.props;
    this.sortable = SortableJS.create(this.container, {
      onAdd: this.onAdd,
      onEnd: this.onEnd,
      disabled: sortableDisabled,
      onChoose: this.onChoose,
      handle: '.bg-c-drag-node',
      animation: 150,
      ...options,
    });
  }

  componentWillUnmount() {
    if (this.sortable) {
      this.sortable.destroy();
      this.sortable = null;
    }
  }

  insertColumns = (params) => {
    const { t } = this.props;
    const { data } = params;
    columnCount = 2;
    const columns = [2, 3, 4, 6];
    Modal.info({
      title: t('common:editor.displayedColumns'),
      content: (
        <Select
          defaultValue={columnCount}
          style={{width: '100%'}}
          onChange={value => {
            columnCount = value;
          }}
        >
          {
            columns.map(colNum => (
              <Select.Option key={colNum} value={colNum}>
                {colNum}
              </Select.Option>
            ))
          }
        </Select>
      ),
      onOk: () => {
        data.children = [];
        for (let i = 0; i < columnCount; i++) {
          data.children.push({
            uuid: createUuid(),
            parentUuid: data.uuid,
            viewType: widgets.COLUMNS_ITEM,
            title: `New Column ${i+1}`,
            children: [],
          });
        }
        this.insertItem({
          ...params,
          data,
        });
      },
    });
  }

  insertSelection = (params) => {
    const { t } = this.props;
    const { data } = params;
    selectionMode = common.RADIO;

    Modal.info({
      title: t('common:editor.selectMode'),
      content: (
        <Select
          defaultValue={selectionMode}
          style={{width: '100%'}}
          onChange={value => {
            selectionMode = value;
          }}
        >
          <Select.Option key="singleChoice" value={common.RADIO}>
            {t('common:editor.singleChoice')}
          </Select.Option>
          <Select.Option key="multipleChoice" value={common.MULTIPLE}>
            {t('common:editor.multipleChoice')}
          </Select.Option>
        </Select>
      ),
      onOk: () => {
        data.mode = selectionMode;
        if (selectionMode === common.MULTIPLE) {
          data.allowMultiValue = true;
        }
        this.insertItem({
          ...params,
          data,
        });
      },
    });
  }

  insertRelationModule = (params) => {
    relationModuleID = '';
    const { t, existingModules } = this.props;
    const { data } = params;

    Modal.info({
      title: t('common:editor.selectModule'),
      content: (
        <Select
          showSearch
          optionFilterProp="children"
          filterOption={filterOption}
          defaultValue={relationModuleID}
          style={{width: '100%'}}
          onChange={value => {
            relationModuleID = value;
          }}
        >
          {
            existingModules.map(item =>(
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))
          }
        </Select>
      ),
      onOk: () => {
        if (data.viewType === widgets.MANY_TO_MANY) {
          data.relation = {
            relatedModuleID: relationModuleID,
          };
          data.type = common.RELATION;
          data.allowMultiValue = true;
          data.searchableFields = [];
        }

        if (data.viewType === widgets.ONE_TO_MANY) {
          data.relation = {
            relatedModuleID: relationModuleID,
            fieldMapping: [],
          };
          data.type = common.RELATION;
          data.allowMultiValue = true;
        }

        if (data.viewType === widgets.MANY_TO_ONE) {
          data.mode = common.RADIO;
          data.type = common.BASIC;
          data.dataType = widgets.SELECTION;
          data.relation = {
            relatedModuleID: relationModuleID,
            fieldMapping: [],
          };
          data.allowValue = {
            type: common.DYNAMIC,
            dynamicItemSource: {
              moduleID: relationModuleID,
              exportFields: [],
            },
          }
          data.allowMultiValue = false;
        }

        if (data.viewType === widgets.RELATED_FIELD) {
          // data.link = {
          //   linkedModuleID: relationModuleID,
          // };
          data.relation = {
            relatedModuleID: relationModuleID,
            fieldMapping: [],
          };
          data.queryEvaluation = {
            type: common.PLAIN,
            exportFields: [],
          }
          data.dataType = widgets.MANY_TO_ONE;
          data.type = common.RELATION;
          data.readOnly = true;
        }

        if (data.viewType === widgets.ONE_TO_ONE) {
          data.relation = {
            relatedModuleID: relationModuleID,
            fieldMapping: [],
          };
          data.type = common.RELATION;
          data.allowMultiValue = false;
        }

        if (relationModuleID) {
          this.insertItem({
            ...params,
            data,
          });
        } else {
          const { from, item } = params;
          if (from.dataset.type === 'formview-widgets') {
            item.parentNode.removeChild(item);
          }
        }
      },
    });
  }

  onAdd = evt => {
    // console.log('------Container onAdd------evt: ', evt);

    const { item, newIndex, to: { dataset: { uuid: parentUuid } }, from } = evt;
    const { dataset } = item;

    if (dataset.viewType === widgets.TEMP_EDITOR) {
      if (from.dataset.type === 'formview-widgets') {
        item.parentNode.removeChild(item);
      }
      return;
    }

    const newUuid = createUuid();
    const data = {
      parentUuid,
      uuid: newUuid,
      name: '',
      label: dataset.text,
      title: dataset.title,
      type: common.BASIC,
      dataType: dataset.viewType,
      viewType: dataset.viewType,
      allowMultiValue: false,
      isBindField: false,
      readOnly: false,
      invisible: false,
      required: false,
      i18n: {},
    };

    const params = { data, newIndex, dataset, from, item };

    if (dataset.viewType === widgets.SELECTION) {
      this.insertSelection(params);
    } else if (dataset.viewType === widgets.COLUMNS) {
      this.insertColumns(params);
    } else if (
      dataset.viewType === widgets.MANY_TO_MANY
      || dataset.viewType === widgets.ONE_TO_MANY
      || dataset.viewType === widgets.MANY_TO_ONE
      || dataset.viewType === widgets.RELATED_FIELD
      || dataset.viewType === widgets.ONE_TO_ONE
    ) {
      this.insertRelationModule(params);
    } else {
      this.insertItem(params);
    }
  }

  insertItem = ({
    data,
    newIndex,
    dataset,
    from,
    item,
  }) => {
    const tabUuid = createUuid();
    switch(dataset.viewType) {
      case widgets.TEXT:
        data.addonBefore = [];
        data.addonAfter = [];

        break;
      case widgets.MULTILINE_TEXT:
        data.visibleRows = 3;

        break;
      case widgets.DATE_RANGE:
        data.allowMultiValue = true;

        break;
      case widgets.CHECKBOX:
        data.allowMultiValue = true;
        data.allowValue = {
          type: common.STATIC,
          staticItems: [],
        };

        break;
      case widgets.RADIO:
      case widgets.SELECTION:
        data.allowValue = {
          type: common.STATIC,
          staticItems: [],
        };

        break;
      case widgets.LABEL:
        data.label = `New ${dataset.text}`;
        data.fontWeight = 500;
        data.fontSize = 14;

        break;

      case widgets.INTEGER_NUMBER:
        data.step = 1;

        break;
      case widgets.DECIMAL_NUMBER:
        data.step = 1;
        data.precision = 1;

        break;
      case widgets.TABS:
        data.children = [{
          uuid: tabUuid,
          parentUuid: data.uuid,
          viewType: widgets.TABS_ITEM,
          title: 'New Tab',
          children: [],
        }];
        data.activeKey = tabUuid;

        break;
      case widgets.UPLOAD:
      case widgets.IMAGE:
        data.buttonText = 'Click to upload';
        break;
      case widgets.SEQNO:
        data.readOnly = true;
        break;
      case widgets.VIDEOPLAYER:
        data.readOnly = true;
        break;
      default:
        break;
    }

    const { dispatch } = this.props;

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [{
          operate: 'insert',
          index: newIndex,
          data,
        }],
      },
    });

    if (from.dataset.type === 'formview-widgets') {
      item.parentNode.removeChild(item);
    }
  }

  onEnd = evt => {
    // console.log('------Container onEnd------evt: ', evt);

    const { newIndex, oldIndex, from: fromItem, to: toItem } = evt;
    const fromUuid = fromItem.dataset.uuid;
    const toUuid = toItem.dataset.uuid;
    if (newIndex === oldIndex || fromUuid !== toUuid) {
      return;
    }

    const { dispatch } = this.props;

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [{
          operate: 'move',
          fromUuid,
          toUuid,
          newIndex,
          oldIndex,
        }],
      },
    });
  }

  onChoose = evt => {
    // console.log('------Container onChoose------evt: ', evt);
    const { dispatch, selectedViewUuid } = this.props;
    const { item: { dataset } } = evt;
    if (dataset.uuid !== selectedViewUuid) {
      setTimeout(() => {
        dispatch({
          type: reduxKey.SET_SELECTED_VIEW_UUID,
          payload: dataset.uuid,
        });
      }, 10);
    }
  }

  getField = (item, fields) => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].uuid === item.uuid) {
        return fields[i];
      }
    }

    return {};
  }

  render() {
    const {
      data = [],
      className,
      style,
      type = '',
      uuid,
      selectedViewUuid,
      moduleEntity,
      sortableDisabled = false,
      fields = [],
    } = this.props;

    const {
      tableInfo,
    } = moduleEntity || {};

    const isBindTable = tableInfo && tableInfo.tableName || false;

    return (
      <div
        className={` ${className}`}
        style={style}
        data-uuid={uuid}
        data-type={type}
        ref={el => { this.container = el; }}
      >
        {
          data.map(view => create({
            view,
            field: this.getField(view, fields),
            selectedViewUuid,
            fields,
            isBindTable,
            sortableDisabled,
          }))
        }
      </div>
    );
  }
}

export default Sortable;
