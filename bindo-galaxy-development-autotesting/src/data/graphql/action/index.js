import { gql } from 'apollo-boost';
import { cloneDeep } from 'lodash';
import client from '../client';
import scriptsModel from './scriptsModel';

export const queryScriptRecords = async ({
  storeID,
  moduleID,
  search,
}) => {
  const variables = {storeID, moduleID, search}
  return client.query({
    query: gql`
    query($storeID: Int!, $moduleID: UID!, $search: SearchInput){
      scriptsByModuleID(storeID: $storeID, moduleID: $moduleID, search: $search) {
        data{
          ${scriptsModel}
        }
        pageInfo{
          total
        }
      }
    }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.scriptsByModuleID));
}

export const queryScript = async ({
  storeID,
  scriptID,
}) => {
  const variables = {storeID, scriptID}
  return client.query({
    query: gql`
    query($storeID: Int!, $scriptID: UID!){
      scriptsByID(storeID: $storeID, scriptID: $scriptID) {
        id
        refID
        appID
        moduleID
        actionType
        actionName
        triggerCondition
        actionToDo
        cronSchedule
        content
        enabled
        templateID
        buttonType
      }
    }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.scriptsByID));
}

export const createScript = async ({
  storeID,
  input,
}) => {
  const variables = {storeID, input}
  return client.mutate({
    mutation: gql`
    mutation($storeID: Int!, $input: ScriptInput!){
      scriptCreate(storeID: $storeID, input: $input) {
        id
        scriptID
      }
    }
    `,
    variables,
  }).then(({data}) => data.scriptCreate)
}

export const updateScript = async ({
  storeID,
  id,
  input,
}) => {
  const variables = {storeID, id, input}
  return client.mutate({
    mutation: gql`
    mutation($storeID: Int!, $id: UID!,$input: ScriptInput!){
      scriptUpdate(storeID: $storeID, id: $id,input: $input) {
        id
      }
    }
    `,
    variables,
  }).then(({data}) => data.scriptUpdate)
}

export const deleteScript = async ({
  storeID,
  scriptID,
}) => {
  const variables = {storeID, scriptID}
  return client.mutate({
    mutation: gql`
    mutation($storeID: Int!, $scriptID: UID!){
      scriptDelete(storeID: $storeID, scriptID: $scriptID) {
        success
      }
    }
    `,
    variables,
  }).then(({data}) => data.scriptDelete)
}

export const executeScript = async ({
  storeID,
  input,
}) => {
  const variables = {storeID, input}
  return client.mutate({
    mutation: gql`
    mutation($storeID: Int!, $input: CustomEventInput!){
      customEvent(storeID: $storeID, input: $input) {
        code
        message
        result
      }
    }
    `,
    variables,
  }).then(({data}) => data.customEvent)
}
