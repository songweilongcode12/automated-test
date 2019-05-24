import React from 'react';
import { Spin } from 'antd';
import Header from '../Header';
import Content from './Content';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import './EditorLayout.less';

const prefix = 'bg-c-editor-layout';

const EditorLayout = (props) => {
  const {
    children,
    galaxyLoading = false,
    className = '',
  } = props;

  return (
    <div className={`${prefix} ${className}`}>
      <Header {...props} />
      <Content>
        { children }
      </Content>
      {
        galaxyLoading &&
        <div className={`${prefix}-loading`}>
          <Spin className={`${prefix}-loading-spin`} size="large" />
        </div>
      }
    </div>
  );
};

EditorLayout.Content = Content;
EditorLayout.LeftSide = LeftSide;
EditorLayout.RightSide = RightSide;

export default EditorLayout;
