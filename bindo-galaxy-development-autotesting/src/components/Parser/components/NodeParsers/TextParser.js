import React, { Component } from 'react'
import { Form, Input, Select } from 'antd'
import lodash from 'lodash'
import hocParser from './hocParser'

@hocParser()
class TextParser extends Component {
  getAddon = (data, tag, name, initialValue) => {
    let result = null;

    const { getFieldDecorator } = this.props;

    if (data && data.length > 0) {
      if (data.length > 1) {
        result = (
          getFieldDecorator(`prefix${tag}${name}`, {
            initialValue,
          })(
            <Select style={{ minWidth: 60, maxWidth: 120 }}>
              {
                data.map(item =>
                  <Select.Option key={item} value={item}>{item}</Select.Option>
                )
              }
            </Select>
          )
        );
      } else {
        [result] = data;
      }
    }

    return result;
  }

  parserTextValue = (addonBefore, addonAfter) => {
    const {
      getInitialValue,
    } = this.props;
    let newValue = getInitialValue();
    let beforeValue = '';
    let afterValue = '';

    for (let i = 0; i < addonBefore.length; i++) {
      const item = addonBefore[i];
      // const regExp = new RegExp(`^${item}`);

      // if (regExp.test(newValue)) {
      //   beforeValue = item;
      //   newValue = newValue.replace(regExp, '');
      //   break;
      // }
      if (
        lodash.isString(newValue)
        && lodash.isString(item)
        && item.length > 0
        && newValue.indexOf(item) === 0
      ) {
        beforeValue = item;
        newValue = newValue.slice(item.length);
        break;
      }
    }

    for (let i = 0; i < addonAfter.length; i++) {
      const item = addonAfter[i];
      // const regExp = new RegExp(`${item}$`);

      // if (regExp.test(newValue)) {
      //   afterValue = item;
      //   newValue = newValue.replace(regExp, '');
      //   break;
      // }
      if (
        lodash.isString(newValue)
        && lodash.isString(item)
        && item.length > 0
        && newValue.indexOf(item) === (newValue.length - item.length)
      ) {
        afterValue = item;
        newValue = newValue.slice(0, newValue.length - item.length);
        break;
      }
    }

    return { initialValue: newValue, beforeValue, afterValue }
  }

  parserInitialValueAndAddon = (name) => {
    const addonProps = {};

    const {
      view,
    } = this.props;
    const {
      addonBefore = [],
      addonAfter = [],
    } = view || {};

    const { initialValue, beforeValue, afterValue } = this.parserTextValue(addonBefore, addonAfter);

    if (Array.isArray(addonBefore) && addonBefore.length > 0) {
      addonProps.addonBefore = this.getAddon(addonBefore, 'Before', name, beforeValue);
    }
    if (Array.isArray(addonAfter) && addonAfter.length > 0) {
      addonProps.addonAfter = this.getAddon(addonAfter, 'After', name, afterValue);
    }

    return { initialValue, addonProps };
  }

  render () {
    const {
      getFieldDecorator,
      field = {},
      getViewProps,
      getRules,
      getFormItemProps,
    } = this.props;

    const {
      name,
    } = field;

    const formItemProps = {
      ...getFormItemProps(),
    };

    const {
      initialValue,
      addonProps,
    } = this.parserInitialValueAndAddon(name);

    const viewProps = {
      ...getViewProps(),
      ...addonProps,
    };

    // let labelView
    // if (helpTooltip && helpTooltip.length > 0) {
    //   labelView = (
    //     <Tooltip key="tooltip" title={helpTooltip}>
    //       <AntdIcon
    //         type="info-circle"
    //         className={`${prefix}-help-tooltip`}
    //       />
    //     </Tooltip>)
    //   formItemProps.label = (
    //     <span>
    //       {formItemProps.label}
    //       {labelView}
    //     </span>
    //   )
    // }

    return (
      <Form.Item {...formItemProps}>
        {getFieldDecorator(name, {
          initialValue,
          rules: getRules(),
        })(
          <Input {...viewProps} />
        )}
      </Form.Item>
    );
  }
}

export default TextParser;
