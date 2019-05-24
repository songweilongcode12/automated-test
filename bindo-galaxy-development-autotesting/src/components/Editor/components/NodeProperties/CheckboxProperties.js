import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class CheckboxProperties extends Component {
  render() {
    return (
      <BaseProperties
        {...this.props}
        dataSource
        filterDataConditions
        selectDefault
      />
    );
  }
}

export default CheckboxProperties;
