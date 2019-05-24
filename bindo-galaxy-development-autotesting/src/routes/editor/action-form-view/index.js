import React from 'react'
import ActionFromView from '../../../components/Editor/ActionFormView';

export default props => {
  document.title = 'Action View - Bindo'

  return <ActionFromView {...props} />
}
