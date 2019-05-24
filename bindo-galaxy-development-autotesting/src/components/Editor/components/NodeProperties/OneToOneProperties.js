import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import RelationProperty from './Properties/RelationProperty';

@hocProperties()
class OneToOneProperties extends Component {

  render() {

    return (
      <BaseProperties {...this.props} placeholder required={false}>
        <RelationProperty {...this.props} />
      </BaseProperties>
    );
  }
}

export default OneToOneProperties;
