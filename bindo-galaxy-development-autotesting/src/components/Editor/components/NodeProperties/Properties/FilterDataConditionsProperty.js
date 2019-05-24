import React, { Component } from 'react'
import { Button, Modal, Input } from 'antd'
import common from '../../../../../constants/common'

class FilterDataConditionsProperty extends Component {

  state = {
    formula: '',
    showFilterCondition: false,
  }

  handleConditionalClick = () => {
    const {
      formula = '',
    } = this.getListen() || {};

    this.setState({
      formula,
      showFilterCondition: true,
    })
  }

  handleOk = () => {
    const {
      onListenChange,
    } = this.props;

    const {
      formula = '',
    } = this.state;

    const listen = {
      type: common.FILTER,
      formula,
    };

    onListenChange(listen);

    this.setState({
      formula: '',
      showFilterCondition: false,
    });
  }

  handleFormulaChange = (evt) => {
    this.setState({
      formula: evt.target.value,
    });
  }

  getListen = () => {
    const {
      field,
    } = this.props;

    const {
      listens = [],
    } = field;
    const listenList = listens || [];

    let listen = {};
    for (let i = 0; i < listenList.length; i++) {
      if (listenList[i] && listenList[i].type === common.FILTER) {
        listen = listenList[i];
        break;
      }
    }

    return listen;
  }

  render() {
    const {
      t,
      prefix,
      field,
      handleFieldsDisable,
    } = this.props;

    const {
      allowValue = {},
    } = field;

    const {
      type = common.STATIC,
    } = allowValue || {};

    if (type === common.STATIC) {
      return undefined;
    }

    const {
      formula = '',
      showFilterCondition = false,
    } = this.state;

    const disabled = handleFieldsDisable()

    return (
      <div className={`${prefix}`}>
        <Button
          type="primary"
          block
          onClick={this.handleConditionalClick}
        >
          {t('common:editor.filterDataConditions')}
        </Button>
        {
          showFilterCondition &&
          <Modal
            visible={true}
            title={t('common:editor.filterDataConditions')}
            okText={t('common:ok')}
            cancelText={t('common:cancel')}
            onOk={this.handleOk}
            onCancel={() => this.setState({
              showFilterCondition: false,
            })}
            width="520px"
            bodyStyle={{ padding: 10 }}
            okButtonProps={{disabled}}
          >
            {
              <Input.TextArea
                value={formula}
                rows={4}
                onChange={this.handleFormulaChange}
              />
            }
          </Modal>
        }
      </div>
    );
  }
}

export default FilterDataConditionsProperty;
