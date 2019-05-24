import React from 'react'
import ActionListView from '../../../components/Editor/ActionListView';

export default props => {
  document.title = 'Action View - Bindo'

  return <ActionListView {...props} />
}
