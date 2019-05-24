import React from 'react';
import Directory from './Directory';

export default props => {
  document.title = 'Directory - Bindo';

  return (
	  <Directory {...props} />
  )
};
