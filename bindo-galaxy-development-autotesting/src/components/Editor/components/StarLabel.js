import React from 'react';

export default (props) => {
  const {
    label = '',
    className = '',
  } = props;

  return (
    <span className={className}>
      <span style={{ color: 'red' }}>*</span>
      {label}
    </span>
  );
}
