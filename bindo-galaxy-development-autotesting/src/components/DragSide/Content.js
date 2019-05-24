import React from 'react';

const prefix = 'bg-c-dragside';

export default ({ children, className = ''}) => (
  <div className={`${prefix}-content ${className}`}>
    { children }
  </div>
);
