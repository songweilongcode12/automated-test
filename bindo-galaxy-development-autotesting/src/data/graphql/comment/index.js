import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';
import commentModel from './commentModel';

export const queryComments = async ({storeIDs, commentType, relationID, search}) => {
  const variables = {storeIDs, commentType, relationID, search};
  return client.query({
    query: gql`
      query(
        $storeIDs: [Int!]!,
        $commentType: String!,
        $relationID: String!,
        $search: SearchInput
      ){
        commentsOfStores(
          storeIDs: $storeIDs,
          commentType: $commentType,
          relationID: $relationID,
          search: $search
        ) {
          data{
            ${commentModel}
          }
          pageInfo{
            totalPages
            current
          }
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.commentsOfStores));
}

export const createComment = async ({storeID, input}) => {
  const variables = {storeID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $input: commentInput!){
        commentCreate(storeID: $storeID, input: $input) {
          ${commentModel}
        }
      }
    `,
    variables,
  }).then(({data}) => data.commentCreate);
}
