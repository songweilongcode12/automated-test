import { gql } from 'apollo-boost';

const gqlQueryLogs = gql`
query($storeIDs: [Int!]!, $logType: ModuleBuilderStructType!, $search: SearchInput){
  mutationLogsOfStores(storeIDs: $storeIDs, logType: $logType, search: $search) {
    data{
      ID
      user{
        id
        displayName
        avatarURLSmall
        avatarURLMedium
        avatarURLThumb
      }
      storeID
      type
      typeID
      rawQuery
      funcName
      operation
      variables
      response
      createdAt
      updatedAt
    }
    pageInfo{
      totalPages
      current
    }
  }
}`;

export default gqlQueryLogs;
