
import React, { Component } from 'react'
import {
  Button,
} from 'antd'
import Scheduler from '../../../../components/dhtmlx/Scheduler'

import {
  createUuid,
} from '../../../../utils'

const ButtonGroup = Button.Group;
const prefix = 'b-g-schedule';
const DateConstants = {
  MONTH: 'MONTH',
  DAY: 'DAY',
  WEEK: 'WEEK',
}

const moduleFields = [
  { uuid: '1', label: 'Number', name: 'label' },
  { uuid: '2', label: 'Type', name: 'type' },
  { uuid: '3', label: 'Status', name: 'status' },
]

const roomsArr = [
  { id: '1', key: '1', label: '101', type: '1', status: '1' },
  { id: '2', key: '2', label: '102', type: '1', status: '3' },
  { id: '3', key: '3', label: '103', type: '1', status: '2' },
  { id: '4', key: '4', label: '104', type: '1', status: '1' },
  { id: '5', key: '5', label: '105', type: '2', status: '1' },
  { id: '6', key: '6', label: '201', type: '2', status: '2' },
  { id: '7', key: '7', label: '202', type: '2', status: '1' },
  { id: '8', key: '8', label: '203', type: '3', status: '3' },
  { id: '9', key: '9', label: '204', type: '3', status: '3' },
  { id: '10', key: '10', label: '301', type: '4', status: '2' },
  { id: '11', key: '11', label: '302', type: '4', status: '2' },
]

const moduleRecords = [
  { room: '1', start_date: '2017-03-02', end_date: '2017-03-23', text: 'A-12', id: '1', status: '1', is_paid: '1' },
  { room: '3', start_date: '2017-03-07', end_date: '2017-03-21', text: 'A-45', id: '2', status: '2', is_paid: '1' },
  { room: '5', start_date: '2017-03-06', end_date: '2017-03-14', text: 'A-58', id: '3', status: '3', is_paid: '0' },
  { room: '7', start_date: '2017-03-04', end_date: '2017-03-18', text: 'A-28', id: '4', status: '4', is_paid: '0' },
]

class SchedulerParser extends Component {
  state = {
    schedulerID: createUuid(),
  }

  componentDidMount () {

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
      y_property: 'room',
      render: 'bar',
      x_unit: 'day',
      x_date: '%D',
      x_length: 7,
      x_size: 7,
      x_start: 0,
      x_step: 1,
      dy: 52,
      event_dy: 48,
      round_position: true,

      y_unit: roomsArr,
      second_scale: {
        x_unit: 'day',
        x_date: '%F %d',
      },
    });

    window.scheduler.templates.timeline_scale_label = (key, label, section) => this.getTimelineScaleLabel({
      fields: moduleFields,
      data: section,
    });

    window.scheduler.date.timeline_start = window.scheduler.date.week_start;

    window.scheduler.attachEvent('onBeforeViewChange', (oldMode, oldDate, mode, date) => {
      this.dateMode = this.dateMode || DateConstants.WEEK;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1);
      const d = new Date(year, month, 0);
      const daysInMonth = d.getDate();
      if(this.dateMode === DateConstants.WEEK){
        window.scheduler.matrix.timeline.x_size = 7;
      } else if(this.dateMode === DateConstants.MONTH){
        window.scheduler.matrix.timeline.x_size = daysInMonth;
      } else if(this.dateMode === DateConstants.DAY){
        window.scheduler.matrix.timeline.x_size = 24;
      }
      return true;
    });

    // 弹出框标题
    window.scheduler.templates.lightbox_header = (start, end) => {
      const formatFunc = window.scheduler.date.date_to_str('%d.%m.%Y');
      return `${formatFunc(start)} - ${formatFunc(end)}`;
    };

    window.scheduler.attachEvent('onEventCollision', (ev, evs) => {
      for (let i = 0; i < evs.length; i++) {
        // eslint-disable-next-line
        if (ev.room !== evs[i].room) continue;
        console.info('This room is already booked for this date.')
      }
      return true;
    });

    window.scheduler.attachEvent('onBeforeLightbox', (id) => {
      console.info('onBeforeLightbox id: ', id)
      window.scheduler.getEvent(id).text = 'Conference';
      window.scheduler.setEvent(id, {
        start_date: new Date('2017-03-08'),
        end_date: new Date('2017-03-13'),
        text: 'Meeting',
        holder: 'John',
        room: '5',
      });
      window.scheduler.updateEvent(id); // renders the updated event
      return false;
    });

    window.scheduler.attachEvent('onBeforeExternalDragIn', () => false);

    this.initScheduler();
  }

  initScheduler = () => {
    const {
      schedulerID,
    } = this.state;

    window.scheduler.templates.tooltip_text = () => false;

    window.scheduler.init(schedulerID, new Date(2017, 2, 1), 'timeline');
    window.scheduler.parse(moduleRecords, 'json');

    this.initTimelineScaleHeader({
      fields: moduleFields,
    });
  }

  getTimelineScaleLabel = ({
    data,
    fields,
  }) => {
    const labelHtmlArray = [];
    fields.forEach((item) => {
      labelHtmlArray.push(`
        <div class='timeline_item_separator'></div>
        <div class='timeline_item_cell'>${data[item.name]}</div>
      `)
    });

    return labelHtmlArray.join('')
  }

  initTimelineScaleHeader = ({
    fields = [],
  }) => {
    fields = fields || [];
    const {
      schedulerID,
    } = this.state;

    const element = document.getElementById(schedulerID);
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

    const headerHtmlArray = [];
    fields.forEach((item) => {
      headerHtmlArray.push(`
        <div class='timeline_item_separator'></div>
        <div class='timeline_item_cell'>${item.label}</div>
      `)
    })

    header.innerHTML = headerHtmlArray.join('');
    element.appendChild(header);
  }

  handleClick = (key) => {
    this.dateMode = key || DateConstants.WEEK;
    if (key === DateConstants.MONTH) {
      window.scheduler.matrix.timeline.x_step = 1;
      window.scheduler.matrix.timeline.x_size = 31;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_length = 31;
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
      window.scheduler.matrix.timeline.x_size = 7;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_length = 7;
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
      window.scheduler.matrix.timeline.x_step = 1;
      window.scheduler.matrix.timeline.x_size = 24;
      window.scheduler.matrix.timeline.x_start = 0;
      window.scheduler.matrix.timeline.x_length = 24;
      window.scheduler.matrix.timeline.x_unit = 'hour';
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
      schedulerID = '',
    } = this.state;

    return (
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        <ButtonGroup className={`${prefix}-custom-button-group`}>
          <Button onClick={() => this.handleClick(DateConstants.DAY)}>日</Button>
          <Button onClick={() => this.handleClick(DateConstants.WEEK)}>周</Button>
          <Button onClick={() => this.handleClick(DateConstants.MONTH)}>月</Button>
        </ButtonGroup>
        <div style={{ flex: 1 }}>
          <Scheduler schedulerID={schedulerID} />
        </div>
      </div>
    );
  }
}

export default SchedulerParser;
