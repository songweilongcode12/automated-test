import React, { Component } from 'react';
import { Row, Col, InputNumber } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';
import ActionInput from '../ActionInput';

@hocProperties()
class ImageProperties extends Component {
  render () {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    return (
      <BaseProperties {...this.props}>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.buttonText')}
          </div>
          <ActionInput
            value={view.buttonText}
            style={{ flex: 1, marginTop: 3 }}
            onOkClick={value => onViewPropsChange('buttonText', value)}
          />
        </div>
        <div className={prefix}>
          <Row>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.width')}
              </div>
              <InputNumber
                value={view.width || 86}
                onChange={value => onViewPropsChange('width', value)}
              />
            </Col>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.height')}
              </div>
              <InputNumber
                value={view.height || 86}
                onChange={value => onViewPropsChange('height', value)}
              />
            </Col>
          </Row>
        </div>
      </BaseProperties>
    );
  }
}

export default ImageProperties;
