import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Modal } from 'antd';
import lodash from 'lodash';
import LogicalExpression from './LogicalExpression';
import ConditionalContext from './ConditionalContext';
import { createUuid, findNode } from '../../../../utils';
import Operator from '../../../../constants/operator';
import mqlKind from '../../../../constants/mqlKind';
import './Conditional.less';

const prefix = 'bg-editor-conditional';

@translate()
class Conditional extends Component {
  constructor (props) {
    super(props);

    const { data, getExistingFields } = props;

    const fields = getExistingFields();

    let cstData = data;
    if (!cstData || !cstData.operator) {
      cstData = this.createLogicalExpression();
    } else {
      this.repairCstData(cstData, fields);
    }

    this.state = {
      fields,
      cstData,
      showErrorMsg: false,
      errorMsg: '',
    };
  }

  repairCstData = (cstData, fields) => {
    if (lodash.isObject(cstData)) {
      if (cstData.type === mqlKind.VARIABLE) {
        cstData.field = findNode(fields, 'name', cstData.value);
      } else if (cstData.type !== mqlKind.LITERAL) {
        if (lodash.isObject(cstData.left)) {
          this.repairCstData(cstData.left, fields);
        }

        if (lodash.isObject(cstData.right)) {
          this.repairCstData(cstData.right, fields);
        }

        let children = [];
        if (lodash.isArray(cstData.children)) {
          children = [...cstData.children];
        }

        for (let i = 0; i < children.length; i++) {
          const item = children[i];
          if (lodash.isObject(item)) {
            this.repairCstData(item, fields);
          }
        }
      }
    }
  };

  handleOk = () => {
    const { cstData } = this.state;
    const { t, onSubmit } = this.props;

    if (!this.checkData(cstData)) {
      this.setState({
        showErrorMsg: true,
        errorMsg: t('common:editor.checkExpressionError'),
      });
      return;
    }

    if (typeof onSubmit === 'function') {
      onSubmit(cstData);
    }
  };

  checkData = cstData => {
    if (!cstData) {
      return false;
    }

    if (!cstData.type) {
      return false;
    }

    if (cstData.type === mqlKind.VARIABLE) {
      if (!cstData.value) {
        return false;
      }
    }

    if (cstData.type === mqlKind.LITERAL) {
      if (!cstData.value || cstData.value.length < 1) {
        return false;
      }
    }

    if (cstData.type === mqlKind.LogicalExpression) {
      if (!cstData.operator) {
        return false;
      }

      if (!lodash.isArray(cstData.children) || cstData.children.length < 1) {
        return false;
      }

      for (let i = 0; i < cstData.children.length; i++) {
        const item = cstData.children[i];
        if (!this.checkData(item)) {
          return false;
        }
      }
    }

    if (cstData.type === mqlKind.BinaryExpression) {
      if (!cstData.operator || !lodash.isObject(cstData.left)) {
        return false;
      }

      if (!this.checkData(cstData.left)) {
        return false;
      }

      if (
        cstData.operator === Operator.IS_NULL ||
        cstData.operator === Operator.NOT_NULL
      ) {
        delete cstData.right;
        return true;
      } else {
        if (!lodash.isObject(cstData.right)) {
          return false;
        }

        if (!this.checkData(cstData.right)) {
          return false;
        }
      }
    }

    return true;
  };

  createLogicalExpression = operator => ({
    uuid: createUuid(),
    type: 'LogicalExpression',
    operator: operator || Operator.AND, // 'all', 'any'
    children: [this.createBinaryExpression()],
  });

  createBinaryExpression = () => ({
    uuid: createUuid(),
    type: 'BinaryExpression',
    operator: Operator.EQ,
    left: {
      type: mqlKind.VARIABLE,
      viewType: '',
      value: '',
    },
    right: {
      type: mqlKind.LITERAL,
      value: '',
    },
  });

  findParentData = (data, uuid) => {
    if (data && lodash.isArray(data.children) && data.children.length > 0) {
      for (let i = 0; i < data.children.length; i++) {
        const item = data.children[i];
        if (item.uuid === uuid) {
          return data;
        } else if (lodash.isArray(item.children) && item.children.length > 0) {
          const temp = this.findParentData(item, uuid);
          if (temp) {
            return temp;
          }
        }
      }
    }

    return null;
  };

  updateData = (list, uuid, data) => {
    if (!lodash.isArray(list)) {
      return;
    }

    list.forEach(item => {
      if (item.uuid === uuid) {
        Object.keys(data).forEach(key => {
          item[key] = data[key];
        });
      } else if (lodash.isArray(item.children)) {
        this.updateData(item.children, uuid, data);
      }
    });
  };

  insertData = (data, uuid, index, type, operator) => {
    if (data.uuid === uuid) {
      let insertData;
      if (type === 'LogicalExpression') {
        insertData = this.createLogicalExpression(operator);
      } else if (type === 'BinaryExpression') {
        insertData = this.createBinaryExpression();
      }

      if (insertData) {
        if (!lodash.isArray(data.children)) {
          data.children = [];
        }
        data.children.splice(index, 0, insertData);
      }

      return true;
    } else if (lodash.isArray(data.children)) {
      for (let i = 0; i < data.children.length; i++) {
        const item = data.children[i];
        if (this.insertData(item, uuid, index, type, operator)) {
          return true;
        }
      }
    }

    return false;
  };

