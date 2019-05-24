import React from 'react'
import Embedded from './Embedded'

export default props => {
  document.title = 'Embedded - Bindo'

  return <Embedded {...props} />
}
