import React, { Component } from 'react'
import hocProperties from './hocProperties'
import BaseProperties from './BaseProperties'
import QueryEvaluationProperty from './Properties/QueryEvaluationProperty'
import RelationProperty from './Properties/RelationProperty'

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
        readOnly={false}
        required={false}
      >
        <RelationProperty {...this.props} />
        <QueryEvaluationProperty
          {...this.props}
          uneditableType
          multiple={false}
          selectDisplayField={false}
          getRelatedModuleID={this.getRelatedModuleID}
        />
      </BaseProperties>
    );
  }
}

export default SelectionProperties;
