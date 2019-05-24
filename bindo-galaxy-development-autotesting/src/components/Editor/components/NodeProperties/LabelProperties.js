import React, { Component } from 'react';
import { Checkbox, InputNumber, Select } from 'antd';
import hocProperties from './hocProperties';
import StarLabel from '../StarLabel';
import ActionInput from '../ActionInput';
import HelpTooltipProperty from './Properties/HelpTooltipProperty';

/* eslint-disable */
const fontWeights = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  'normal',
  'bold',
  'bolder',
  'inherit',
];
/* eslint-enable */

@hocProperties()
class LabelProperties extends Component {
  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      label = '',
      fontWeight = 500,
      fontSize = 14,
      invisible = false,
    } = view;

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
          <div className={`${prefix}-label`}>
            {t('common:editor.fontSize')}
          </div>
          <InputNumber
            min={12}
            style={{width: '100%'}}
            value={fontSize}
            onChange={value => onViewPropsChange('fontSize', value)}
          />
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.fontThickness')}
          </div>
          <Select
            value={fontWeight}
            style={{width: '100%'}}
            onChange={value => onViewPropsChange('fontWeight', value)}
          >
            {
              fontWeights.map(item =>
                <Select.Option
                  key={item}
                  value={item}
                >
                  {item}
                </Select.Option>
              )
            }
          </Select>
        </div>
        <HelpTooltipProperty prefix={prefix} {...this.props} />
      </div>
    );
  }
}

export default LabelProperties;
