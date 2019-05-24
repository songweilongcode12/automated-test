import React, { Component } from 'react'
// import 'dhtmlx-gantt'
// import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'
import './Gantt.less'

/* eslint-disable */
class Gantt extends Component {
  state = {
    currentZoom: 'Days',
  }
  componentDidMount() {
    gantt.init(this.ganttContainer);
  }

  handleRef = input => {
    this.ganttContainer = input
  }

  setZoom(value){
    switch (value){
      case 'Hours':
          gantt.config.scale_unit = 'day';
          gantt.config.date_scale = '%d %M';

          gantt.config.scale_height = 60;
          gantt.config.min_column_width = 30;
          gantt.config.subscales = [
              {unit:'hour', step:1, date:'%H'}
          ];
          break;
      case 'Days':
          gantt.config.min_column_width = 70;
          gantt.config.scale_unit = "week";
          gantt.config.date_scale = "#%W";
          gantt.config.subscales = [
              {unit: "day", step: 1, date: "%d %M"}
          ];
          gantt.config.scale_height = 60;
          break;
      case 'Months':
          gantt.config.min_column_width = 70;
          gantt.config.scale_unit = "month";
          gantt.config.date_scale = "%F";
          gantt.config.scale_height = 60;
          gantt.config.subscales = [
              {unit:"week", step:1, date:"#%W"}
          ];
          break;
      default:
          break;
    }
  }

  render() {
    this.setZoom(this.props.zoom);

    return (
      <div className="bg-c-gantt">
        <div
          className="bg-c-gantt-content"
          ref={this.handleRef}
        />
      </div>
    );
  }
}
/* eslint-enable */

export default Gantt;
