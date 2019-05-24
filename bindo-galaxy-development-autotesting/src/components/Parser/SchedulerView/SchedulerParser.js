
import React, { Component } from 'react'
import { Radio, message, Modal } from 'antd'
import moment from 'moment'
import lodash from 'lodash'
import Scheduler from '../../dhtmlx/Scheduler'
import {
  createUuid,
  findNode,
} from '../../../utils';
import SchedulerModuleFormModal from './SchedulerModuleFormModal'
import {
  parseParams,
  parseInfoByFieldAndRecord,
  parseModuleFormData,
} from '../../../utils/galaxy';
import {
  parseTableData,
} from '../../../utils/module';
import widgets from '../../../constants/widgets'
import reduxKey from '../../../constants/reduxKey'
import {
  createRecord,
  updateRecord,
  deleteRecord,
} from '../../../data/graphql/record'
import common from '../../../constants/common'

const prefix = 'b-g-schedule';
const DateConstants = {
  MONTH: 'MONTH',
  DAY: 'DAY',
  WEEK: 'WEEK',
}

class SchedulerParser extends Component {
  state = {
    schedulerID: createUuid(),
    recordData: {},
    eventID: '',
    showDeleteConfirmModal: false,
  }

  componentDidMount () {
    const {
      lng = common.chinese,
      t,
    } = this.props;
    this.getLocaleLang(lng);

    this.eventIDRefRecordID = {};
    this.relatedDataIndex = -1;
    // 获取要展示的标题字段
    const {
      displayFields,
    } = this.getModuleScheduleInfo();

    window.scheduler.xy.scale_height = 30;
    window.scheduler.config.details_on_create = true;
    window.scheduler.config.details_on_dblclick = true;
    window.scheduler.config.prevent_cache = true;
    window.scheduler.config.show_loading = true;
    window.scheduler.config.drag_move = true;
    window.scheduler.config.drag_resize = true;
    window.scheduler.config.xml_date = '%Y-%m-%d %H:%i';
    window.scheduler.config.separate_short_events = true;
    window.scheduler.config.collision_limit = 100;
    window.scheduler.locale.labels.timeline_tab = 'Timeline';

    const leftHeaderData = this.getLeftHeaderData({
      props: this.props,
    });
    const timelineData = this.getTimelineData();

    window.scheduler.createTimelineView({
      fit_events: true,
      name: 'timeline',
      y_property: '$key',
      render: 'bar',
      x_unit: 'day',
      x_date: '%D',
      x_length: 7,
      x_size: 7,
      x_start: 1,
      x_step: 1,
      scrollable: true,
      section_autoheight: true,
      dy: 50,
      event_dy: 50,
      resize_events: false,
      y_unit: leftHeaderData,
      second_scale: {
        x_unit: 'day',
        x_date: '%F %d',
      },
    });

    // 设置tooltip显示的文字
    window.scheduler.templates.tooltip_text = (start,end, event) =>{
      const {
        records = [],
      } = this.props;

      let record = findNode(records, 'id', event.id)
      if(record === null){
        record = {};
      }
      /* eslint-disable */
      const {
        is_on_leave = false,
      } = record || {};
      const result = `
      <div>
          <div>Leave status: ${is_on_leave ? 'On leave': 'Not on leave'}</div>
          <div>Time: ${moment(start).format('YYYY-MM-DD HH:mm')}-${moment(end).format('YYYY-MM-DD HH:mm')}</div>
        </div>
    `
      /* eslint-enable */
      return result;
    }

    // 拖动event必须在现在时间之后
    window.scheduler.attachEvent('onBeforeEventChanged', (ev) => {
      if(
        moment(ev.start_date).isAfter(moment(moment(), moment.ISO_8601))
        && moment(ev.end_date).isAfter(moment(moment(), moment.ISO_8601))
      ){
        return true;
      } else {
        message.error(t('common:scheduler.timeRangeLimit'))
        return false;
      }
    });

    window.scheduler.attachEvent('onDragEnd', async(id, mode) => {
      if(!id || mode === 'new-size'){
        return;
      }
      const draggedEvent = window.scheduler.getEvent(id);
      const {
        id: eventID = '',
        $key = '',
        /* eslint-disable */
        end_date = '',
        start_date = '',
        /* eslint-enable */
      } = draggedEvent || {};

      const {
        onUpdateRecord,
        relationRecords,
        moduleParent,
        module,
        records,
      } = this.props;

      const {
        appID,
        storeID,
        moduleID,
      } = parseParams(this.props);

      const {
        fields: baseFields = [],
      } = module || {};

      const {
        fields: moduleParentFields = [],
      } = moduleParent || {};

      const fields = [...moduleParentFields, ...baseFields]
      const aaa = new Set(['id', 'created_at', 'updated_at']);
      const values = {};
      fields.forEach(item => {
        if (!aaa.has(item.name)) {
          values[item.name] = undefined;
        }
      })

      const moduleRelationRecords = relationRecords[moduleID] || {};
      const record = findNode(records, 'id', this.eventIDRefRecordID[eventID])

      // 需要把moduleParent插入到module里
      if (!lodash.isEmpty(moduleParent)) {
        module.moduleParent = moduleParent;
      }

      const {
        valueField,
        startFieldName,
        endFieldName,
      } = this.getModuleDisplayAndValueField() || {};

      values[valueField] = $key;
      /* eslint-disable */
      values[startFieldName] = start_date;
      values[endFieldName] = end_date;
      /* eslint-enable */
      let tempRecord = {};
      if (lodash.isObject(record) && lodash.isObject(record.record)) {
        tempRecord = lodash.cloneDeep(record.record)
      }

      const data = parseModuleFormData({
        data: values,
        sourceData: tempRecord,
        module,
        props: this.props,
        storeID,
        appID,
        moduleRelationRecords,
      });

      const newRecord = await updateRecord({
        storeID,
        moduleID,
        input: {
          id: record.id,
          formRecord: data,
        },
      });
      // 更新store record
      onUpdateRecord(newRecord);
      this.resetViewData(eventID, newRecord);

    });

    // 事件上展示的字段
    window.scheduler.templates.event_bar_text = (start, end, event) => {
      if(
        event.id
        && Array.isArray(event.displayFieldNameLeft)
        && Array.isArray(event.displayFieldNameRight)
      ){
        // 颜色判断设置
        // event.color = 'red'
        const {
          records = [],
        } = this.props;
        const record = findNode(records, 'id', event.id)
        const left = [];
        event.displayFieldNameLeft.forEach(item => left.push(
          `<p>${
            this.getFormatedEventData(item, record)
          }</p>`
        ))
        const right = [];
        event.displayFieldNameRight.forEach(item => right.push(`<p>${
          this.getFormatedEventData(item, record)
        }</p>`
        ))

        return `
          <div class='b-g-scheduler-show-title-container'>
            <div class='b-g-scheduler-show-title-left'>
            ${left.join('')}
            </div>
            <div class='b-g-scheduler-show-title-right'>
              ${right.join('')}
            </div>
          </div>
        `
      }
    }

    window.scheduler.templates.timeline_scale_label = (key, label, section) => this.getTimelineScaleLabel({
      fields: displayFields,
      data: section,
    });

    window.scheduler.date.timeline_start = window.scheduler.date.week_start;

    window.scheduler.attachEvent('onBeforeViewChange', (oldMode, oldDate, mode, date) => {
      this.dateMode = this.dateMode || DateConstants.WEEK;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1);
      const d = new Date(year, month, 0);
      const daysInMonth = d.getDate();
      if (this.dateMode === DateConstants.WEEK) {
        window.scheduler.matrix.timeline.x_size = 7;
        window.scheduler.matrix.timeline.x_length = 7;
      } else if (this.dateMode === DateConstants.MONTH) {
        window.scheduler.matrix.timeline.x_size = daysInMonth;
        window.scheduler.matrix.timeline.x_length = daysInMonth;
      } else if (this.dateMode === DateConstants.DAY) {
        window.scheduler.matrix.timeline.x_size = 48;
        window.scheduler.matrix.timeline.x_length = 48;
      }
      return true;
    });

