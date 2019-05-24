import React from 'react'
import {
  Icon as AntdIcon,
  Menu,
  Dropdown,
} from 'antd'
import Icon from '../../components/Icon'

const prefix = 'bg-r-module-views-item';

export default props => {
  const {
    data = {},
    onBtnClick = () => {},
    onMoreClick,
    actionList = [],
    isDefaultView,
  } = props;

  const {
    icon,
    iconType = 'bindo',
  } = data || {};

  const defaultViewProps = {}
  if (isDefaultView) {
    defaultViewProps.color = '#1e88e5'
  } else {
    defaultViewProps.color = '#333'
  }

  const hasActionList = actionList && actionList.length > 0

  return (
    <div className={prefix} onClick={() => onBtnClick(data)}>
      <div className={`${prefix}-icon`}>
        {
          iconType === 'bindo' &&
          <Icon style={{ fontSize: '80px', ...defaultViewProps}} type={icon} />
        }
        {
          iconType === 'antd' &&
          <AntdIcon style={{ fontSize: '80px', ...defaultViewProps}} type={icon} />
        }
      </div>
      <div className={`${prefix}-bar`}>
        <div className={`${prefix}-title`}>
          {data.name}
        </div>
        {
          onMoreClick &&
          <div
            className={`${prefix}-more`}
            onClick={evt => {
              evt.stopPropagation();
              onMoreClick(data);
            }}
          >
            <AntdIcon type='ellipsis' />
          </div>
        }
        {
          hasActionList &&
          <Dropdown
            overlay={
              <Menu>
                {
                  actionList.map(item =>
                    <Menu.Item
                      key={item.key}
                      onClick={evt => {
                        evt.domEvent.stopPropagation();
                        item.onClick();
                      }}
                    >
                      {item.name}
                    </Menu.Item>
                  )
                }
              </Menu>
            }
          >
              <AntdIcon className={`${prefix}-more`} type='ellipsis' />
          </Dropdown>
        }
      </div>
    </div>
  );
}
