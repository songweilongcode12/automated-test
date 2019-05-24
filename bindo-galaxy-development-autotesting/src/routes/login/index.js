import React from 'react';
import Login from './Login';

export default props => {
  document.title = 'Login - Bindo';

  return (
	  <Login {...props} />
  )
};
