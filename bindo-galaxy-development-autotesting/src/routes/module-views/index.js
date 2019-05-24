import React from 'react'
import ModuleViews from './ModuleViews'

export default props => {
  document.title = 'Module Views - Bindo'

  return <ModuleViews {...props} />
}
