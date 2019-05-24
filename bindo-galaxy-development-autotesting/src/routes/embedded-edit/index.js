import React from 'react'
import EmbeddedEdit from './EmbeddedEdit'

export default props => {
  document.title = 'Embedded - Bindo'

  return <EmbeddedEdit {...props} />
}