  removeData = (list, uuid) => {
    if (!lodash.isArray(list)) {
      return false;
    }

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.uuid === uuid && list.length > 1) {
        list.splice(i, 1);
        return true;
      } else if (lodash.isArray(item.children) && item.children.length > 1) {
        if (this.removeData(item.children, uuid)) {
          return true;
        }
      }
    }

    return false;
  };

  mergeData = (parentData, data, index) => {
    if (
      !parentData ||
      !lodash.isArray(parentData.children) ||
      parentData.children.length < 1
    ) {
      return false;
    }

    if (!data || !lodash.isArray(data.children) || data.children.length < 1) {
      return false;
    }

    for (let i = 0; i < parentData.children.length; i++) {
      const item = parentData.children[i];
      if (item.uuid === data.uuid) {
        parentData.children.splice(index, 0, ...data.children);
        return true;
      } else if (
        item &&
        lodash.isArray(item.children) &&
        item.children.length > 0
      ) {
        if (this.mergeData(item, data, index)) {
          return true;
        }
      }
    }

    return false;
  };

  insertLogical = payload => {
    const { uuid, index, type, operator } = payload;
    const { cstData } = this.state;

    this.insertData(cstData, uuid, index, type, operator);

    this.setState({
      cstData: {
        ...cstData,
      },
      showErrorMsg: false,
      errorMsg: '',
    });
  };

  updateLogical = payload => {
    const { uuid, data = {} } = payload;
    let { cstData } = this.state;

    if (uuid === cstData.uuid) {
      cstData = {
        ...cstData,
        ...data,
      };
    } else {
      this.updateData(cstData.children, uuid, data);
    }

    this.setState({
      cstData,
      showErrorMsg: false,
      errorMsg: '',
    });
  };

  insertChildren = (list, children) => {
    for (let i = 0; i < children.length; i++) {
      list.push(children[i]);
    }
  };

  repairChildrenOperator = cstData => {
    if (
      !cstData ||
      !lodash.isArray(cstData.children) ||
      cstData.children.length < 1
    ) {
      return;
    }

    const children = [];
    for (let i = 0; i < cstData.children.length; i++) {
      const item = cstData.children[i];
      if (
        item.type === 'LogicalExpression' &&
        item.operator === cstData.operator &&
        lodash.isArray(item.children) &&
        item.children.length > 0
      ) {
        this.insertChildren(children, item.children);
      }

      if (item.type === 'BinaryExpression') {
        children.push(item);
      }
    }

    cstData.children = children;
  };

  repairOperator = (cstData, uuid, data) => {
    if (cstData.uuid === uuid) {
      Object.keys(data).forEach(key => {
        cstData[key] = data[key];
      });

      this.repairChildrenOperator(cstData);

      return true;
    } else if (
      lodash.isArray(cstData.children) &&
      cstData.children.length > 0
    ) {
      for (let i = 0; i < cstData.children.length; i++) {
        const item = cstData.children[i];
        if (this.repairOperator(item, uuid, data)) {
          return true;
        }
      }
    }

    return false;
  };

  modifyOperator = payload => {
    const { uuid, data = {} } = payload;
    const { cstData } = this.state;

    this.repairOperator(cstData, uuid, data);
    const parentData = this.findParentData(cstData, uuid);
    this.repairChildrenOperator(parentData);

    this.setState({
      cstData: {
        ...cstData,
      },
    });
  };

  removeLogical = payload => {
    const { uuid } = payload;
    const { cstData } = this.state;

    this.removeData(cstData.children, uuid);

    this.setState({
      cstData: {
        ...cstData,
      },
      showErrorMsg: false,
      errorMsg: '',
    });
  };

  render() {
    const {
      t,
      isModuleParent = false,
    } = this.props;

    const {
      cstData,
      errorMsg,
      showErrorMsg,
      fields = [],
    } = this.state;

    return (
      <Modal
        visible={true}
        title={t('common:editor.conditional')}
        okText={t('common:ok')}
        cancelText={t('common:cancel')}
        onOk={this.handleOk}
        width='720px'
        maskClosable={false}
        {...this.props}
        bodyStyle={{ padding: 12 }}
        okButtonProps={{disabled: isModuleParent}}
      >
        <ConditionalContext.Provider
          value={{
            insertLogical: this.insertLogical,
            updateLogical: this.updateLogical,
            modifyOperator: this.modifyOperator,
            removeLogical: this.removeLogical,
            fields,
          }}
        >
          <LogicalExpression
            t={t}
            data={cstData}
            prefix={prefix}
            rootNode={true}
          />
        </ConditionalContext.Provider>
        {showErrorMsg && (
          <div style={{ marginTop: '12px', color: 'red' }}>{errorMsg}</div>
        )}
      </Modal>
    );
  }
}

export default Conditional;
