import React from 'react'
import WikiView from '../../../components/Parser/WikiView'

export default props => {
  document.title = 'Records - Bindo'

  return <WikiView {...props} />
}
