import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Radio } from 'antd'
import Scheduler from '../../dhtmlx/Scheduler'
import {
  createUuid,
  findNode,
} from '../../../utils';
import {
  parseParams,
  createRouteUrl,
} from '../../../utils/galaxy';
import common from '../../../constants/common';
import routes from '../../../constants/routes';
import { findModuleByID } from '../../../utils/module';

const schedulePrefix = 'bg-editor-schedule';
const galaxyPrefix = 'bg-galaxy';
const DateConstants = {
  MONTH: 'MONTH',
  DAY: 'DAY',
  WEEK: 'WEEK',
}

class SchedulerViewContent extends Component {
  state = {
    schedulerID: createUuid(),
  }

  componentDidMount () {
    const {
      initModule,
    } = this.props;

    initModule();
    const {
      displayFields,
    } = this.getModuleScheduleInfo();

    this.initScheduler({
      displayFields,
      timelineData: [],
    });
  }

  componentDidUpdate() {
    const {
      displayFields,
    } = this.getModuleScheduleInfo();
    this.initTimelineScaleHeader({
      fields: displayFields,
    });
  }

  initScheduler = ({
    displayFields,
    timelineData,
  }) => {
    const {
      schedulerID,
    } = this.state;

    window.scheduler.xy.scale_height = 30;
    window.scheduler.config.details_on_create = true;
    window.scheduler.config.details_on_dblclick = true;
    window.scheduler.config.prevent_cache = true;
    window.scheduler.config.show_loading = true;
    window.scheduler.config.drag_move = false;
    window.scheduler.config.drag_resize = false;
    window.scheduler.config.xml_date = '%Y-%m-%d %H:%i';

    window.scheduler.locale.labels.timeline_tab = 'Timeline';

    window.scheduler.createTimelineView({
      fit_events: true,
      name: 'timeline',
      y_property: '$key',
      render: 'bar',
      x_unit: 'day',
      x_date: '%D',
      x_length: 7,
      x_size: 7,
      // scrollable: true,
      x_start: 1,
      x_step: 1,
      dy: 52,
      event_dy: 48,
      round_position: true,

      y_unit: [],
      second_scale: {
        x_unit: 'day',
        x_date: '%F %d',
      },
    });

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
        window.scheduler.matrix.timeline.x_size = 24;
        window.scheduler.matrix.timeline.x_length = 24;
      }
      return true;
    });

    // 弹出框标题
    window.scheduler.templates.lightbox_header = (start, end) => {
      const formatFunc = window.scheduler.date.date_to_str('%d.%m.%Y');
      return `${formatFunc(start)} - ${formatFunc(end)}`;
    };

    window.scheduler.templates.tooltip_text = () => false;

    const initDate = window.scheduler.date.week_start(new Date());
    window.scheduler.init(schedulerID, initDate, 'timeline');
    window.scheduler.parse(timelineData, 'json');

    this.initTimelineScaleHeader({
      fields: displayFields,
    });
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
    if (!element) {
      return;
    }
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
    header.style.width = `${width}px`;
    header.style.height = `${height}px`;

    const style = `width: ${100 / fields.length}%;`

    const headerHtmlArray = [];
    fields.forEach((item) => {
      headerHtmlArray.push(`
      <div class='timeline_item_cell' style="border-left: 1px solid #cecece;${style}">${item.label}</div>
      `)
      // <div class='timeline_item_separator'></div>
    })
    // headerHtmlArray.push('<div class="timeline_item_separator"></div>');
    header.innerHTML = headerHtmlArray.join('');
    element.appendChild(header);
  }

  getModuleScheduleInfo = () => {
    const {
      moduleEntity,
      storeID,
    } = this.props;

    const {
      template,
      fields = [],
    } = moduleEntity || {};

    const {
      scheduler = {},
    } = template || {};

    const {
      objectDisplayFields = [],
      objectField,
    } = scheduler || {};

    const {
      name: objectFieldName = '',
    } = objectField || {};

    const field = findNode(fields, 'name', objectFieldName);

    const {
      allowValue = {},
    } = field || {};

    const {
      dynamicItemSource = {},
    } = allowValue || {};

    const {
      moduleID,
    } = dynamicItemSource || {};

    const relatedModule = findModuleByID({
      props: this.props,
      storeID,
      moduleID,
    })

    const {
      fields: relatedFields = [],
    } = relatedModule || {};

    const displayFields = [];
    objectDisplayFields.forEach(item => {
      const tempField = findNode(relatedFields, 'name', item.name)
      if (tempField) {
        displayFields.push(tempField)
      }
    })

    return {
      displayFields,
    }
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
        return window.scheduler.date.add(date, step*7, 'day');
      }
    } else if (key === DateConstants.DAY) {
      window.scheduler.matrix.timeline.x_step = 60;
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

  render () {
    const {
      schedulerID,
    } = this.state;
    const {
      galaxyState,
    } = parseParams(this.props);

    if (galaxyState === common.DASHBOARD) {
      return <Redirect to={createRouteUrl(routes.RECORDS, {}, this.props)} />
    }

    return (
      <div className={`${galaxyPrefix}-content ${schedulePrefix}`} style={{ width: '100%', height: '100%' }}>
        <Radio.Group defaultValue={DateConstants.WEEK} className={`${schedulePrefix}-custom-button-group`}>
          <Radio.Button value={DateConstants.DAY} onClick={() => this.renderTimelineMode(DateConstants.DAY)}>日</Radio.Button>
          <Radio.Button value={DateConstants.WEEK} onClick={() => this.renderTimelineMode(DateConstants.WEEK)}>周</Radio.Button>
          <Radio.Button value={DateConstants.MONTH} onClick={() => this.renderTimelineMode(DateConstants.MONTH)}>月</Radio.Button>
        </Radio.Group>
        <Scheduler
          schedulerID={schedulerID}
        />
      </div>
    );
  }
}

export default SchedulerViewContent
