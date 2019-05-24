import React from 'react';
import DragSide from '../DragSide';

export default ({ children, className = ''}) => (
  <DragSide.LeftSide className={className}>
    { children }
  </DragSide.LeftSide>
);
