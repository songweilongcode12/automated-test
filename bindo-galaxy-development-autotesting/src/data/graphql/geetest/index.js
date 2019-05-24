/* eslint-disable import/prefer-default-export */
import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';

export const queryGeetestRecords = async ({storeID, moduleID, search = {}, associates = [], header = {}}) => {
  const variables = {storeID, moduleID, search: { orderAsc: 'DESC', ...search}, associates};
  const options = {
    options: {
      context: {
        headers: {
          ...header,
        },
      },
    },
  }

  console.info(options)
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
        ...header,
      },
    },
  },
  ).then(({data}) => cloneDeep(data.modelRecords));
}
