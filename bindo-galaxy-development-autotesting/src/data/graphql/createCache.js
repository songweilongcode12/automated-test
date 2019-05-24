import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import introspectionQueryResultData from './fragmentTypes.json';

// function dataIdFromObject(obj) {
//   // eslint-disable-next-line no-underscore-dangle
//   switch (obj.__typename) {
//     case 'NewsItem':
//       return obj.link ? `fieldRelation:${obj.link}` : defaultDataIdFromObject(obj);
//     default:
//       return defaultDataIdFromObject(obj);
//   }
// }

export default function createCache() {
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
  });
  // https://www.apollographql.com/docs/react/basics/caching.html#configuration
  return new InMemoryCache({
    addTypename: false,
    fragmentMatcher,
  });
}
