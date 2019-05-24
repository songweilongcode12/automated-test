import React, { Component } from 'react';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class BooleanProperties extends Component {
  render() {
    return (
      <BaseProperties {...this.props} required={false} />
    );
  }
}

export default BooleanProperties;
