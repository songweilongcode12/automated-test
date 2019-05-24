import React, { Component } from 'react'
import { Checkbox, Button, Modal, Input } from 'antd'
import hocProperties from './hocProperties'
import StarLabel from '../StarLabel'
import ActionInput from '../ActionInput'
import HelpTooltipProperty from './Properties/HelpTooltipProperty'

@hocProperties()
class CalculatedProperties extends Component {
  state = {
    formula: '',
    showFilterCondition: false,
  }

  handleConditionalClick = () => {
    const {
      view,
    } = this.props;

    const {
      formula = '',
    } = view;

    this.setState({
      formula,
      showFilterCondition: true,
    })
  }

  handleOk = () => {
    const {
      onViewPropsChange,
    } = this.props;

    const {
      formula = '',
    } = this.state;

    onViewPropsChange('formula', formula);

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

  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
      handleFieldsDisable,
    } = this.props;

    const {
      label = '',
      invisible = false,
    } = view;

    const {
      formula,
      showFilterCondition,
    } = this.state;

    const disabled = handleFieldsDisable()

    return (
      <div className="bindo-galaxy-editor-rightside-tabpanel">
        <div className={`${prefix} flex`}>
          <Checkbox
            checked={invisible}
            onChange={evt => onViewPropsChange('invisible', evt.target.checked)}
          >
            {t('common:editor.invisible')}
          </Checkbox>
          <div className={`${prefix}-space`} />
          <div className={`${prefix}-btn-link`}>
            {t('common:editor.conditional')}
          </div>
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            <StarLabel label={t('common:editor.label')} />
          </div>
          <ActionInput
            value={label}
            onOkClick={value => onViewPropsChange('label', value)}
            style={{flex: 1, marginTop: 3}}
          />
        </div>
        <div className={prefix}>
          <Button
            type="primary"
            block
            onClick={this.handleConditionalClick}
          >
            {t('common:editor.calculation')}
          </Button>
        </div>
        <HelpTooltipProperty prefix={prefix} {...this.props} />
        {
          showFilterCondition &&
          <Modal
            visible={true}
            title={t('common:editor.calculation')}
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

export default CalculatedProperties;
