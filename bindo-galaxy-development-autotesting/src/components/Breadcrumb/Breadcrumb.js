import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { translate } from 'react-i18next';
import {
  createRouteUrl,
} from '../../utils/galaxy';
import routes from '../../constants/routes';
import common from '../../constants/common';
import './Breadcrumb.less';
import Shortcut from './Shortcut';
// import { createUuid } from '../../utils';

const prefix = 'bindo-galaxy-module-breadcrumb';
@translate()
class BreadcrumbRoot extends React.Component {
  createBreadcrumbItem = (record) => {
    const { type, name, url } = record;

    if (type === 'link') {
      return (
        <Link to={url}>{name}</Link>
      );
    } else {
      return (
        <span>{name}</span>
      );
    }
  }

  getBreadcrumbItems = () => {
    const {
      galaxyState,
      storeSlugs,
      data = [],
    } = this.props;

    const menuNodes = [
      {
        id: 'bindo_galaxy',
        type: data && data.length > 0 && galaxyState === common.BUILDER ? 'link' : 'label',
        url: createRouteUrl(routes.DIRECTORY, {
          galaxyState,
          storeSlugs,
        }),
        name: galaxyState === common.BUILDER ? 'Module Builder' : 'Dashboard',
      },
      ...data,
    ];

    const bItems = [];

    for (let i = 0, len = menuNodes.length; i < len; i++) {
      const record = menuNodes[i];
      const isLastOne = i === len - 1;

      bItems.push(
        <Breadcrumb.Item key={record.id}>
          {
            this.createBreadcrumbItem(record, isLastOne)
          }
        </Breadcrumb.Item>
      );
    }

    return bItems;
  }

  render () {

    const {
      shortcutData = [],
    } = this.props;

    return (
      <div className={`${prefix}-layout`}>
        <Breadcrumb className={prefix} separator=">">
          {this.getBreadcrumbItems()}
        </Breadcrumb>
        <Shortcut
          dataSource={shortcutData}
          {...this.props}
        />
      </div>
    );
  }
}

export default BreadcrumbRoot;
