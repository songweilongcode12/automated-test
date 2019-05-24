import React, { Component } from 'react'
import { Checkbox } from 'antd'
import Conditional from '../../Conditional'
import { formulaToCst, cstToFormula } from '../../../../../data/CstParser'
import common from '../../../../../constants/common'

class RequiredProperty extends Component {

  state = {
    showConditional: false,
  }

  handleConditionalClick = () => {
    // todo
    this.setState({
      showConditional: true,
    })
  }

  handleOk = (cst) => {
    const {
      onListenChange,
    } = this.props;
    const formula = cstToFormula(cst);

    const listen = this.getListen() || {};

    listen.type = common.REQUIRED;
    listen.formula = formula;

    onListenChange(listen);

    this.setState({
      showConditional: false,
    })
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
      if (listenList[i] && listenList[i].type === common.REQUIRED) {
        listen = listenList[i];
        break;
      }
    }

    return listen;
  }

  render() {
    const {
      t,
      field,
      prefix,
      onFieldPropsChange,
      getExistingFields,
      handleFieldsDisable,
    } = this.props;

    const {
      required = false,
    } = field;

    const {
      formula = '',
    } = this.getListen() || {};

    const {
      showConditional = false,
    } = this.state;

    const cst = formulaToCst(formula);

    const isModuleParent = handleFieldsDisable() || false;

    return (
      <div className={`${prefix} flex`}>
        <Checkbox
          checked={required}
          onChange={evt => onFieldPropsChange('required', evt.target.checked)}
          disabled={handleFieldsDisable()}
        >
          {t('common:editor.required')}
        </Checkbox>
        <div className={`${prefix}-space`} />
        <div className={`${prefix}-btn-link`} onClick={this.handleConditionalClick}>
          {t('common:editor.conditional')}
        </div>
        {
          showConditional &&
          <Conditional
            getExistingFields={getExistingFields}
            onCancel={() => this.setState({ showConditional: false })}
            data={cst}
            onSubmit={this.handleOk}
            isModuleParent={isModuleParent}
          />
        }
      </div>
    );
  }
}

export default RequiredProperty;
