import { gql } from 'apollo-boost';

const gqlQueryFields = gql`
query($storeID: Int!, $tableInfo: TableInfoInput!){
  modelAttributeLists(storeID: $storeID, tableInfo: $tableInfo) {
    database
    name
    author
    status
    storeCount
    label
    tableName
    type
    createdAt
    updatedAt
  }
}`;

export default gqlQueryFields;
