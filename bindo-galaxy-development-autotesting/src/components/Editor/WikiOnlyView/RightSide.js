import React from 'react'
import {
  Tabs,
  Skeleton,
} from 'antd';
import Comments from '../../Comments'
import Logs from '../../Logs'
import {
  parseParams,
} from '../../../utils/galaxy'

export default (props) => {
  const { t } = props;
  const {
    menuID,
    storeIDs,
    stores,
  } = parseParams(props);

  return (
    <Tabs className="rightside-tabs">
      <Tabs.TabPane tab={t('common:log')} key="log">
        <Skeleton
          active={true}
          loading={storeIDs.length < 1}
          className="bg-galaxy-skeleton"
        >
          <Logs
            {...props}
            storeIDs={storeIDs}
            stores={stores}
            logType="WIKI"
            relationMenuID={menuID}
          />
        </Skeleton>
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('common:comments')} key="comments">
        <Skeleton
          active={true}
          loading={storeIDs.length < 1}
          className="bg-galaxy-skeleton"
        >
          <Comments
            storeIDs={storeIDs}
            commentType="wikionly"
            relationID={menuID}
          />
        </Skeleton>
      </Tabs.TabPane>
    </Tabs>
  );
}
