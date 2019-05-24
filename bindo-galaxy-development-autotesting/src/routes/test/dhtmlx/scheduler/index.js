import React from 'react'
import Scheduler from './Scheduler'

export default props => {
  document.title = 'Test DHTMLX Scheduler - Bindo'

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
      }}
    >
      <Scheduler {...props} />
    </div>
  );
}
