import React from 'react'
import ModelFields from './ModelFields'

export default props => {
  document.title = 'Model Attributes - Bindo'

  return <ModelFields {...props} />
}
