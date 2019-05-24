import React, { Component } from 'react';
import { Row, Col, InputNumber } from 'antd';
import hocProperties from './hocProperties';
import BaseProperties from './BaseProperties';

@hocProperties()
class DecimalProperties extends Component {
  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    return (
      <BaseProperties {...this.props} defaultValue placeholder>
        <div className={prefix}>
          <Row>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.precision')}
              </div>
              <InputNumber
                value={view.precision || 1}
                onChange={value => onViewPropsChange('precision', value)}
              />
            </Col>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.step')}
              </div>
              <InputNumber
                value={view.step || 1}
                onChange={value => onViewPropsChange('step', value)}
              />
            </Col>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.minValue')}
              </div>
              <InputNumber
                value={view.minValue}
                onChange={value => onViewPropsChange('minValue', value)}
              />
            </Col>
            <Col span={12}>
              <div className={`${prefix}-label`}>
                {t('common:editor.maxValue')}
              </div>
              <InputNumber
                value={view.maxValue}
                onChange={value => onViewPropsChange('maxValue', value)}
              />
            </Col>
          </Row>
        </div>
      </BaseProperties>
    );
  }
}

export default DecimalProperties;
