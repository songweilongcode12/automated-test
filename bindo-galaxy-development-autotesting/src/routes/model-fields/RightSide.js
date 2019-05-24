import React from 'react'
import {
  Tabs,
  Skeleton,
} from 'antd'
import Comments from '../../components/Comments'
import Logs from '../../components/Logs'
import {
  parseParams,
} from '../../utils/galaxy'

export default (props) => {
  const { t } = props;
  const {
    moduleID,
    storeIDs,
    stores,
  } = parseParams(props);

  return (
    <Tabs className="rightsider-tabs">
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
            logType="FIELD"
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
            commentType="modelAttributes"
            relationID={moduleID}
          />
        </Skeleton>
      </Tabs.TabPane>
    </Tabs>
  );
}
