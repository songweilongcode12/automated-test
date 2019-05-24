import React from 'react';
import { Tabs } from 'antd';
import Layout from '../../Layout';
import Comments from '../../Comments';
import Logs from '../../Logs';
import { parseParams } from '../../../utils/galaxy';

export default (props) => {
  const { t } = props;
  const {
    storeIDs,
    stores,
    storeID,
  } = parseParams(props);
  const { moduleID } = parseParams(props);

  return (
    <Layout.RightSide>
      <Tabs className="rightside-tabs">
        <Tabs.TabPane tab={t('common:log')} key="log">
          <Logs storeIDs={storeIDs} stores={stores} logType="RECORD" relationID={moduleID} {...props} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('common:comments')} key="comments">
          <Comments storeIDs={[storeID]} commentType="parser_formview" relationID={moduleID} />
        </Tabs.TabPane>
      </Tabs>
    </Layout.RightSide>
  );
}
