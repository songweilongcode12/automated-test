import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { isBindingExistingTable } from '../../../../utils/module';
import reduxKey from '../../../../constants/reduxKey';
import './NodeProperties.less';

const prefix = 'bg-c-node-property';

export default () => (WrappedComponent) => {

  @connect(({ module }) => ({ ...module }))
  @translate()
  class Properties extends Component {

    handleViewProps = (key, value) => {
      const { dispatch, view } = this.props;

      dispatch({
        type: reduxKey.UPDATE_MODULE_ENTITY,
        payload: {
          editViews: [{
            operate: 'update',
            uuid: view.uuid,
            data: { [key]: value },
          }],
        },
      });
    }

    handleFieldProps = (key, value) => {
      const { dispatch, view } = this.props;
      const updateField = {
        uuid: view.uuid,
        [key]: value,
      };

      dispatch({
        type: reduxKey.UPDATE_MODULE_ENTITY,
        payload: {
          updateField,
        },
      });
    }

    handleAllowValueChange = (key, value) => {
      const {
        field: {
          allowValue = {},
        } = {},
      } = this.props;

      this.handleFieldProps('allowValue', {
        ...allowValue,
        [key]: value,
      })
    }

    handleRelationChange = (key, value) => {
      const {
        field: {
          relation = {},
        } = {},
      } = this.props;

      this.handleFieldProps('relation', {
        ...relation,
        [key]: value,
      })
    }

    handleQueryEvaluationChange = (key, value) => {
      const {
        field: {
          queryEvaluation = {},
        } = {},
      } = this.props;

      this.handleFieldProps('queryEvaluation', {
        ...queryEvaluation,
        [key]: value,
      })
    }

    handleListenChange = (listen = {}) => {

      let {
        field: {
          listens = [],
        } = {},
      } = this.props;

      if (!listens) {
        listens = [];
      }

      let isAdd = true;
      for (let i = 0; i < listens.length; i++) {
        const item = listens[i];
        if (item.type === listen.type) {
          Object.keys(listen).forEach(key => {
            item[key] = listen[key];
          });
          isAdd = false;
          break;
        }
      }

      if (isAdd) {
        listens.push(listen);
      }

      this.handleFieldProps('listens', [
        ...listens,
      ])
    }

    getExistingModules = () => {
      const { existingModules } = this.props;

      return existingModules;
    }

    getExistingFields = () => {
      const {
        moduleEntity,
      } = this.props;
      const { fields } = moduleEntity || {};

      const newFields = [...fields];
      if (!isBindingExistingTable(moduleEntity)) {
        newFields.unshift({
          uuid: 'id',
          label: 'ID',
          name: 'id',
        });
      }

      return newFields;
    }

    getUnboundFields = () => {
      const {
        field,
        fields = [],
        bindingTableFields = [],
      } = this.props;

      const { name } = field;

      const nameSet = new Set();
      fields.forEach(item => {
        if (item.name !== name) {
          nameSet.add(item.name);
        }
      });

      const unboundFields = [];
      bindingTableFields.forEach(item => {
        if (!nameSet.has(item.name)) {
          unboundFields.push(item);
        }
      });

      return unboundFields;
    }

    handleFieldsDisable = () =>{
      const {
        field = {},
      } = this.props;

      const {
        fromParentModule = false,
      } = field

      // 如果是从父moduel继承来的,则不可编辑
      return fromParentModule
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          prefix={prefix}
          onViewPropsChange={this.handleViewProps}
          onFieldPropsChange={this.handleFieldProps}
          getUnboundFields={this.getUnboundFields}
          onAllowValueChange={this.handleAllowValueChange}
          onRelationChange={this.handleRelationChange}
          onQueryEvaluationChange={this.handleQueryEvaluationChange}
          onListenChange={this.handleListenChange}
          getExistingFields={this.getExistingFields}
          getExistingModules={this.getExistingModules}
          handleFieldsDisable={this.handleFieldsDisable}
        />
      );
    }
  }

  return Properties
}
