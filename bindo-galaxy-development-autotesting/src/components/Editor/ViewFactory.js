import React from 'react';
import widgets from '../../constants/widgets';
import WidgetOption from './FormView/FormWidgets/Option';
import TableField from './ListView/TableField';
import TextNode from './components/DragNodes/TextNode'
import TextAreaNode from './components/DragNodes/TextAreaNode'
import SelectionNode from './components/DragNodes/SelectionNode'
import RadioNode from './components/DragNodes/RadioNode'
import CheckboxNode from './components/DragNodes/CheckboxNode'
import BooleanNode from './components/DragNodes/BooleanNode'
import IntegerNode from './components/DragNodes/IntegerNode'
import DecimalNode from './components/DragNodes/DecimalNode'
import TimePickerNode from './components/DragNodes/TimePickerNode'
import DatePickerNode from './components/DragNodes/DatePickerNode'
import DateRangeNode from './components/DragNodes/DateRangeNode'
import ImageNode from './components/DragNodes/ImageNode'
import FileNode from './components/DragNodes/FileNode'
import LabelNode from './components/DragNodes/LabelNode'
import TabsNode from './components/DragNodes/TabsNode'
import ColumnsNode from './components/DragNodes/ColumnsNode'
import DividerNode from './components/DragNodes/DividerNode'
import ManyToManyNode from './components/DragNodes/ManyToManyNode'
import OneToManyNode from './components/DragNodes/OneToManyNode'
import ManyToOneNode from './components/DragNodes/ManyToOneNode'
import RelatedFieldNode from './components/DragNodes/RelatedFieldNode'
import CalculatedNode from './components/DragNodes/CalculatedNode'
import OneToOneNode from './components/DragNodes/OneToOneNode'
import EditorContextNode from './components/DragNodes/EditorContextNode'
import SeqNoNode from './components/DragNodes/SeqNoNode'
import VideoPlayerNode from './components/DragNodes/VideoPlayerNode'

const prefix = 'bindo-galaxy-editor-sortable';

export const create = ({
  view,
  field,
  selectedViewUuid,
  isBindTable,
  fields,
  sortableDisabled = false,
}) => {
  const { viewType, uuid } = view
  let className = ''

  if (uuid === selectedViewUuid) {
    className = `${prefix}-chosen`;
  }

  const props = {
    key: uuid,
    className,
    view,
    field,
    fields,
    isBindTable,
    sortableDisabled,
  }

  switch (viewType) {
    case widgets.WIDGET:
      return <WidgetOption {...props} />

    case widgets.TABLE_OPTION:
      return <TableField {...props} />

    case widgets.TABS:
      return <TabsNode {...props} />

    case widgets.COLUMNS:
      return <ColumnsNode {...props} />

    case widgets.DIVIDER:
      return <DividerNode {...props} />

    case widgets.TEXT:
      return <TextNode {...props} />

    case widgets.MULTILINE_TEXT:
      return <TextAreaNode {...props} />

    case widgets.INTEGER_NUMBER:
      return <IntegerNode {...props} />

    case widgets.DECIMAL_NUMBER:
      return <DecimalNode {...props} />

    case widgets.CHECKBOX:
      return <CheckboxNode {...props} />

    case widgets.BOOLEAN:
      return <BooleanNode {...props} />

    case widgets.RADIO:
      return <RadioNode {...props} />

    case widgets.SELECTION:
      return <SelectionNode {...props} />

    case widgets.DATE:
      return <DatePickerNode {...props} />

    case widgets.DATE_RANGE:
      return <DateRangeNode {...props} />

    case widgets.TIMEPICKER:
      return <TimePickerNode {...props} />

    case widgets.UPLOAD:
      return <FileNode {...props} />

    case widgets.IMAGE:
      return <ImageNode {...props} />

    case widgets.MANY_TO_MANY:
      return <ManyToManyNode {...props} />

    case widgets.MANY_TO_ONE:
      return <ManyToOneNode {...props} />

    case widgets.ONE_TO_MANY:
      return <OneToManyNode {...props} />

    case widgets.LABEL:
      return <LabelNode {...props} />

    case widgets.RELATED_FIELD:
      return <RelatedFieldNode {...props} />

    case widgets.CALCULATED:
      return <CalculatedNode {...props} />

    case widgets.ONE_TO_ONE:
      return <OneToOneNode {...props} />

    case widgets.EDITOR:
      return <EditorContextNode {...props} />

    case widgets.SEQNO:
      return <SeqNoNode {...props} />

    case widgets.VIDEOPLAYER:
      return <VideoPlayerNode {...props} />

    default:
      break
  }
}

export default () => {};
