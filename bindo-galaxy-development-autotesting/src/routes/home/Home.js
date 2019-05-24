import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Skeleton } from 'antd';
import reduxKey from '../../constants/reduxKey';
import {
  getMenuUrl,
} from '../../utils/galaxy';

const galaxyPrefix = 'bg-galaxy';

@connect(({ galaxy }) => ({ ...galaxy }))
class Home extends Component {
  componentDidMount() {
    this.queryStores();
  }

  queryStores = () => {
    const {
      dispatch,
      history,
      storesMap: propsStoresMap,
      storesIDRefSlug,
      storesSlugRefID,
      storesAppsMap,
      storesAppsModulesMap,
      storesModulesPermissionsMap,
      storesRolesMap,
      roleModule,
      loginUser,
    } = this.props;

    dispatch({
      type: reduxKey.QUERY_STORES_APPS,
      payload: {
        storesMap: propsStoresMap,
        storesIDRefSlug,
        storesSlugRefID,
        storesAppsMap,
        storesAppsModulesMap,
        storesModulesPermissionsMap,
        storesRolesMap,
        roleModule,
        loginUser,
        callback: ({
          menu,
          storesMap,
        }) => {
          history.push({
            pathname: getMenuUrl({
              menu,
              storesMap,
            }),
          });
        },
      },
    });
  }

  render() {
    return (
      <div className={galaxyPrefix}>
        <div className={`${galaxyPrefix}-to-directory`}>
          <Skeleton active />
        </div>
      </div>
    );
  }
}

export default Home;
