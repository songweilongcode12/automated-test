import React from 'react'
import SchedulerView from '../../../components/Editor/SchedulerView';

export default props => {
  document.title = 'Scheduler View - Bindo'

  return <SchedulerView {...props} />
}
