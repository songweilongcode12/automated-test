import React from 'react';
import Home from './Home';

export default props => {
  document.title = 'Home - Bindo';

  return (
	  <Home {...props} />
  )
};
