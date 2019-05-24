import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Icon from '../../../Icon';

const prefix = 'bindo-galaxy-editor-widgets-option';

@translate()
class Option extends Component {

  render() {
    const { t, view } = this.props;
    const { text, type, icon, uuid } = view;

    const i18nText = t(`common:editor.${text}`);

    return (
      <div
        key={type}
        className={prefix}
        data-view-type={type}
        data-text={i18nText}
        data-title={text}
        data-uuid={uuid}
      >
        <Icon type={icon} style={{ fontSize: '16px' }} />
        <div className={`${prefix}-text`}>{i18nText}</div>
      </div>
    );
  }
}

export default Option;
