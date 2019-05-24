import { gql } from 'apollo-boost';

const gqlQueryRecord = gql`
query($storeID: Int!, $moduleID: UID!, $recordID: UID!, $associates: [String!]){
  modelRecord(storeID: $storeID, moduleID: $moduleID, id: $recordID, associates: $associates) {
    id
    record
    moduleID
  }
}`;

export default gqlQueryRecord;
