import React, { Component } from 'react';
import { Checkbox } from 'antd';
import hocProperties from './hocProperties';
import StarLabel from '../StarLabel';
import ActionInput from '../ActionInput';
import reduxKey from '../../../../constants/reduxKey'

const TabPanelTitle = props => {
  const {
    t,
    prefix,
    titleData,
    onTitleChange,
  } = props;

  const {
    uuid,
    title = '',
    helpTooltip = '',
  } = titleData || {};

  return (
    <div className={`${prefix}`}>
      <div className={`${prefix}-label`}>
        <StarLabel label={t('common:editor.label')} />
      </div>
      <ActionInput
        value={title}
        onOkClick={value => onTitleChange('title', value, uuid)}
        style={{flex: 1, marginTop: 3}}
      />
      <div className={`${prefix}-label`}>
        {t('common:editor.helpTooltip')}
      </div>
      <ActionInput
        value={helpTooltip}
        onOkClick={value => onTitleChange('helpTooltip', value, uuid)}
        style={{flex: 1, marginTop: 3}}
      />
    </div>
  );
}

@hocProperties()
class TabsProperties extends Component {
  handleTitleChange = (key, value, uuid) => {
    const { dispatch } = this.props

    dispatch({
      type: reduxKey.UPDATE_MODULE_ENTITY,
      payload: {
        editViews: [
          {
            operate: 'update',
            uuid,
            data: { [key]: value },
          },
        ],
      },
    })
  }

  render() {
    const {
      t,
      view,
      prefix,
      onViewPropsChange,
    } = this.props;

    const {
      children = [],
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
        {
          children.map(item => (
            <TabPanelTitle
              key={item.uuid}
              {...this.props}
              titleData={item}
              onTitleChange={this.handleTitleChange}
            />
          ))
        }
      </div>
    );
  }
}

export default TabsProperties;
