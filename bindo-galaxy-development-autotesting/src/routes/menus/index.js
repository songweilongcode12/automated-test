import React from 'react';
import Menus from './Menus';

export default props => {
  document.title = 'Menus - Bindo';

  return (
	  <Menus {...props} />
  )
};
