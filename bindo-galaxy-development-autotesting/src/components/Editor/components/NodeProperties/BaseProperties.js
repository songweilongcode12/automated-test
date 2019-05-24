import React from 'react';
import InvisibleProperty from './Properties/InvisibleProperty';
import RequiredProperty from './Properties/RequiredProperty';
import ReadOnlyProperty from './Properties/ReadOnlyProperty';
import LabelProperty from './Properties/LabelProperty';
import DefaultValueProperty from './Properties/DefaultValueProperty';
import PlaceholderProperty from './Properties/PlaceholderProperty';
import HelpTooltipProperty from './Properties/HelpTooltipProperty';
import DataSourceProperty from './Properties/DataSourceProperty';
import FieldNameProperty from './Properties/FieldNameProperty';
import FilterDataConditionsProperty from './Properties/FilterDataConditionsProperty';
import NodeTypeProperty from './Properties/NodeTypeProperty';
import RelationModuleProperty from './Properties/RelationModuleProperty';
import SelectDefaultProperty from './Properties/SelectDefaultProperty';
import common from '../../../../constants/common'

export default props => {
  const {
    field,
    children,
    invisible = true,
    required = true,
    readOnly = true,
    nodeType = true,
    label = true,
    fieldName = true,
    defaultValue,
    placeholder,
    helpTooltip = true,
    filterDataConditions,
    dataSource,
    selectModule,
    selectDefault,
  } = props;

  let showFilterDataConditions = true;
  if (filterDataConditions) {
    const {
      allowValue = {},
    } = field;

    const {
      type = common.STATIC,
    } = allowValue || {};

    if (type === common.STATIC) {
      showFilterDataConditions = false;
    }
  }

  return (
    <div className="bindo-galaxy-editor-rightside-tabpanel">
      {
        invisible &&
        <InvisibleProperty {...props} />
      }
      {
        required &&
        <RequiredProperty {...props} />
      }
      {
        readOnly &&
        <ReadOnlyProperty {...props} />
      }
      {
        label &&
        <LabelProperty {...props} />
      }
      {
        nodeType &&
        <NodeTypeProperty {...props} />
      }
      {
        fieldName &&
        <FieldNameProperty {...props} />
      }
      {
        defaultValue &&
        <DefaultValueProperty {...props} />
      }
      {
        dataSource &&
        <DataSourceProperty {...props} />
      }
      {
        showFilterDataConditions && filterDataConditions &&
        <FilterDataConditionsProperty {...props} />
      }
      {
        selectDefault &&
        <SelectDefaultProperty {...props} />
      }
      {
        // 展示relation module的name
        selectModule &&
        <RelationModuleProperty {...props} />
      }
      {children}
      {
        placeholder &&
        <PlaceholderProperty {...props} />
      }
      {
        helpTooltip &&
        <HelpTooltipProperty {...props} />
      }
      {
        // fieldName &&
        // <FieldNameItem {...this.props} />
      }
    </div>
  )
};
