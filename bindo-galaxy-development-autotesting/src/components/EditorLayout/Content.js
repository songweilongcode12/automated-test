import React from 'react';

const prefix = 'bg-c-editor-layout';

export default ({ children, className = ''}) => (
  <div className={`${prefix}-content ${className}`}>
    { children }
  </div>
);
