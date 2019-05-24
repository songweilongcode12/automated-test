import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
// import apolloLogger from 'apollo-link-logger';
// import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import introspectionQueryResultData from './fragmentTypes.json';
import { message as AntdMessage } from 'antd'
import urls from '../../constants/urls';

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData,
// });

const link = from([
  onError(({ response, operation, graphQLErrors, networkError }) => {
    if (response && operation && operation.operationName === 'queryWiki') {
      if (response) {
        response.errors = null;
        response.data = {};
      }
    } else if (response && operation && operation.operationName === 'queryModuels' ) {
      response.errors = null;
      response.data = {
        modules: [],
      };
    } else {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) => {
          AntdMessage.error(`Message: ${message}`, 6)

          if (process.env.NODE_ENV === 'development') {
            log.warn(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            )
          }
        });
      if (networkError) {
        log.warn(networkError);
      }
    }
  }),
  // ...(__DEV__ ? [apolloLogger] : []),
  new HttpLink({
    uri: urls.galaxy,
    credentials: 'include',
    headers: {
      'X-USER-ACCESS-TOKEN': localStorage.getItem('access_token'),
    },
  }),
]);

const cache = new InMemoryCache({
  addTypename: false,
  // fragmentMatcher,
});

export default new ApolloClient({
  link,
  cache,
});
