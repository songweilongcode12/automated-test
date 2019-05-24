import React, { Component } from 'react'
import hocProperties from './hocProperties'
import BaseProperties from './BaseProperties'
import DynamicDataSourceProperty from './Properties/DynamicDataSourceProperty'
import FilterDataConditionsProperty from './Properties/FilterDataConditionsProperty';

@hocProperties()
class SelectionProperties extends Component {
  getRelatedModuleID = () => {
    const {
      field: {
        relation = {},
      },
    } = this.props;

    const {
      relatedModuleID,
    } = relation || {};

    return relatedModuleID;
  }

  render() {
    return (
      <BaseProperties
        {...this.props}
        placeholder
        selectModule
        required={false}
      >
        <DynamicDataSourceProperty
          {...this.props}
          getRelatedModuleID={this.getRelatedModuleID}
        />
        <FilterDataConditionsProperty {...this.props} />
      </BaseProperties>
    );
  }
}

export default SelectionProperties;
