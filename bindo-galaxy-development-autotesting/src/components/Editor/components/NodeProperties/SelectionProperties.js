import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class SelectionProperties extends Component {
  render() {
    return (
      <BaseProperties
        {...this.props}
        placeholder
        dataSource
        filterDataConditions
        selectDefault
      />
    );
  }
}

export default SelectionProperties;
