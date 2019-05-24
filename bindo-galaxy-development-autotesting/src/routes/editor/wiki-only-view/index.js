import React from 'react'
import WikiOnlyView from '../../../components/Editor/WikiOnlyView';

export default props => {
  document.title = 'Wiki Only - Bindo'

  return <WikiOnlyView {...props} />
}
