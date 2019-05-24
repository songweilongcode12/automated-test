import React from 'react'
import ListView from '../../../components/Editor/ListView';

export default props => {
  document.title = 'Form View - Bindo'

  return <ListView {...props} />
}
