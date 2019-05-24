import React from 'react'
import WikiOnlyView from '../../../components/Parser/WikiOnlyView'

export default props => {
  document.title = 'Wiki Only - Bindo'

  return <WikiOnlyView {...props} />
}
