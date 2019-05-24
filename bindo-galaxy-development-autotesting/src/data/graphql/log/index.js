import { cloneDeep } from 'lodash';
import { gql } from 'apollo-boost';
import client from '../client';
import gqlQueryLogs from './gqlQueryLogs';

export const queryLogs = async ({storeIDs, logType, search}) => {
  const variables = {storeIDs, logType, search: {orderAsc: 'DESC', ...search}};
  return client.query({
    query: gqlQueryLogs,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.mutationLogsOfStores));
};

export const exportLogs = async ({storeID, search, logType}) => {
  const variables = {storeID, search, logType};
  return client.query({
    query: gql`
    query($storeID: Int!, $logType: ModuleBuilderStructType!, $search: SearchInput){
      exportLogs(storeID: $storeID, logType: $logType, search: $search) {
       url
       code
       error
      }
    }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.exportLogs));
};

export default () => {};
