import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';

export const createCondition = async ({storeID, moduleID, input}) => {
  const variables = {storeID, moduleID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $input: StarSearchConditonInput!){
        starSearchConditionCreate(storeID: $storeID, moduleID: $moduleID, input: $input) {
          id
          uuid
          name
          condition
        }
      }
    `,
    variables,
  }).then(({data}) => data.starSearchConditionCreate);
}

export const queryConditions = async ({storeID, moduleID}) => {
  const variables = {storeID, moduleID};
  return client.query({
    query: gql`
      query($storeID: Int!, $moduleID: UID!){
        starSearchConditions(storeID: $storeID, moduleID: $moduleID) {
          id
          uuid
          name
          condition
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.starSearchConditions));
}

export const deleteCondition = async ({storeID, moduleID, id}) => {
  const variables = {storeID, moduleID, id};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $id: UID!){
        starSearchConditionDelete(storeID: $storeID, moduleID: $moduleID, id: $id) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => data.starSearchConditionDelete);
}
