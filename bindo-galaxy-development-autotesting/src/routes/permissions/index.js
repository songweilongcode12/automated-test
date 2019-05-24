import React from 'react'
import Permissions from './Permissions'

export default props => {
  document.title = 'Permissions - Bindo'

  return <Permissions {...props} />
}
