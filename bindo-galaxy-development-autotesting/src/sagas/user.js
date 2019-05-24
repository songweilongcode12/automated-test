import { call, put, takeEvery } from 'redux-saga/effects';
import { message } from 'antd';
import axios from 'axios';
import urls from '../constants/urls';
import reduxKey from '../constants/reduxKey';
import i18n from '../i18n';

function* handleLogin({ payload }) {
  // 增加钥匙对
  const values = {
    client_id: urls.client_id,
    client_secret: urls.client_secret,
    ...payload.values,
  }
  try {
    const res = yield call(axios.post, urls.login, values);

    if (res.user && res.user.access_token) {
      localStorage.setItem('access_token', res.user.access_token);

      yield put({
        type: reduxKey.UPDATE_USER_REDUCER,
        payload: {
          signingIn: false,
        },
      });

      const url = localStorage.getItem('redirect_url');

      if (url) {
        window.location.href = url;
      } else {
        window.location.href = window.location.origin;
      }
    }
  } catch (error) {
    message.error(i18n.t('common:login.loginFailed'));
    log.error(error);
    yield put({
      type: reduxKey.UPDATE_USER_REDUCER,
      payload: {
        signingIn: false,
      },
    });
  }
}

function* handleForgotPassword({ payload }) {
  try {
    const {
      email = '',
      // store,
      callback,
    } = payload;
    if(!email){
      return;
    }

    const urlAndQuery = `${urls.forgot_password}?client_id=${urls.client_id}&client_secret=${urls.client_secret}&identifier=${email}`
    const res = yield call(axios.get, urlAndQuery)
    if (typeof callback === 'function') {
      callback(res)
    }
  } catch (error) {
    message.error(i18n.t('common:login.emailSentFailed'));
    log.error(error);
  }
}
function* handleResetPassword({ payload }) {
  try {

    /* eslint-disable */
    const {
      password='',
      reset_password_token='',
      callback,
    } = payload;
    const data = {
      reset_password_token,
      password,
    }
  /* eslint-able */

    const res = yield call(axios.post, urls.reset_password, {...data})
    if (typeof callback === 'function') {
      callback(res)
    }

  } catch (error) {
    message.error(i18n.t('common:login.resetPasswordFailed'));
    log.error(error);
  }
}

function* watchUser() {
  yield takeEvery(reduxKey.LOGIN, handleLogin);
  yield takeEvery(reduxKey.FORGOT_PASSWORD, handleForgotPassword);
  yield takeEvery(reduxKey.RESET_PASSWORD, handleResetPassword);
}

export default watchUser()
