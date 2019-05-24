import React from 'react'
import { Tabs, Skeleton } from 'antd'
import Comments from '../../components/Comments'
import Logs from '../../components/Logs'
import { parseParams } from '../../utils/galaxy'

export default (props) => {
  const { t } = props;
  const { storeIDs, stores } = parseParams(props);

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
            logType="MODULE"
            relationID="MODULE"
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
            commentType="modules"
            relationID="modules"
          />
        </Skeleton>
      </Tabs.TabPane>
    </Tabs>
  );
}
