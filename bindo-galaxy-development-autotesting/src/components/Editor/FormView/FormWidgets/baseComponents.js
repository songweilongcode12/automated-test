import { createUuid } from '../../../../utils';
import widgets from '../../../../constants/widgets';

export default [
  {
    viewType: widgets.WIDGET,
    type: widgets.TEXT,
    text: 'text',
    icon: 'icon-input',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.MULTILINE_TEXT,
    text: 'multilineText',
    icon: 'icon-textarea',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.INTEGER_NUMBER,
    text: 'integerNumber',
    icon: 'icon-inputno',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.DECIMAL_NUMBER,
    text: 'decimalNumber',
    icon: 'icon-inputno',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.SELECTION,
    text: 'selection',
    icon: 'icon-select',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.RADIO,
    text: 'radio',
    icon: 'icon-radio',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.CHECKBOX,
    text: 'checkbox',
    icon: 'icon-checkbox',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.BOOLEAN,
    text: 'boolean',
    icon: 'icon-checkbox',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.DATE,
    text: 'date',
    icon: 'icon-datepicker',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.DATE_RANGE,
    text: 'dateRange',
    icon: 'icon-datepicker',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.TIMEPICKER,
    text: 'timePicker',
    icon: 'icon-datepicker',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.CALCULATED,
    text: 'calculated',
    icon: 'icon-datepicker',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.IMAGE,
    text: 'image',
    icon: 'icon-image',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.UPLOAD,
    text: 'file',
    icon: 'icon-upload',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.SEQNO,
    text: 'seqNo',
    icon: 'icon-inputno',
    uuid: createUuid(),
  },
  {
    viewType: widgets.WIDGET,
    type: widgets.VIDEOPLAYER,
    text: 'videoPlayer',
    icon: 'icon-videoplayer',
    uuid: createUuid(),
  },
]