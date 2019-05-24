import React from 'react'
import widgets from '../../../../constants/widgets'
import TabsParser from './TabsParser'
import ColumnsParser from './ColumnsParser'
import TextParser from './TextParser'
import TextAreaParser from './TextAreaParser'
import BooleanParser from './BooleanParser'
import CheckboxParser from './CheckboxParser'
import IntegerParser from './IntegerParser'
import DecimalParser from './DecimalParser'
import DividerParser from './DividerParser'
import RadioParser from './RadioParser'
import ImageParser from './ImageParser'
import FileParser from './FileParser'
import DatePickerParser from './DatePickerParser'
import DateRangePickerParser from './DateRangePickerParser'
import TimePickerParser from './TimePickerParser'
import SelectionParser from './SelectionParser'
import ManyToManyParser from './ManyToManyParser'
import OneToManyParser from './OneToManyParser'
import ManyToOneParser from './ManyToOneParser'
import RelatedFieldParser from './RelatedFieldParser'
import LabelParser from './LabelParser'
import CalculatedParser from './CalculatedParser'
import OneToOneParser from './OneToOneParser'
import EditorContextParser from './EditorContextParser'
import SchedulerParser from '../../SchedulerView/SchedulerParser'
import SeqNoParser from './SeqNoParser'
import VideoplayerParser from './VideoPlayerParser'
import { getFieldInvisible } from '../../../../utils/galaxy'

export const createFormItem = ({
  view,
  form,
  fields,
  storeID,
  appID,
  moduleID,
  action,
  dispatch,
  prefix,
  recordData = {},
  editableData,
  relationRecords = {},
  uniqueFieldNamesSet = new Set(),
  storesAppsModulesMap = new Set(),
  storesAppsMap = new Set(),
}) => {
  const { viewType, uuid } = view
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form

  let field = {}
  fields.forEach(item => {
    if (item.uuid === uuid) {
      field = item
    }
  });

  if (getFieldInvisible({
    field,
    view,
    getFieldValue,
  })) {
    return undefined;
  }

  let initialValue = null;

  if (field && field.name) {
    initialValue = recordData[field.name];
  }

  const props = {
    key: view.uuid,
    view,
    field,
    initialValue,
    getFieldDecorator,
    setFieldsValue,
    relationRecords,
    dispatch,
    getFieldValue,
    fields,
    storeID,
    appID,
    moduleID,
    editableData,
    action,
    recordData,
    prefix,
    uniqueFieldNamesSet,
    storesAppsModulesMap,
    storesAppsMap,
  }

  switch (viewType) {
    case widgets.TABS:
      return <TabsParser {...props} form={form} />

    case widgets.COLUMNS:
      return <ColumnsParser {...props} form={form} />

    case widgets.TEXT:
      return <TextParser {...props} />

    case widgets.MULTILINE_TEXT:
      return <TextAreaParser {...props} />

    case widgets.BOOLEAN:
      return <BooleanParser {...props} />

    case widgets.CHECKBOX:
      return <CheckboxParser {...props} />

    case widgets.INTEGER_NUMBER:
      return <IntegerParser {...props} />

    case widgets.DECIMAL_NUMBER:
      return <DecimalParser {...props} />

    case widgets.IMAGE:
      return <ImageParser {...props} />

    case widgets.UPLOAD:
      return <FileParser {...props} />

    case widgets.DIVIDER:
      return <DividerParser {...props} />

    case widgets.LABEL:
      return <LabelParser {...props} />

    case widgets.RADIO:
      return <RadioParser {...props} />

    case widgets.DATE:
      return <DatePickerParser {...props} />

    case widgets.DATE_RANGE:
      return <DateRangePickerParser {...props} />

    case widgets.TIMEPICKER:
      return <TimePickerParser {...props} />

    case widgets.SELECTION:
      return <SelectionParser {...props} />

    case widgets.MANY_TO_MANY:
      return <ManyToManyParser {...props} />

    case widgets.ONE_TO_MANY:
      return <OneToManyParser {...props} />

    case widgets.MANY_TO_ONE:
      return <ManyToOneParser {...props} />

    case widgets.ONE_TO_ONE:
      return <OneToOneParser {...props} form={form} />

    case widgets.EXPORT_FIELD:
      return <RelatedFieldParser {...props} />

    case widgets.CALCULATED:
      return <CalculatedParser {...props} />

    case widgets.EDITOR:
      return <EditorContextParser {...props} />

    case widgets.SCHEDULE:
      return <SchedulerParser {...props} />
    case widgets.SEQNO:
      return <SeqNoParser {...props} />
    case widgets.VIDEOPLAYER:
      return <VideoplayerParser {...props} />

    default:
      break
  }
}

export default () => {}
