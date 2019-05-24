import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import reducers from '../reducers';
import sagas from '../sagas';
import { name, version } from '../../package.json';

export default (initialState) => {
  const isDebug = process.env.NODE_ENV === 'development';
  const sagaMiddleware = createSagaMiddleware()

  const middleware = [sagaMiddleware];

  let enhancer;

  if (isDebug) {
    middleware.push(createLogger({
	    collapsed: true,
	  }));

    const composeEnhancers = composeWithDevTools({
      name: `${name}@${version}`,
    });

    enhancer = composeEnhancers(applyMiddleware(...middleware));
  } else {
    enhancer = applyMiddleware(...middleware);
  }

  const store = createStore(
    combineReducers({ ...reducers }),
    initialState,
    enhancer,
  );

  if ( isDebug && module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default()),
    );
  }

  sagaMiddleware.run(sagas);

  return store;
}
