import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';
import gqlQueryRecord from './gqlQueryRecord';
import moduleRecordImportCreateModel from './moduleRecordImportCreateModel';
import moduleRecordImportCheckModel from './moduleRecordImportCheckModel';

export const createRecord = async ({storeID, moduleID, input}) => {
  const variables = {storeID, moduleID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $input: CreateModelRecordInput!){
        modelRecordCreate(storeID: $storeID, moduleID: $moduleID, input: $input) {
          id
          record
          moduleID
        }
      }
    `,
    variables,
  }).then(({data}) => data.modelRecordCreate);
}

export const updateRecord = async ({storeID, moduleID, input}) => {
  const variables = {storeID, moduleID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $input: UpdateModelRecordInput!){
        modelRecordUpdate(storeID: $storeID, moduleID: $moduleID, input: $input) {
          id
          record
          moduleID
        }
      }
    `,
    variables,
  }).then(({data}) => data.modelRecordUpdate);
}

export const queryRecords = async ({storeID, moduleID, search = {}, associates = []}) => {
  const variables = {storeID, moduleID, search: { orderAsc: 'DESC', ...search}, associates};
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
  }).then(({data}) => cloneDeep(data.modelRecords));
}

export const queryRelationRecords = async ({ storeID, moduleID, recordID, fieldName, search = {} }) => {
  const variables = { storeID, moduleID, recordID, fieldName, search: { orderAsc: 'DESC', ...search} };
  return client.query({
    query: gql`query($storeID: Int!, $moduleID: UID!, $recordID: UID!, $fieldName: String!, $search: SearchInput){
      modelRelationRecords(storeID: $storeID, moduleID: $moduleID, recordID: $recordID, fieldName: $fieldName, search: $search) {
        recordLists{
          id
          record
          moduleID
        }
      }
    }`,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => {
    const { modelRelationRecords = {} } = data;
    const result = { records: [] }
    if (modelRelationRecords.recordLists) {
      result.records = modelRelationRecords.recordLists || [];
      result.pageInfo = modelRelationRecords.pageInfo;
    }

    return cloneDeep(result);
  });
}

export const deleteRecord = async ({storeID, moduleID, recordID}) => {
  const variables = {storeID, moduleID, recordID};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $recordID: UID!){
        modelRecordDelete(storeID: $storeID, moduleID: $moduleID, recordID: $recordID) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => data.modelRecordDelete);
}

export const queryRecord = async ({
  storeID,
  moduleID,
  recordID,
  associates = [],
}) => client.query({
  query: gqlQueryRecord,
  variables: { storeID, moduleID, recordID, associates },
  fetchPolicy: 'network-only',
}).then(({ data }) => {
  const { modelRecord = {} } = data;
  const result = modelRecord || {};

  return cloneDeep(result);
});

export const moduleRecordImportCreate = async ({ storeID, moduleID, importUrl}) => {
  const variables = { storeID, moduleID, importUrl};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID! $importUrl: String!){
        moduleRecordImportCreate(storeID: $storeID, moduleID: $moduleID, importUrl: $importUrl) {
          ${moduleRecordImportCreateModel}
        }
      }
    `,
    variables,
  }).then(({ data }) => cloneDeep(data.moduleRecordImportCreate));
}

export const moduleRecordImportCheck = async ({ storeID, moduleID, importID}) => {
  const variables = { storeID, moduleID, importID};
  return client.query({
    query: gql`
      query($storeID: Int!, $moduleID: UID!, $importID: UID!){
        moduleRecordImportCheck(storeID: $storeID, moduleID: $moduleID, importID: $importID) {
          ${moduleRecordImportCheckModel}
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({ data }) => cloneDeep(data.moduleRecordImportCheck));
}

export const moduleRecordImportTemplate = async ({ storeID, moduleID}) => {
  const variables = { storeID, moduleID};
  return client.query({
    query: gql`
      query($storeID: Int!, $moduleID: UID!){
        moduleRecordImportTemplate(storeID: $storeID, moduleID: $moduleID) {
          template
        }
      }
    `,
    variables,
  }).then(({ data }) => cloneDeep(data.moduleRecordImportTemplate));
}

export const exportModuleRecord = async ({storeID, moduleID, search = {}, fieldSort = []}) => {
  const variables = {storeID, moduleID, search, fieldSort};
  return client.query({
    query: gql`
      query($storeID: Int!, $moduleID: UID!, $search: SearchInput, $fieldSort: [String!]){
        exportModuleRecord(storeID: $storeID, moduleID: $moduleID, search: $search, fieldSort: $fieldSort){
         url,
         code,
         error,
        },
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({ data }) => cloneDeep(data.exportModuleRecord));
}

export const modelRecordMarkAsGlobal = async ({storeID, moduleID, recordID}) => {
  const variables = {storeID, moduleID, recordID};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $recordID: UID!){
        modelRecordMarkAsGlobal(storeID: $storeID, moduleID: $moduleID, recordID: $recordID){
         success,
        },
      }
    `,
    variables,
  }).then(({ data }) => cloneDeep(data.modelRecordMarkAsGlobal));
}

export const modelRecordUnmarkAsGlobal = async ({storeID, moduleID, recordID}) => {
  const variables = {storeID, moduleID, recordID};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $recordID: UID!){
        modelRecordUnmarkAsGlobal(storeID: $storeID, moduleID: $moduleID, recordID: $recordID){
         success,
        },
      }
    `,
    variables,
  }).then(({ data }) => cloneDeep(data.modelRecordUnmarkAsGlobal));
}
