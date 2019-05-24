import React from 'react';
import Content from './Content';
import LeftSide from './LeftSide';
import RightSide from './RightSide';
import './DragSide.less';

const prefix = 'bg-c-dragside';

const DragSide = ({ children, className = ''}) => (
  <div className={`${prefix} ${className}`}>
    { children }
  </div>
);

DragSide.Content = Content;
DragSide.LeftSide = LeftSide;
DragSide.RightSide = RightSide;

export default DragSide;
