import axios from 'axios';

axios.defaults.baseURL = '/bindo-api';

axios.interceptors.request.use(
  config => {
    const { headers } = config;
    headers['X-USER-DEVICE-ID'] = 'bindo-galaxy-pc';
    headers['X-APPLICATION'] = 'bindo-galaxy-pc';
    const token = localStorage.getItem('access_token');

    if (token) {
      headers['X-USER-ACCESS-TOKEN'] = token;
    }

    return config;
  },
  error => Promise.reject(error),
);

axios.interceptors.response.use(
  response => response.data,
  error => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === 'Token is not valid.'
    ) {
      localStorage.setItem('redirect_url', window.location.href);
      window.location.href = '/login';
    }
  }
);
