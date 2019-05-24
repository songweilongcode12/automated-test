import { gql } from 'apollo-boost'
import { cloneDeep, isObject } from 'lodash'
import client from '../client'
import moduleModel from './moduleModel'
import moduleField from './moduleField'
import gqlQueryFields from './gqlQueryFields'
import {
  handleAndCloneModule,
} from '../../../utils/module'

export const createModule = async ({storeID, input}) => {
  const variables = {storeID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $input: ModuleBuilderModuleInput!){
        moduleCreate(storeID: $storeID, input: $input) {
          ${moduleModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newModule = handleAndCloneModule({
      storeID,
      module: data.moduleCreate,
    })

    return newModule;
  });
};

export const updateModule = async ({storeID, id, input}) => {
  // 修复并初始化功能按钮
  // input.template.funcBtns = getInitFuncBtns();
  const variables = {storeID, id, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $id: UID!, $input: ModuleBuilderModuleInput!){
        moduleUpdate(storeID: $storeID, id: $id, input: $input) {
          ${moduleModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newModule = handleAndCloneModule({
      storeID,
      module: data.moduleUpdate,
    })

    return newModule;
  });
}

export const searchStoresModules = async ({ storeIDs, search }) => {
  const variables = {storeIDs, search};
  return client.query({
    query: gql`
      query($storeIDs: [Int!]!, $search: SearchInput){
        modulesOfStores(storeIDs: $storeIDs, search: $search) {
          data{
            ${moduleModel}
          }
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => {
    let modules = [];
    if (
      isObject(data)
      && isObject(data.modulesOfStores)
      && Array.isArray(data.modulesOfStores.data)
    ) {
      modules = cloneDeep(data.modulesOfStores.data);
    }

    return modules;
  });
}

export const queryStoresModules = async ({ storeIDs }) => {
  if (!Array.isArray(storeIDs) || storeIDs.length < 1) {
    return new Map();
  }

  let queryBody = '';
  storeIDs.forEach(storeID => {
    queryBody = `
      ${queryBody}
      store_${storeID}_modules:modules(storeID: ${storeID}) {
        ${moduleModel}
      }
    `;
  });

  return client.query({
    query: gql`query queryModuels{${queryBody}}`,
    fetchPolicy: 'network-only',
  }).then(({ data }) => {
    const storesModulesMap = new Map();

    storeIDs.forEach(storeID => {
      const modulesData = data[`store_${storeID}_modules`];
      const appsModulesMap = new Map();
      if (Array.isArray(modulesData) && modulesData.length > 0) {
        modulesData.forEach(item => {
          const newModule = handleAndCloneModule({
            storeID,
            module: item,
          })
          if (!appsModulesMap.get(newModule.appID)) {
            appsModulesMap.set(newModule.appID, new Map());
          }

          appsModulesMap.get(newModule.appID).set(newModule.id, newModule);
        });
      }

      storesModulesMap.set(storeID, appsModulesMap);
    });

    return storesModulesMap;
  });
}

export const queryTables = async ({storeID}) => {
  const variables = { storeID };
  return client.query({
    query: gql`
      query($storeID: Int!){
        moduleTableLists(storeID: $storeID) {
          database
          name
          author
          status
          storeCount
          customModel
          createdAt
          updatedAt
          attributeCountCore
          attributeCountCustom
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.moduleTableLists));
}

export const saveModuleFields = async ({storeID, moduleID, input}) => {
  const variables = {storeID, moduleID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $moduleID: UID!, $input: [ModuleFieldInput!]!){
        moduleFieldSave(storeID: $storeID, moduleID: $moduleID, input: $input) {
          ${moduleField}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const tempFields = cloneDeep(data.moduleFieldSave);
    if (Array.isArray(tempFields)) {
      tempFields.forEach(item => {
        item.inStoreID = item.storeID
      })
    }
    return tempFields
  });
}

export const queryFields = async ({storeID, tableInfo}) => {
  const variables = {storeID, tableInfo};
  return client.query({
    query: gqlQueryFields,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.modelAttributeLists));
}
