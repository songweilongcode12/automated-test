import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import loadable from 'react-loadable';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
// import { Skeleton } from 'antd';
import configureStore from './store/configureStore';
import routes from './routes';
import i18n from './i18n';
import { formatTime } from './utils/index';
import './axios-config';
import './index.less';

window.log = {
  info: (...message) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line
      console.info(`[${formatTime(new Date())}]`, ...message);
    }
  },
  warn: (...message) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line
      console.warn(`[${formatTime(new Date())}]`, ...message);
    }
  },
  error: (...message) => {
    console.error(`[${formatTime(new Date())}]`, ...message);
  },
};

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Provider store={configureStore()}>
      <Router>
        <Switch>
          {routes.map(route => (
            <Route
              path={route.path}
              key={route.path}
              exact={route.exact === undefined || route.exact}
              component={loadable({
                loader: () => route.load(),
                loading: () => <div />,
              })}
            />
          ))}
        </Switch>
      </Router>
    </Provider>
  </I18nextProvider>,
  document.getElementById('root'),
);