    window.scheduler.attachEvent('onBeforeLightbox', this.handleBeforeLightbox);
    window.scheduler.attachEvent('onCellDblClick', (xIndex, yIndex, xVal) => {
      this.selectedCellDate = moment(xVal).format('YYYY-MM-DD HH:mm');
      this.relatedDataIndex = yIndex - 1;
    });

    window.scheduler.attachEvent('onBeforeExternalDragIn', () => false);

    this.initScheduler({
      displayFields,
      timelineData,
    });
  }

  getLocaleLang = (lng) => {
    /* eslint-disable */
    if (lng === common.chinese) {
      (function (e) {
        e.config.day_date = "%M %d日 %D",
          e.config.default_date = "%Y年 %M %d日",
          e.config.month_date = "%Y年 %M",
          e.locale = {
            date: {
              month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
              month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
              day_short: ["日", "一", "二", "三", "四", "五", "六"]
            },
            labels: {
              dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "保存", icon_cancel: "关闭",
              icon_details: "详细", icon_edit: "编辑", icon_delete: "删除", confirm_closing: "请确认是否撤销修改!", confirm_deleting: "是否删除日程?", section_description: "描述", section_time: "时间范围", full_day: "整天", confirm_recurring: "请确认是否将日程设为重复模式?", section_recurring: "重复周期", button_recurring: "禁用", button_recurring_open: "启用", button_edit_series: "编辑系列", button_edit_occurrence: "编辑实例", agenda_tab: "议程", date: "日期", description: "说明", year_tab: "今年", week_agenda_tab: "议程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel",
              next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute"
            }
          }
      })(window.scheduler)

    } else if (lng === common.chineseHK) {
      (function (e) {
        e.config.day_date = "%M %d日 %D",
          e.config.default_date = "%Y年 %M %d日",
          e.config.month_date = "%Y年 %M",
          e.locale = {
            date: {
              month_full: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
              month_short: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
              day_full: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
              day_short: ["日", "一", "二", "三", "四", "五", "六"]
            },
            labels: {
              dhx_cal_today_button: "今天", day_tab: "日", week_tab: "周", month_tab: "月", new_event: "新建日程", icon_save: "存儲", icon_cancel: "关闭",
              icon_details: "詳細", icon_edit: "編輯", icon_delete: "刪除", confirm_closing: "請確認是否撤銷修改!", confirm_deleting: "是否刪除日程?", section_description: "描述", section_time: "時間範圍", full_day: "整天", confirm_recurring: "請確認是否將日程設為重複模式?", section_recurring: "重複週期", button_recurring: "禁用", button_recurring_open: "啟用", button_edit_series: "編輯系列", button_edit_occurrence: "編輯實例", agenda_tab: "議程", date: "日期", description: "說明", year_tab: "今年", week_agenda_tab: "議程", grid_tab: "电网", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel",
              next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute"
            }
          }
      })(window.scheduler)

    } else if (lng === common.english) {
      (function (e) {
        e.locale = {
          date: {
            month_full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            day_full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          },
          labels: {
            dhx_cal_today_button: "Today", day_tab: "Day", week_tab: "Week", month_tab: "Month", new_event: "New event", icon_save: "Save",
            icon_cancel: "Cancel", icon_details: "Details", icon_edit: "Edit", icon_delete: "Delete", confirm_closing: "", confirm_deleting: "Event will be deleted permanently, are you sure?", section_description: "Description", section_time: "Time period", full_day: "Full day", confirm_recurring: "Do you want to edit the whole set of repeated events?", section_recurring: "Repeat event", button_recurring: "Disabled", button_recurring_open: "Enabled", button_edit_series: "Edit series", button_edit_occurrence: "Edit occurrence", agenda_tab: "Agenda",
            date: "Date", description: "Description", year_tab: "Year", week_agenda_tab: "Agenda", grid_tab: "Grid", drag_to_create: "Drag to create", drag_to_move: "Drag to move", message_ok: "OK", message_cancel: "Cancel", next: "Next", prev: "Previous", year: "Year", month: "Month", day: "Day", hour: "Hour", minute: "Minute"
          }
        }
      })(window.scheduler)
    }
    /* eslint-enable */
  }

  // 格式化事件等相关数据
  getFormatedEventData = (item, record) => {
    let res;
    const {
      record: innerRecord = {},
    } = record || {};
    const {
      staff_code: staffCode = {},
    } = innerRecord;
    const {
      record: staffRecord = {},
    } = staffCode;
    const {
      staff_code: neededStaffCode = {},
    } = staffRecord;
    if(
      item === 'start_time' ||
      item === 'end_time' ||
      item === 'created_at' ||
      item === 'updated_at'
    ){
      res = moment(innerRecord[item]).format('MM-DD HH:mm') || ''
    } else if(item === 'staff_code'){
      res = neededStaffCode || ''
    } else if(item === 'is_on_leave'){
      res = innerRecord[item] ? 'On leave' : 'Not on leave'
    } else {
      res = innerRecord[item] || ''
    }
    return res;
  }

  // 双击时弹出弹窗 阻止默认弹窗显示
  handleBeforeLightbox = (eventID) => {
    // 事件和记录id关联时，即存在该事件时
    if (this.eventIDRefRecordID[eventID]) {
      const {
        records,
        scheduler,
      } = this.props;

      const {
        objectField = {},
      } = scheduler || {};
      const {
        name = '',
      } = objectField;
      // 通过事件id找到记录id => 找到该记录
      const record = findNode(records, 'id', this.eventIDRefRecordID[eventID])
      const recordData = parseTableData({ data: record })
      // 在unassigned行上面双击时，recordData[name]（staff_code)设置为空
      if(recordData[name] === common.UNASSIGNED){
        recordData[name] = '';
      }
      this.setState({
        showModuleFormModal: true,
        recordData,
        eventID,
      });
    } else {
      // 新建事件时
      this.getRelatedDataAndShowModal(eventID, 3);
    }
    return false;
  }

  getRelatedDataAndShowModal = (eventID, count = 0) => {
    if (count < 1) {
      this.showRecordModal(eventID, -1);
      return;
    }
    setTimeout(() => {
      if (this.relatedDataIndex > -1) {
        this.showRecordModal(eventID, this.relatedDataIndex);
      } else {
        this.getRelatedDataAndShowModal(eventID, --count);
      }
    }, 10);
  }

  showRecordModal = (eventID, rowRecordIndex) => {
    const {
      scheduler,
      rowRecords = [],
    } = this.props;
    this.relatedDataIndex = -1;
    const {
      objectField = {},
      endFieldName,
      startFieldName,
    } = scheduler || {};
    const {
      name = '',
    } = objectField;
    // $id在设置默认值时是必须的
    const recordData = {
      $id: eventID,
    };
    if (rowRecordIndex > -1 && name && Array.isArray(rowRecords) && rowRecords.length > rowRecordIndex) {
      const rowRecord = rowRecords[rowRecordIndex];
      if (rowRecord.record && rowRecord.record[name]) {
        // 双击cell时会设置 modal name(staff_code)默认值
        recordData[name] = rowRecord;
      }
    }
    // 双击cell时会设置 modal 默认时间的值
    if(this.selectedCellDate){
      recordData[endFieldName] = this.selectedCellDate;
      recordData[startFieldName] = this.selectedCellDate;
    }
    this.setState({
      showModuleFormModal: true,
      recordData,
      eventID,
    });
  }

  getModuleScheduleInfo = () => {
    const {
      scheduler,
      rowModule,
    } = this.props;

    const {
      fields = [],
    } = rowModule || {};

    const {
      objectDisplayFields = [],
    } = scheduler || {};

    const displayFields = [];
    objectDisplayFields.forEach(item => {
      const tempField = findNode(fields, 'name', item.name)
      if (tempField) {
        displayFields.push(tempField)
      }
    })
    const newDisplayFields = [];
    displayFields.forEach(item => newDisplayFields.push({
      uuid: item.uuid,
      label: item.label,
      name: item.name,
    }))

    return {
      'displayFields': newDisplayFields,
    }
  }

  getLeftHeaderData = ({
    props,
  }) => {
    const leftHeaderData = [];

    const {
      rowRecords = [],
      scheduler = {},
      rowModule,
    } = props

    const {
      objectDisplayFields = [],
      objectField,
    } = scheduler || {};
    const {
      name: objectFieldName = '',
    } = objectField || {};
    const {
      fields: rowFields = [],
    } = rowModule;
    rowRecords.forEach(item => {
      let {
        record = {},
      } = item || {};
      record = record || {};

      const tempData = {};
      if (record && record[objectFieldName]) {
        tempData.id = record[objectFieldName];
        tempData.key = record[objectFieldName];
      }
      objectDisplayFields.forEach(objectDisplayField => {
        if (objectDisplayField && objectDisplayField.name) {
          const rowField = findNode(rowFields, 'name', objectDisplayField.name);
          if (rowField) {
            if (rowField.viewType === widgets.MANY_TO_ONE) {
              const tempRowRocord = record[objectDisplayField.name] || {};
              const {
                displayValue: fieldDisplayValue = '',
              } = parseInfoByFieldAndRecord({
                field: rowField,
                record: tempRowRocord,
              });
              tempData[objectDisplayField.name] = fieldDisplayValue;
            } else {
              tempData[objectDisplayField.name] = record[objectDisplayField.name] || ''
            }
          }
        }
      })

      leftHeaderData.push({
        id: record.id,
        key: record.id,
        ...tempData,
      });
    })
    // 在表的最上面添加一个空行
    leftHeaderData.unshift({
      id: common.UNASSIGNED,
      key: common.UNASSIGNED,
    })

    return leftHeaderData;
  }

  getModuleDisplayAndValueField = () => {
    const {
      module,
      scheduler,
    } = this.props;

    const {
      objectField,
      displayFieldNameLeft,
      displayFieldNameRight,
      endFieldName,
      startFieldName,
    } = scheduler || {};
    const {
      name = '',
    } = objectField || {};

    const {
      fields = [],
    } = module || {};

    const field = findNode(fields, 'name', name);
    const {
      allowValue = {},
    } = field || {};

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    const {
      valueField,
      displayField,
    } = dynamicItemSource || {};

    return {
      name,
      valueField,
      displayField,
      displayFieldNameLeft,
      displayFieldNameRight,
      endFieldName,
      startFieldName,
    }
  }

  // scheduler events 数据
  getTimelineData = () => {
    const timelineData = [];

    const {
      records = [],
    } = this.props;

    const {
      name,
      valueField,
      displayFieldNameLeft,
      displayFieldNameRight,
      endFieldName,
      startFieldName,
    } = this.getModuleDisplayAndValueField() || {};

    (records || []).forEach(item => {
      const newRecord = this.parseTimelineData({
        data: item,
        name,
        valueField,
        displayFieldNameLeft,
        displayFieldNameRight,
        endFieldName,
        startFieldName,
      });

      if (newRecord && !lodash.isEmpty(newRecord)) {
        timelineData.push(newRecord)
      }
    });

    return timelineData;
  }

  parseTimelineData = ({
    data,
    name,
    valueField,
    displayFieldNameLeft,
    displayFieldNameRight,
    endFieldName,
    startFieldName,
  }) => {
    let newRecord = {};
    let {
      record: itemRecord = {},
    } = data || {};

    itemRecord = itemRecord || {};
    let $key = common.UNASSIGNED;
    const relatedFieldData = itemRecord[name];
    if (itemRecord && itemRecord.id) {
      if(relatedFieldData){
        let relatedFieldDataRecord;
        if (relatedFieldData.record) {
          relatedFieldDataRecord = relatedFieldData.record;
        }

        if (
          relatedFieldDataRecord &&
          relatedFieldDataRecord[valueField]
        ) {
          $key = relatedFieldDataRecord[valueField];
        }

      }
      this.eventIDRefRecordID[itemRecord.id] = itemRecord.id;
    }

    // 过滤掉没有startFieldName endFieldName的数据
    if(
      itemRecord &&
      itemRecord.id &&
      itemRecord[startFieldName] &&
      itemRecord[endFieldName]
    ){
      // newRecord可以认为是eventData
      newRecord = {
        id: itemRecord.id,
        $key,
        start_date: this.getDateValue(itemRecord[startFieldName], 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm')|| '',
        end_date: this.getDateValue(itemRecord[endFieldName], 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') || '',
        displayFieldNameLeft,
        displayFieldNameRight,
      };
      return newRecord;
    }
  }

  getDateValue = (value, format) => {
    let dateValue;
    if (value.indexOf('T') > -1) {
      dateValue = moment(value, moment.ISO_8601);
    } else {
      dateValue = moment(value, format);
    }
    return dateValue;
  }

  initScheduler = ({
    displayFields,
    timelineData,
  }) => {
    const {
      schedulerID,
    } = this.state;

    const initDate = window.scheduler.date.week_start(new Date());
    window.scheduler.init(schedulerID, initDate, 'timeline');
    window.scheduler.parse(timelineData, 'json');

    this.initTimelineScaleHeader({
      fields: displayFields,
    });
  }

  // 左侧数据展示
  getTimelineScaleLabel = ({
    data,
    fields,
  }) => {
    const labelHtmlArray = [];
    fields.forEach((item) => {
      labelHtmlArray.push(`
      <div class='timeline_item_cell' style="border-left: 1px solid #cecece;width:${100 / fields.length}%">${data[item.name]}</div>
      `)
    });

    return labelHtmlArray.join('')
  }

  // 初始化左上角标题
  initTimelineScaleHeader = ({
    fields,
  }) => {
    fields = fields || [];
    const {
      schedulerID,
    } = this.state;

    const element = document.getElementById(schedulerID);
    const elements = element.getElementsByClassName('collection_label');
    for (let i = 0; i < elements.length; i++) {
      const item = elements[i];
      element.removeChild(item);
    }
    const top = window.scheduler.xy.nav_height + 1 + 1;
    const height = window.scheduler.xy.scale_height;
    const width = window.scheduler.matrix.timeline.dx;
    const header = document.createElement('div');
    header.className = 'collection_label';
    header.style.position = 'absolute';
    header.style.zIndex = 99;
    header.style.top = `${top}px`;
    // header.style.width = `${100/fields.length}%`;
    header.style.minWidth = `${width}px`;
    header.style.height = `${height}px`;

    const style = `width: ${100 / fields.length}%;`

    const headerHtmlArray = [];
    fields.forEach((item) => {
      headerHtmlArray.push(`
      <div class='timeline_item_cell' style="border-left: 1px solid #cecece;${style}">${item.label}</div>
      `)
    })

    header.innerHTML = headerHtmlArray.join('');
    element.appendChild(header);
  }

  renderTimelineMode = (key) => {
    this.dateMode = key || DateConstants.WEEK;
    if (key === DateConstants.MONTH) {
      window.scheduler.matrix.timeline.x_step = 1;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_unit = 'day';
      window.scheduler.matrix.timeline.x_date = '%d';
      window.scheduler.matrix.timeline.second_scale = {
        x_unit: 'month',
        x_date: '%Y %F ',
      };
      window.scheduler.date.timeline_start = window.scheduler.date.month_start;
      window.scheduler.date.add_timeline = (date, step) => {
        if (step > 0) {
          step = 1;
        } else if (step < 0) {
          step = -1;
        }
        return window.scheduler.date.add(date, step, 'month');
      }
    } else if (key === DateConstants.WEEK) {
      window.scheduler.matrix.timeline.x_step = 1;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_unit = 'day';
      window.scheduler.matrix.timeline.x_date = '%D';
      window.scheduler.matrix.timeline.second_scale = {
        x_unit: 'day',
        x_date: '%F %d',
      };
      window.scheduler.date.timeline_start = window.scheduler.date.week_start;
      window.scheduler.date.add_timeline = (date, step) => {
        if (step > 0) {
          step = 1;
        } else if (step < 0) {
          step = -1;
        }
        return window.scheduler.date.add(date, step * 7, 'day');
      }
    } else if (key === DateConstants.DAY) {
      window.scheduler.matrix.timeline.x_step = 30;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_unit = 'minute';
      window.scheduler.matrix.timeline.x_date = '%H:%i';
      window.scheduler.matrix.timeline.second_scale = {
        x_unit: 'day',
        x_date: '%Y %F %d',
      };
      window.scheduler.date.timeline_start = window.scheduler.date.day_start;
      window.scheduler.date.add_timeline = (date, step) => {
        if (step > 0) {
          step = 1;
        } else if (step < 0) {
          step = -1;
        }
        return window.scheduler.date.add(date, step, 'day');
      }
    }
    window.scheduler.templates.timeline_scale_date = window.scheduler.date.date_to_str(window.scheduler.matrix.timeline.x_date);
    window.scheduler.templates.timeline_second_scale_date = window.scheduler.date.date_to_str(window.scheduler.matrix.timeline.second_scale.x_date);
    window.scheduler.setCurrentView();

  }

  handleSave = async (data) => {
    this.relatedDataIndex = -1;
    const {
      t,
      dispatch,
      onUpdateRecord,
      onInsertRecord,
    } = this.props;

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);
    const {
      recordData,
      eventID,
    } = this.state;

    let newRecord = {};
    try {
      let isNew = false;
      if (recordData.id) {
        newRecord = await updateRecord({
          storeID,
          moduleID,
          input: {
            id: recordData.id,
            formRecord: data,
          },
        });

        onUpdateRecord(newRecord);
      } else {
        isNew = true;
        delete data.id;

        newRecord = await createRecord({
          storeID,
          moduleID,
          input: {
            formRecord: data,
          },
        });
        onInsertRecord(newRecord);
      }

      this.resetViewData(eventID, newRecord, isNew);

    } catch (error) {
      message.error(t(`common:module.${recordData.id ? 'edit' : 'new'}Failed`));
      log.error(error);
    }

    this.setState({
      showModuleFormModal: false,
    });

    dispatch({
      type: reduxKey.UPDATE_GALAXY_REDUCER,
      payload: {
        galaxyLoading: false,
      },
    });

    dispatch({
      type: reduxKey.CLEAR_RELATION_RECORDS,
    });
  }

  resetViewData = (eventID, record, isNew) => {
    const {
      name,
      valueField,
      displayFieldNameLeft,
      displayFieldNameRight,
      startFieldName,
      endFieldName,
    } = this.getModuleDisplayAndValueField() || {};

    const timelineData = this.parseTimelineData({
      data: record,
      name,
      valueField,
      displayFieldNameLeft,
      displayFieldNameRight,
      startFieldName,
      endFieldName,
    });

    if (timelineData && eventID) {

      const eventData = {};
      Object.keys(timelineData).forEach(key => {
        const tempValue = timelineData[key] || '';
        window.scheduler.getEvent(eventID)[key] = tempValue;
        eventData[key] = tempValue;
      })
      // start_date end_date是dhtmlx库展示event必须字段
      window.scheduler.getEvent(eventID).start_date = new Date(timelineData.start_date);
      window.scheduler.getEvent(eventID).end_date = new Date(timelineData.end_date);
      eventData.start_date = new Date(timelineData.start_date);
      eventData.end_date = new Date(timelineData.end_date);
      // 新建事件：先添加、关联事件id和记录id、删除原始event
      if (isNew) {
        const newEventID = window.scheduler.addEvent(eventData);
        this.eventIDRefRecordID[newEventID] = record.id;
        window.scheduler.deleteEvent(eventID);
      } else {
        // 更新原有事件
        this.eventIDRefRecordID[eventID] = record.id;
        window.scheduler.updateEvent(eventID);
      }
    }
  }

  handleDelete = async () => {
    this.relatedDataIndex = -1;

    const {
      recordData = {},
    } = this.state;

    const {
      id: recordID,
    } = recordData;

    const {
      t,
      dispatch,
      onDeleteRecord,
    } = this.props;

    const {
      storeID,
      moduleID,
    } = parseParams(this.props);

    try {
      if (recordID) {
        await deleteRecord({
          storeID,
          moduleID,
          recordID,
        });

        onDeleteRecord(recordID);
        let eventID = -1;
        Object.keys(this.eventIDRefRecordID).forEach(item => {
          if (this.eventIDRefRecordID[item] === recordID) {
            eventID = item;
          }
        })
        window.scheduler.deleteEvent(eventID)

        this.setState({
          showModuleFormModal: false,
          showDeleteConfirmModal: false,
        })

        dispatch({
          type: reduxKey.UPDATE_GALAXY_REDUCER,
          payload: {
            galaxyLoading: false,
          },
        });

        dispatch({
          type: reduxKey.CLEAR_RELATION_RECORDS,
        });
      }

    } catch (error) {
      message.error(t('common:module.deleteFailed'));
      log.error(error);
    }
  }

  handleCancel = () => {
    this.relatedDataIndex = -1;
    const {
      eventID,
    } = this.state;
    if (!this.eventIDRefRecordID[eventID]) {
      window.scheduler.deleteEvent(eventID);
    }
    this.setState({
      showModuleFormModal: false,
    });
  }

  deleteConfirmCancel =() => {
    this.setState({
      showModuleFormModal: true,
      showDeleteConfirmModal: false,
    })
  }

  resetParentState = () => {
    this.setState({
      showModuleFormModal: false,
      showDeleteConfirmModal: true,
    })
  }

  render () {
    const {
      schedulerID = '',
      showModuleFormModal = false,
      recordData,
      showDeleteConfirmModal = false,
    } = this.state;

    const {
      t,
    } = this.props;

    const {
      appID,
      storeID,
      moduleID,
    } = parseParams(this.props);

    return (
      <div className={prefix} style={{ width: '100%', height: '100%' }}>
        <Radio.Group
          defaultValue={DateConstants.WEEK}
          className={`${prefix}-custom-button-group`}
        >
          <Radio.Button value={DateConstants.DAY} onClick={() => this.renderTimelineMode(DateConstants.DAY)}>{t('common:scheduler.day')}</Radio.Button>
          <Radio.Button value={DateConstants.WEEK} onClick={() => this.renderTimelineMode(DateConstants.WEEK)}>{t('common:scheduler.week')}</Radio.Button>
          <Radio.Button value={DateConstants.MONTH} onClick={() => this.renderTimelineMode(DateConstants.MONTH)}>{t('common:scheduler.month')}</Radio.Button>
        </Radio.Group>
        <Scheduler
          schedulerID={schedulerID}
        />
        {
          showModuleFormModal &&
          <SchedulerModuleFormModal
            {...this.props}
            editableData={true}
            record={recordData}
            moduleID={moduleID}
            storeID={storeID}
            appID={appID}
            onCancel={this.handleCancel}
            onSave={this.handleSave}
            resetParentState={this.resetParentState}
          />
        }
        {
          showDeleteConfirmModal &&
          <Modal
            visible={true}
            centered={true}
            title={t('common:deleteConfirm')}
            okText={t('common:yes')}
            okType='danger'
            cancelText={t('common:no')}
            onOk={this.handleDelete}
            onCancel={this.deleteConfirmCancel}
          >
            {t('common:editor.deleteOption')}
          </Modal>
        }
      </div>
    );
  }
}

export default SchedulerParser;
