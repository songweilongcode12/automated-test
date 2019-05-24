import React from 'react'
import SchedulerView from '../../../components/Parser/SchedulerView/SchedulerView'

export default props => {
  document.title = 'Scheduler - Bindo'

  return <SchedulerView {...props} />
}
