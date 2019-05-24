import React, { Component } from 'react';
import {
  Row,
  InputNumber,
} from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import ActionInput from '../ActionInput'

@hocProperties()
class SeqNoProperties extends Component {
  render() {
    const {
      t,
      // view,
      onFieldPropsChange,
      field,
    } = this.props;

    const {
      seqNoConfig = {},
    } = field;

    const {
      prefix = '',
      step = 1,
    } = seqNoConfig;

    return (
      <BaseProperties
        {...this.props}
        required={false}
        readOnly={false}
      >
        <div className={prefix}>
          <Row>
            <div className={`${prefix}-label`}>
              {t('common:editor.prefix')}
            </div>
            <ActionInput
              value={prefix}
              onOkClick={value => onFieldPropsChange('seqNoConfig', {
                prefix: value,
                step,
              })}
            />
          </Row>
          <Row>
            <div className={`${prefix}-label`}>
              {t('common:editor.step')}
            </div>
            <InputNumber
              value={step || 1}
              onChange={value => onFieldPropsChange('seqNoConfig', {
                prefix,
                step: value,
              })}
            />
          </Row>
        </div>
      </BaseProperties>
    );
  }
}

export default SeqNoProperties;
