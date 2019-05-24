import React from 'react'
import Gantt from './Gantt'

export default props => {
  document.title = 'Test DHTMLX Gantt - Bindo'

  return <Gantt {...props} />
}
