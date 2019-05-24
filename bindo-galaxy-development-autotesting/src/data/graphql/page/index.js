/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';

export const queryRecords = async ({
  storeID,
  moduleID,
  search = {},
  associates = ['*'],
  headers = {},
}) => {
  const variables = {
    storeID,
    moduleID,
    associates,
    search: {
      page: 1,
      perPage: 100,
      includeTotal: true,
      orderAsc: 'DESC',
      ...search,
    },
  };

  return client.query({
    query: gql`
      query($storeID: Int!, $moduleID: UID!, $search: SearchInput, $associates: [String!]){
        modelRecords(storeID: $storeID, moduleID: $moduleID, search: $search, associates: $associates) {
          recordLists{
            id
            record
            moduleID
          }
          pageInfo{
            total
          }
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
    context: {
      headers: {
        ...headers,
      },
    },
  },
  ).then(({data}) => cloneDeep(data.modelRecords));
}
