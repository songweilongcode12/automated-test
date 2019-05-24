import React, { Component } from 'react';
import { Checkbox, Select } from 'antd';
import hocProperties from './hocProperties';
import StarLabel from '../StarLabel';
import ActionInput from '../ActionInput';
import HelpTooltipProperty from './Properties/HelpTooltipProperty';

@hocProperties()
class DividerProperties extends Component {
  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      label = '',
      orientation = 'center',
      dashed = false,
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
        <div className={`${prefix}`}>
          <Checkbox
            checked={dashed}
            onChange={evt => onViewPropsChange('dashed', evt.target.checked)}
          >
            {t('common:editor.dashedLine')}
          </Checkbox>
        </div>
        <div className={prefix}>
          <div className={`${prefix}-label`}>
            {t('common:editor.orientation')}
          </div>
          <Select
            value={orientation}
            style={{width: '100%'}}
            onChange={value => onViewPropsChange('orientation', value)}
          >
            <Select.Option key="left" value="left">
              {t('common:editor.left')}
            </Select.Option>
            <Select.Option key="center" value="center">
              {t('common:editor.center')}
            </Select.Option>
            <Select.Option key="right" value="right">
              {t('common:editor.right')}
            </Select.Option>
          </Select>
        </div>
        <HelpTooltipProperty prefix={prefix} {...this.props} />
      </div>
    );
  }
}

export default DividerProperties;
