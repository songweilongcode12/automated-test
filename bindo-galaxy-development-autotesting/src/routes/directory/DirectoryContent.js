import React from 'react'
import {
  parseParams,
  createRouteUrl,
  gotoDashboard,
} from '../../utils/galaxy'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import routes from '../../constants/routes'
import DirectoryItem from './DirectoryItem'
import common from '../../constants/common'

const prefix = 'bg-r-directory';
const galaxyPrefix = 'bg-galaxy';

export default (props) => {
  const {
    t,
  } = props;
  const {
    galaxyState,
    storeSlugs,
  } = parseParams(props);

  if (galaxyState === common.DASHBOARD) {
    gotoDashboard(props);
  }

  return (
    <Layout.Content className="column">
      <div className={`${galaxyPrefix}-header`}>
        <Breadcrumb
          galaxyState={galaxyState}
          storeSlugs={storeSlugs}
        />
      </div>
      <div className={prefix}>
        <DirectoryItem
          icon="icon-appdirectory"
          title={t('common:appDirectory')}
          url={createRouteUrl(routes.APPS, {}, props)}
        />
        <DirectoryItem
          icon="icon-modeldirectory"
          title={t('common:modelDirectory')}
          url={createRouteUrl(routes.MODELS, {}, props)}
        />
        <DirectoryItem
          icon="icon-moduledirectory"
          title={t('common:moduleDirectory')}
          url={createRouteUrl(routes.MODULES, {}, props)}
        />
      </div>
      <div className={`${galaxyPrefix}-footer`}>
        <span>Overview</span>
      </div>
    </Layout.Content>
  );
};
