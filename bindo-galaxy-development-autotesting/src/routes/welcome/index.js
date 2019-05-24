import React from 'react';
import Welcome from './Welcome';

export default props => {
  document.title = 'Home - Bindo';

  return (
	  <Welcome {...props} />
  )
};
