import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import RelationProperty from './Properties/RelationProperty';

@hocProperties()
class OneToManyProperties extends Component {

  render() {

    return (
      <BaseProperties
        {...this.props}
        placeholder
        selectModule
        required={false}
      >
        <RelationProperty {...this.props} />
      </BaseProperties>
    );
  }
}

export default OneToManyProperties;
