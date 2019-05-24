import React from 'react'
import { Select } from 'antd'
import widgets from '../../../../../constants/widgets'

const getOptionData = (t) => ([
  {
    type: widgets.TEXT,
    text: t('common:editor.text'),
    icon: 'icon-input',
  },
  {
    type: widgets.MULTILINE_TEXT,
    text: t('common:editor.multilineText'),
    icon: 'icon-textarea',
  },
  {
    type: widgets.INTEGER_NUMBER,
    text: t('common:editor.integerNumber'),
    icon: 'icon-inputno',
  },
  {
    type: widgets.DECIMAL_NUMBER,
    text: t('common:editor.decimalNumber'),
    icon: 'icon-inputno',
  },
  {
    type: widgets.SELECTION,
    text: t('common:editor.selection'),
    icon: 'icon-select',
  },
  {
    type: widgets.RADIO,
    text: t('common:editor.radio'),
    icon: 'icon-radio',
  },
  {
    type: widgets.CHECKBOX,
    text: t('common:editor.checkbox'),
    icon: 'icon-checkbox',
  },
  {
    type: widgets.BOOLEAN,
    text: t('common:editor.boolean'),
    icon: 'icon-checkbox',
  },
  {
    type: widgets.DATE,
    text: t('common:editor.date'),
    icon: 'icon-datepicker',
  },
  {
    type: widgets.DATE_RANGE,
    text: t('common:editor.dateRange'),
    icon: 'icon-datepicker',
  },
  {
    type: widgets.TIMEPICKER,
    text: t('common:editor.timePicker'),
    icon: 'icon-datepicker',
  },
  {
    type: widgets.CALCULATED,
    text: t('common:editor.calculated'),
    icon: 'icon-datepicker',
  },
  {
    type: widgets.IMAGE,
    text: t('common:editor.image'),
    icon: 'icon-image',
  },
  {
    type: widgets.UPLOAD,
    text: t('common:editor.file'),
    icon: 'icon-upload',
  },
  {
    type: widgets.TABS,
    text: t('common:editor.tabs'),
    icon: 'icon-tabs',
  },
  {
    type: widgets.COLUMNS,
    text: t('common:editor.columns'),
    icon: 'icon-columns',
  },
  {
    type: widgets.EDITOR,
    text: t('common:editor.tempEditor'),
    icon: 'icon-input',
  },
  {
    type: widgets.DIVIDER,
    text: t('common:editor.divider'),
    icon: 'icon-input',
  },
  {
    type: widgets.LABEL,
    text: t('common:editor.label'),
    icon: 'icon-input',
  },
  {
    type: widgets.ONE_TO_MANY,
    text: t('common:editor.one2Many'),
    icon: 'icon-one-to-many',
  },
  {
    type: widgets.MANY_TO_ONE,
    text: t('common:editor.many2One'),
    icon: 'icon-many-to-one',
  },
  {
    type: widgets.MANY_TO_MANY,
    text: t('common:editor.many2Many'),
    icon: 'icon-many-to-many',
  },
  {
    type: widgets.SEQNO,
    text: t('common:editor.seqNo'),
    icon: 'icon-inputno',
  },
  {
    type: widgets.VIDEOPLAYER,
    text: t('common:editor.videoPlayer'),
    icon: 'icon-inputno',
  },
]);

export default props => {
  const {
    t,
    view,
    prefix,
  } = props;

  const {
    viewType,
  } = view;

  return (
    <div className={prefix}>
      <div className={`${prefix}-label`}>
        {t('common:type')}
      </div>
      <Select
        value={viewType}
        style={{width: '100%', flex: 1, margin: '0 3px'}}
        disabled={true}
      >
        {
          getOptionData(t).map(item =>
            <Select.Option key={item.type} value={item.type} disabled={true}>
              {item.text}
            </Select.Option>
          )
        }
      </Select>
    </div>
  );
}
