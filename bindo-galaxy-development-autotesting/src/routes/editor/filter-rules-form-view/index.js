import React from 'react'
import FilterRulesFormView from '../../../components/Editor/FilterRulesFormView';

export default props => {
  document.title = 'Action View - Bindo'

  return <FilterRulesFormView {...props} />
}
