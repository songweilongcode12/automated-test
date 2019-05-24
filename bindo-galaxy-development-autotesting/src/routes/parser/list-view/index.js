import React from 'react'
import ListView from '../../../components/Parser/ListView'

export default props => {
  document.title = 'Records - Bindo'

  return <ListView {...props} />
}
