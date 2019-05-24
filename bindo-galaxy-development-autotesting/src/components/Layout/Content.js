import React from 'react';
import DragSide from '../DragSide';

export default ({ children, className = ''}) => (
  <DragSide.Content className={className}>
    { children }
  </DragSide.Content>
);
