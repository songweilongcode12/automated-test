import React from 'react'
import SingleView from './SingleView'

export default props => {
  document.title = 'Single View - Bindo'

  return (
    <SingleView {...props} />
  );
}
