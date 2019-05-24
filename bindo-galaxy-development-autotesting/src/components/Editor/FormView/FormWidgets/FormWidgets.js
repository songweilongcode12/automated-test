import React, { Component } from 'react';
import { translate } from 'react-i18next';
import layoutComponents from './layoutComponents';
import baseComponents from './baseComponents';
import relationComponents from './relationComponents';
import Sortable from '../../Sortable';

const prefix = 'bindo-galaxy-editor-widgets';

const type = 'formview-widgets';
const options = {
  group: {
    name: 'formview-layout-widgets',
    pull: 'clone',
  },
  sort: false,
  handle: '.bindo-galaxy-editor-widgets-option',
  onAdd: () => {},
  onEnd: () => {},
  onChoose: () => {},
};

const baseOptions = {
  group: {
    name: 'formview-base-widgets',
    pull: 'clone',
  },
  sort: false,
  handle: '.bindo-galaxy-editor-widgets-option',
  onAdd: () => {},
  onEnd: () => {},
  onChoose: () => {},
};

const rrelationOptions = {
  group: {
    name: 'formview-relation-widgets',
    pull: 'clone',
  },
  sort: false,
  handle: '.bindo-galaxy-editor-widgets-option',
  onAdd: () => {},
  onEnd: () => {},
  onChoose: () => {},
};

@translate()
class FormWidgets extends Component {

  render() {
    const { t } = this.props;

    return (
      <div className={prefix}>
        <div className={`${prefix}-title`}>{t('common:module.layoutComponents')}</div>
        <Sortable
          data={layoutComponents}
          options={options}
          type={type}
          className={`${prefix}-fields`}
        />
        <div className={`${prefix}-title`}>{t('common:module.baseComponents')}</div>
        <Sortable
          data={baseComponents}
          options={baseOptions}
          type={type}
          className={`${prefix}-fields`}
        />
        <div className={`${prefix}-title`}>{t('common:module.relationship')}</div>
        <Sortable
          data={relationComponents}
          options={rrelationOptions}
          type={type}
          className={`${prefix}-fields`}
        />
      </div>
    );
  }
}

export default FormWidgets;
