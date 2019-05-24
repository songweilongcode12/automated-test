import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';

export const createWiki = async ({storeID, key, value}) => {
  const variables = { storeID, data: { key, value}};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $data: WikiInput!){
        wikiCreate(storeID: $storeID, input: $data) {
          key
          value
        }
      }
    `,
    variables,
  }).then(({data}) => data.wikiCreate);
}

export const updateWiki = async ({storeID, key, value}) => {
  const variables = { storeID, data: { key, value}};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $data: WikiInput!){
        wikiUpdate(storeID: $storeID, input: $data) {
          key
          value
        }
      }
    `,
    variables,
  }).then(({data}) => data.wikiUpdate);
}

export const queryWiki= async ({storeID, key}) => {
  const variables = {storeID, key};
  return client.query({
    query: gql`
      query queryWiki($storeID: Int!, $key: String!){
        wiki(storeID: $storeID, key: $key) {
          key
          value
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => {
    let result = {key, value: null};

    if (data && data.wiki) {
      result = data.wiki;
    }

    return cloneDeep(result);
  });
}
