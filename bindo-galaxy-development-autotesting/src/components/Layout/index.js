import React from 'react';
import { Spin } from 'antd';
import Content from './Content';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import NotStaffPage from './NotStaffPage';
import Header from '../Header';
import DragSide from '../DragSide';
import Menus from '../Menus';
import './Layout.less';
import {
  isStaffRole,
  parseParams,
} from '../../utils/galaxy'
import common from '../../constants/common';

const prefix = 'bg-c-layout';

const Layout = (props) => {
  const {
    children,
    showMenu = true,
    galaxyLoading = false,
  } = props;

  const {
    galaxyState,
  } = parseParams(props);
  const isStaff = isStaffRole(props) || galaxyState === common.DASHBOARD;

  return (
    <div className={prefix}>
      <Header {...props} />
      {
        isStaff &&
        <DragSide>
          {
            showMenu &&
            <DragSide.LeftSide>
              <Menus {...props} />
            </DragSide.LeftSide>
          }
          { children }
        </DragSide>
      }
      {
        !isStaff &&
        <NotStaffPage {...props} prefix={prefix} />
      }
      {
        galaxyLoading &&
        <div className={`${prefix}-loading`}>
          <Spin className={`${prefix}-loading-spin`} size="large" />
        </div>
      }
    </div>
  );
};

Layout.Content = Content;
Layout.LeftSide = LeftSide;
Layout.RightSide = RightSide;

export default Layout;
