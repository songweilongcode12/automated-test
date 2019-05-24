import React, { Component } from 'react'
import { Checkbox } from 'antd'
import Conditional from '../../Conditional'
import { formulaToCst, cstToFormula } from '../../../../../data/CstParser'
import common from '../../../../../constants/common'

class InvisibleProperty extends Component {

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

    listen.type = common.INVISIBLE;
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

    let {
      listens = [],
    } = field;
    const listenList = listens || [];

    if(listens === null){
      listens = [];
    }

    let listen = {};
    for (let i = 0; i < listenList.length; i++) {
      if (listenList[i] && listenList[i].type === common.INVISIBLE) {
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
      invisible = false,
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
          checked={invisible}
          onChange={evt => onFieldPropsChange('invisible', evt.target.checked)}
          disabled={handleFieldsDisable()}
        >
          {t('common:editor.invisible')}
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
            handleFieldsDisable={handleFieldsDisable}
            isModuleParent={isModuleParent}
          />
        }
      </div>
    );
  }
}

export default InvisibleProperty;
