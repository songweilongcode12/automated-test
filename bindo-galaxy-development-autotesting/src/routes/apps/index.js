import React from 'react';
import Apps from './Apps';

export default props => {
  document.title = 'Apps - Bindo';

  return (
	  <Apps {...props} />
  )
};
