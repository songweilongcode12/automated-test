import React from 'react'
import Modules from './Modules'

export default props => {
  document.title = 'Modules - Bindo'

  return <Modules {...props} />
}
