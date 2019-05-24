import React, { Component } from 'react'
import lodash from 'lodash';
import BindoFroalaParser from '../../BindoFroalaEditor/BindoFroalaParser';
import Layout from '../../Layout';
import Breadcrumb from '../../Breadcrumb';
import {
  parseParams,
  createRouteUrl,
  getCurrentI18nValue,
} from '../../../utils/galaxy';
import {
  findApp,
} from '../../../utils/app';
import {
  queryRecord,
} from '../../../data/graphql/record';
import { findMenuBranch } from '../../../utils/menu';
import routes from '../../../constants/routes';
import common from '../../../constants/common';

import {
  queryWiki,
} from '../../../data/graphql/wiki';
import { findModule } from '../../../utils/module';

const galaxyPrefix = 'bg-galaxy';

class WikiViewContent extends Component {

  state = {
    record: {},
    editorContext: '',
  }

  componentDidMount () {
    this.loadWiki(this.props);

    const { recordID } = parseParams(this.props);

    if (recordID && recordID !== 'record0') {
      this.loadRecord(this.props);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { wikiKey } = this.props;
    const { wikiKey: nextWikiKey } = nextProps;
    if (wikiKey !== nextWikiKey) {
      // this.setState({isEditable: false});
      this.loadWiki(nextProps)
    }
    return true;
  }

  loadWiki = async ({wikiKey: key}) => {

    const { storeID } = parseParams(this.props);

    if (!key) {
      this.setState({
        editorContext: '',
      });
      return
    }

    const data = await queryWiki({storeID, key});
    const { value } = data;

    if (data) {
      this.setState({
        editorContext: value,
      });
    }
  }

  loadRecord = async (props) => {
    const { moduleID, recordID, storeID } = parseParams(props);

    if (storeID) {
      let record = {};

      if (recordID) {
        const recordData = await queryRecord({
          storeID,
          moduleID,
          recordID,
          associates: ['*'],
        });

        record = this.getInitRecord(recordData || {});
      }

      this.setState({ record });
    }
  }

  getInitRecord = (record) => ({
    id: record.id,
    key: record.id,
    moduleID: record.moduleID,
    ...record.record,
  });

  getBreadcrumbData = () => {
    const {
      t,
    } = this.props;
    const {
      menuID,
      recordID,
      storeID,
      appID,
      moduleID,
    } = parseParams(this.props);

    const app = findApp({
      props: this.props,
      storeID,
      appID,
    });
    const apps = app ? [app] : [];

    const menuBranch = findMenuBranch(apps, menuID) || [];

    const breadcrumbData = [];
    menuBranch.forEach(item => {
      if (item.type === common.MODULE) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.RECORDS, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.SETTING) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.SETTINGS, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else if (item.type === common.EMBEDDED) {
        breadcrumbData.push({
          id: item.id,
          type: 'link',
          url: createRouteUrl(routes.EMBEDDED, {}, this.props),
          name: getCurrentI18nValue('name', item),
        });
      } else {
        breadcrumbData.push({
          id: item.id,
          type: 'label',
          name: getCurrentI18nValue('name', item),
        });
      }
    });

    if (recordID === 'record0') {
      breadcrumbData.push({
        id: 'parser_formview_action',
        type: 'link',
        url: createRouteUrl(routes.RECORD, {}, this.props),
        name: t('common:new'),
      });
    } else {
      const { record } = this.state;
      if (record && record.id) {
        let nameKey = '';
        const module = findModule({
          props: this.props,
          storeID,
          appID,
          moduleID,
        })
        if (
          lodash.isObject(module)
          && lodash.isObject(module.template)
          && lodash.isString(module.template.displayName)
        ) {
          nameKey = module.template.displayName || 'name';
        }
        let recordName = `#${record.id}`;
        if (record[nameKey]) {
          recordName = record[nameKey];
        }

        breadcrumbData.push({
          id: `record_${record.id}`,
          type: 'link',
          url: createRouteUrl(routes.RECORD_ACTION, {}, this.props),
          name: recordName,
        });
      }
    }

    breadcrumbData.push({
      id: 'parser_views_from_wiki',
      type: 'label',
      name: t('common:wiki'),
    })

    return breadcrumbData;
  }

  render () {

    const {
      galaxyState,
      storeSlugs,
    } = parseParams(this.props);

    const {
      editorContext,
    } = this.state

    return (
      <Layout.Content className='column'>
        <div className={`${galaxyPrefix}-header`}>
          <Breadcrumb
            galaxyState={galaxyState}
            storeSlugs={storeSlugs}
            data={this.getBreadcrumbData()}
            {...this.props}
            // shortcutData={this.getShortcutData()}
          />
        </div>
        <div style={{padding: 10}}>
          <BindoFroalaParser model={editorContext} />
        </div>
      </Layout.Content>
    )
  }
}

export default WikiViewContent;
