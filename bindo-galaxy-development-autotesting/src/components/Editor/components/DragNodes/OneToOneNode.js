import React, { Component } from 'react'
import lodash from 'lodash'
import hocNode from './hocNode'
import FormContainer from '../../FormView/FormContainer'

@hocNode()
class OneToOneNode extends Component {
  getModuel = () => {
    const {
      field: {
        relation = {},
      } = {},
      existingModules = [],
    } = this.props;

    const { relatedModuleID } = relation || {};
    let relatedModule;
    for (let i = 0; i < existingModules.length; i++) {
      const moduleTemp = existingModules[i];
      if (moduleTemp && moduleTemp.id === relatedModuleID) {
        relatedModule = moduleTemp;
        break;
      }
    }

    return relatedModule;
  }

  render() {
    const relatedModule = this.getModuel();
    let moduleFields = [];
    let moduleForm = [];
    if (lodash.isObject(relatedModule)) {
      if (lodash.isArray(relatedModule.fields)) {
        moduleFields = relatedModule.fields;
      }

      if (lodash.isObject(relatedModule.template) && lodash.isArray(relatedModule.template.form)) {
        moduleForm = relatedModule.template.form;
      }
    }

    return (
      <div style={{border: '1px solid #d9d9d9'}}>
        {
          moduleFields.length > 0 && moduleForm.length > 0 &&
          <FormContainer
            viewModels={moduleForm}
            fields={moduleFields}
            sortableDisabled={true}
          />
        }
      </div>
    );
  }
}

export default OneToOneNode;
