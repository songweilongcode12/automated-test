import React, { Component } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Tabs } from 'antd'
import DragSide from '../../DragSide'
import { findViewModel } from '../../../utils/module'
import widgets from '../../../constants/widgets'
import reduxKey from '../../../constants/reduxKey'
import ViewPanel from './ViewPanel'
import TextProperties from '../components/NodeProperties/TextProperties'
import TextAreaProperties from '../components/NodeProperties/TextAreaProperties'
import SelectionProperties from '../components/NodeProperties/SelectionProperties'
import RadioProperties from '../components/NodeProperties/RadioProperties'
import CheckboxProperties from '../components/NodeProperties/CheckboxProperties'
import BooleanProperties from '../components/NodeProperties/BooleanProperties'
import IntegerProperties from '../components/NodeProperties/IntegerProperties'
import DecimalProperties from '../components/NodeProperties/DecimalProperties'
import TimePickerProperties from '../components/NodeProperties/TimePickerProperties'
import DatePickerProperties from '../components/NodeProperties/DatePickerProperties'
import DateRangeProperties from '../components/NodeProperties/DateRangeProperties'
import ImageProperties from '../components/NodeProperties/ImageProperties'
import FileProperties from '../components/NodeProperties/FileProperties'
import LabelProperties from '../components/NodeProperties/LabelProperties'
import TabsProperties from '../components/NodeProperties/TabsProperties'
import ColumnsProperties from '../components/NodeProperties/ColumnsProperties'
import DividerProperties from '../components/NodeProperties/DividerProperties'
import ManyToManyProperties from '../components/NodeProperties/ManyToManyProperties'
import OneToManyProperties from '../components/NodeProperties/OneToManyProperties'
import ManyToOneProperties from '../components/NodeProperties/ManyToOneProperties'
import RelatedFieldProperties from '../components/NodeProperties/RelatedFieldProperties'
import CalculatedProperties from '../components/NodeProperties/CalculatedProperties'
import OneToOneProperties from '../components/NodeProperties/OneToOneProperties'
import EditorContextProperties from '../components/NodeProperties/EditorContextProperties'
import SeqNoProperties from '../components/NodeProperties/SeqNoProperties'
import VideoPlayerProperties from '../components/NodeProperties/VideoPlayerProperties'

const prefix = 'bindo-galaxy-editor-rightside'

@translate()
@connect(({
  module,
}) => ({
  ...module,
}))
class FormView extends Component {
  getField = (uuid, fields) => {
    for (let i = 0; i < fields.length; i++) {
      if (fields[i].uuid === uuid) {
        return fields[i]
      }
    }

    return {}
  }

  selectPropertiesPanel = (viewModels, selectedViewUuid, isBindTable, newFields) => {
    // const { fields, storeID, moduleEntity } = this.props;
    const {
      fields,
      storeID,
      moduleID,
    } = this.props;
    const view = findViewModel(viewModels, selectedViewUuid) || {}
    const field = this.getField(view.uuid, fields);
    const secondField = this.getField(`second_${view.uuid}`, fields);

    let isNewField = false;
    newFields.forEach(item => {
      if (field.uuid === item.uuid) {
        isNewField = true;
      }
    });

    const props = {
      ...this.props,
      view,
      field,
      secondField,
      fields,
      storeID,
      moduleID,
      // isOffice: moduleEntity.isOffice,
      isBindTable,
      isNewField,
    }

    switch (view.viewType) {
      case widgets.TABS:
        return <TabsProperties {...props} />

      case widgets.COLUMNS:
        return <ColumnsProperties {...props} />

      case widgets.DIVIDER:
        return <DividerProperties {...props} />

      case widgets.TEXT:
        return <TextProperties {...props} />

      case widgets.MULTILINE_TEXT:
        return <TextAreaProperties {...props} />

      case widgets.INTEGER_NUMBER:
        return <IntegerProperties {...props} />

      case widgets.DECIMAL_NUMBER:
        return <DecimalProperties {...props} />

      case widgets.CHECKBOX:
        return <CheckboxProperties {...props} />

      case widgets.BOOLEAN:
        return <BooleanProperties {...props} />

      case widgets.RADIO:
        return <RadioProperties {...props} />

      case widgets.SELECTION:
        return <SelectionProperties {...props} />

      case widgets.DATE:
        return <DatePickerProperties {...props} />

      case widgets.DATE_RANGE:
        return <DateRangeProperties {...props} />

      case widgets.TIMEPICKER:
        return <TimePickerProperties {...props} />

      case widgets.UPLOAD:
        return <FileProperties {...props} />

      case widgets.IMAGE:
        return <ImageProperties {...props} />

      case widgets.MANY_TO_MANY:
        return <ManyToManyProperties {...props} />

      case widgets.MANY_TO_ONE:
        return <ManyToOneProperties {...props} />

      case widgets.ONE_TO_MANY:
        return <OneToManyProperties {...props} />

      case widgets.LABEL:
        return <LabelProperties {...props} />

      case widgets.RELATED_FIELD:
        return <RelatedFieldProperties {...props} />

      case widgets.CALCULATED:
        return <CalculatedProperties {...props} />

      case widgets.ONE_TO_ONE:
        return <OneToOneProperties {...props} />

      case widgets.EDITOR:
        return <EditorContextProperties {...props} />

      case widgets.SEQNO:
        return <SeqNoProperties {...props} />

      case widgets.VIDEOPLAYER:
        return <VideoPlayerProperties {...props} />

      default:
        return <div />
    }
  }

  render () {
    const {
      t,
      dispatch,
      viewModels,
      moduleEntity = {},
      activeTab,
      selectedViewUuid,
      // galaxyState,
      // getBreadcrumbData,
      storeID,
      moduleID,
      fields,
      isBindTable,
    } = this.props;
    const {
      // tableInfo,
      newFields = [],
    } = moduleEntity || {};
    // const isBindTable = tableInfo && tableInfo.tableName || false;

    return (
      <DragSide.RightSide className={prefix}>
        <Tabs
          activeKey={activeTab}
          className={`${prefix}-tabs rightside-tabs`}
          onChange={key =>
            dispatch({
              type: reduxKey.SET_MODULE_ACTIVE_TAB,
              payload: key,
            })
          }
        >
          <Tabs.TabPane className={`${prefix}-tabpane`} tab={t('common:properties')} key="properties">
            {selectedViewUuid !== null &&
              viewModels &&
              viewModels.length > 0 &&
              this.selectPropertiesPanel(viewModels, selectedViewUuid, isBindTable, newFields)}
          </Tabs.TabPane>
          <Tabs.TabPane className={`${prefix}-tabpane`} tab={t('common:view')} key="view">
            <ViewPanel
              moduleID={moduleID}
              storeID={storeID}
              moduleEntity={moduleEntity}
              dispatch={dispatch}
              fields={fields}
            />
          </Tabs.TabPane>
        </Tabs>
      </DragSide.RightSide>
    )
  }
}

export default FormView
