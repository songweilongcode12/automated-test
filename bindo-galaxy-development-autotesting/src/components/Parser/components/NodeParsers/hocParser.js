import React, { Component } from 'react'
import { translate } from 'react-i18next'
import moment from 'moment'
import lodash from 'lodash'
import { Tooltip, Icon as AntdIcon } from 'antd'
import widgets from '../../../../constants/widgets'
import common from '../../../../constants/common'
import { runFormula } from '../../../../data/MqlParser'
import './ParserNode.less'

// 部分组件不适合有label,特殊处理
const noLabelWidgets = new Set([
  widgets.BOOLEAN,
]);

export default () => (WrappedComponent) => {
  @translate()
  class BaseParser extends Component {

    getDateValue = (value, format) => {
      let dateValue;
      if (value.indexOf('T') > -1) {
        dateValue = moment(value, moment.ISO_8601);
      } else {
        dateValue = moment(value, format);
      }
      return dateValue;
    }

    // Todo 默认值具体实现需要重新讨论, 暂且使用给予对应默认值的形式
    getInitialValue = () => {
      const {
        initialValue = null,
        field,
        recordData,
        view,
      } = this.props;

      const {
        viewType,
        format,
      } = view;

      const {
        defaultValue,
      } = field;

      const newData = !(recordData.id || recordData.$id);

      let newInitialValue = initialValue;

      if (newData) {
        newInitialValue = defaultValue;
      }

      if (
        !initialValue
        && (field.allowMultiValue || viewType === widgets.DATE_RANGE)
      ) {
        newInitialValue = [];
      }

      if ( viewType === widgets.DATE) {
        if (newInitialValue) {
          newInitialValue = this.getDateValue(newInitialValue, format);
        } else {
          newInitialValue = undefined;
        }
      }
      // if (viewType === widgets.TIMEPICKER || viewType === widgets.DATE) {
      //   if (newInitialValue) {
      //     newInitialValue = moment(newInitialValue, format);
      //   } else {
      //     newInitialValue = undefined;
      //   }
      // }

      if (widgets.DATE_RANGE === viewType) {
        const values = [];
        if (newInitialValue.length > 0 && lodash.isString(newInitialValue[0])) {
          // values.push(moment(newInitialValue[0], format));
          values.push(this.getDateValue(newInitialValue[0], format));
        }
        if (newInitialValue.length > 1 && lodash.isString(newInitialValue[1])) {
          // values.push(moment(newInitialValue[1], format));
          values.push(this.getDateValue(newInitialValue[1], format));
        }
        if (values.length > 0) {
          newInitialValue = values;
        }
      }

      return newInitialValue;
    }

    // Todo 目前只有required
    getRules = () => {
      const {
        t,
        field,
        getFieldValue,
        uniqueFieldNamesSet = new Set(),
      } = this.props;
      const {
        required = false,
        listens = [],
        name,
        label,
      } = field;

      const listenList = listens || [];

      let formula = '';
      for (let i = 0; i < listenList.length; i++) {
        const listen = listenList[i];
        if (listen && listen.type === common.REQUIRED) {
          ({ formula = '' } = listen);
        }
      }

      let formulaValue = true;
      if (lodash.isString(formula) && formula.length > 0) {
        formulaValue = runFormula(formula, {
          selfFieldCallback: fieldName => getFieldValue(fieldName),
        });
      }

      log.info(uniqueFieldNamesSet.has(name), name);

      return [{
        required: uniqueFieldNamesSet.has(name) || required && formulaValue,
        message: `${label} ${t('common:isRequired')}`,
      }]
    }

    checkReadOnly = () => {
      // 当为view模式时, disabled为true, 根据传入的editableData判断
      const {
        editableData, // 能否编辑
      } = this.props;

      const {
        field,
        getFieldValue,
      } = this.props;

      const {
        readOnly = false,
        listens = [],
      } = field;

      const listenList = listens || [];

      let formula = '';
      for (let i = 0; i < listenList.length; i++) {
        const listen = listenList[i];
        if (listen && listen.type === common.READONLY) {
          ({ formula = '' } = listen);
        }
      }

      let formulaValue = true;
      if (lodash.isString(formula) && formula.length > 0) {
        formulaValue = runFormula(formula, {
          selfFieldCallback: fieldName => getFieldValue(fieldName),
        });
      }

      return !editableData || (readOnly && formulaValue);
    }

    getFormItemProps = () => {
      const {
        field = {},
        view = {},
        prefix,
      } = this.props;

      const {
        viewType,
        helpTooltip = '',
        hiddenLabel = false,
        label: viewLabel,
      } = view;

      const {
        label: fieldLabel,
      } = field;

      const label = fieldLabel || viewLabel;

      const viewProps = {
        colon: false,
        disabled: this.checkReadOnly(),
      };

      if (!hiddenLabel && !noLabelWidgets.has(viewType)) {
        let tooltipView
        if (helpTooltip && helpTooltip.length > 0) {
          tooltipView = (
            <Tooltip key="tooltip" title={helpTooltip}>
              <AntdIcon
                type="info-circle"
                className={`${prefix}-help-tooltip`}
              />
            </Tooltip>)
        }
        viewProps.label = (
          <span>
            {label}
            {tooltipView}
          </span>
        )
      }
      return viewProps;
    }

    getViewProps = () => {
      const {
        view,
      } = this.props;

      const { placeholder = '' } = view || {}

      const viewProps = {
        placeholder,
        disabled: this.checkReadOnly(),
      };

      return viewProps;
    }

    render() {
      return (
        <WrappedComponent
          {...this.props}
          getRules={this.getRules}
          checkReadOnly={this.checkReadOnly}
          getFormItemProps={this.getFormItemProps}
          getViewProps={this.getViewProps}
          getInitialValue={this.getInitialValue}
        />
      );
    }
  }

  return BaseParser;
}
