
import React from 'react'

import '../lib/dhtmlxscheduler'
import '../lib/ext/dhtmlxscheduler_limit'
import '../lib/ext/dhtmlxscheduler_collision'
import '../lib/ext/dhtmlxscheduler_timeline'
import '../lib/ext/dhtmlxscheduler_daytimeline'
import '../lib/ext/dhtmlxscheduler_treetimeline'
import '../lib/ext/dhtmlxscheduler_editors'
import '../lib/ext/dhtmlxscheduler_minical'
import '../lib/ext/dhtmlxscheduler_tooltip'
// import '../lib/locale/locale_cn'
import '../lib/dhtmlxscheduler.css'

import './Scheduler.less'

const prefix = 'bg-c-dhtmlx-scheduler';

export default (props) =>{

  const {
    schedulerID,
  } = props;

  return (
      <div id={`${schedulerID}`} className={`dhx_cal_container ${prefix}`}>
        <div className="dhx_cal_navline">
          <div className="dhx_cal_prev_button">&nbsp;</div>
          <div className="dhx_cal_next_button">&nbsp;</div>
          <div className="dhx_cal_today_button" />
          <div className="dhx_cal_date" />
          {/* <div className="dhx_cal_tab" name="day_tab" style={{right: '204px'}} /> */}
          {/* <div className="dhx_cal_tab" name="week_tab" style={{right: '140px'}} /> */}
          {/* <div className="dhx_cal_tab" name="timeline_tab" style={{right: '280px'}} /> */}
          {/* <div className="dhx_cal_tab" name="month_tab" style={{right: '76px'}} /> */}
        </div>
        <div className="dhx_cal_header" />
        <div className="dhx_cal_data" />
        <div className="timeline_item_separator_top_line" />
      </div>
  );

}

