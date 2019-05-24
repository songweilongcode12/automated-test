import { handleActions } from 'redux-actions'
import reduxKey from '../constants/reduxKey'

const initState = {
  signingIn: false,
  showSignUp: false,
  registering: false,
  showUserForm: false,
  submittingUser: false,
};

export default handleActions({
  [reduxKey.UPDATE_USER_REDUCER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
  [reduxKey.LOGIN]: (state) => ({
    ...state,
    signingIn: true,
  }),
}, initState);
