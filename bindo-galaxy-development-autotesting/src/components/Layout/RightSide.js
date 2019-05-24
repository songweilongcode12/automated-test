import React from 'react';
import DragSide from '../DragSide';

export default ({ children, className = ''}) => (
  <DragSide.RightSide className={className}>
    { children }
  </DragSide.RightSide>
);
