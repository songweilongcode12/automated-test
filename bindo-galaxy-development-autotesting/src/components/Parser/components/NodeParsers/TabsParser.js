import React, {Component} from 'react';
import { Tabs, Tooltip, Icon as AntdIcon } from 'antd';
import { createFormItem } from './ParserFactory';

class TabsParser extends Component {
  getTabPane = ({ item }) => {
    const { title, uuid, children = [], helpTooltip } = item;

    const {
      form,
      fields,
      storeID,
      appID,
      moduleID,
      action,
      dispatch,
      prefix,
      recordData,
      editableData,
      relationRecords = {},
      uniqueFieldNamesSet = new Set(),
      storesAppsModulesMap = new Set(),
      storesAppsMap = new Set(),
    } = this.props;

    const params = {
      form,
      fields,
      storeID,
      appID,
      moduleID,
      action,
      dispatch,
      prefix,
      recordData,
      editableData,
      relationRecords,
      uniqueFieldNamesSet,
      storesAppsModulesMap,
      storesAppsMap,
    };
    let tabTitle;

    if (helpTooltip) {
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
      tabTitle = (
        <span>
          {title}
          {tooltipView}
        </span>
      )
    } else {
      tabTitle = title;
    }

    return (
      <Tabs.TabPane tab={tabTitle} key={uuid} forceRender>
        {children.map(view => createFormItem({...params, view}))}
      </Tabs.TabPane>
    )
  }

  render() {
    const { view } = this.props
    const { size = 'default', children = [] } = view || {}

    return (
      <Tabs size={size}>
        {children.map(item => this.getTabPane({ item }))}
      </Tabs>
    )
  }
}
export default TabsParser
