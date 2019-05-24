import { gql } from 'apollo-boost'
import { cloneDeep } from 'lodash'
import client from '../client'
import appModel from './appModel'
import permissionModel from './permissions'
import common from '../../../constants/common'
import {
  handleAndCloneApp,
} from '../../../utils/app'

const sortApps = apps => apps.sort((app1, app2) => {
  if (app1.position < app2.position) {
    return -1;
  } else if (app1.position > app2.position) {
    return 1;
  } else {
    return 0;
  }
});

export const queryStoresApps = async ({ storeIDs }) => {
  if (!Array.isArray(storeIDs) || storeIDs.length < 1) {
    return new Map();
  }

  let queryBody = '';
  storeIDs.forEach(storeID => {
    queryBody = `
      ${queryBody}
      store_${storeID}_apps:moduleBuilderApps(storeID: ${storeID}) {
        data{
          ${appModel}
        }
      }
    `;
  });

  return client.query({
    query: gql`query{${queryBody}}`,
    fetchPolicy: 'network-only',
  }).then(({ data }) => {
    const storesAppsMap = new Map();

    storeIDs.forEach(storeID => {
      const appsData = data[`store_${storeID}_apps`];

      const appsMap = new Map();
      if (appsData && Array.isArray(appsData.data) && appsData.data.length > 0) {
        let apps = appsData.data;
        apps = sortApps(apps);
        apps.forEach(app => {
          appsMap.set(app.id, handleAndCloneApp({
            app,
            storeID,
          }));
        });
      }

      storesAppsMap.set(storeID, appsMap);
    });
    return storesAppsMap;
  });
}

export const queryStoresPermissions = async ({ storeIDs }) => {
  let queryBody = '';
  storeIDs.forEach(storeID => {
    queryBody = `
      ${queryBody}
      store_${storeID}_permissions:permissions(storeID: ${storeID}) {
        ${permissionModel}
      }
    `;
  });

  return client.query({
    query: gql`query{${queryBody}}`,
    fetchPolicy: 'network-only',
  }).then(({ data }) => {
    const storesPermissionsMap = new Map();

    storeIDs.forEach(storeID => {
      const permissionsData = data[`store_${storeID}_permissions`];
      const appsPermissionsMap = new Map();
      if (Array.isArray(permissionsData) && permissionsData.length > 0) {
        permissionsData.forEach(permission => {
          if (!appsPermissionsMap.get(permission.appID)) {
            appsPermissionsMap.set(permission.appID, new Map());
          }

          let destIDKey = 'moduleID';
          if (permission.type === common.EMBEDDED || permission.type === common.WIKI_ONLY) {
            destIDKey = 'menuID';
          }

          if (permission[destIDKey]) {
            if (!Array.isArray(appsPermissionsMap.get(permission.appID).get(permission[destIDKey]))) {
              appsPermissionsMap.get(permission.appID).set(permission[destIDKey], []);
            }

            appsPermissionsMap.get(permission.appID).get(permission[destIDKey]).push(permission)
          }
        });
      }

      storesPermissionsMap.set(storeID, appsPermissionsMap);
    });
    return storesPermissionsMap;
  });
};

export const createApp = async ({storeID, app}) => {
  const variables = {storeID, app};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $app: moduleBuilderAppEntityInput!){
        moduleBuilderAppCreate(storeID: $storeID, app: $app) {
          ${appModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newApp = handleAndCloneApp({
      app: data.moduleBuilderAppCreate,
      storeID,
    });

    return newApp;
  });
}

export const updateApp = async ({storeID, id, app}) => {
  const variables = {storeID, id, app};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $id: UID!, $app: moduleBuilderAppEntityInput!){
        moduleBuilderAppUpdate(storeID: $storeID, id: $id, app: $app) {
          ${appModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newApp = handleAndCloneApp({
      app: data.moduleBuilderAppUpdate,
      storeID,
    });

    return newApp;
  });
}

export const updateApps = async (apps) => {
  let mutateBody = '';

  apps.forEach(app => {
    const { storeID, id, icon, iconType, name, type, i18n } = app;

    const i18nBody = ['{'];
    Object.keys(i18n).forEach(key => {
      const i18nData = i18n[key] || {};
      i18nBody.push(`${key}:{`);
      Object.keys(i18nData).forEach(localKey => {
        const local = i18nData[localKey];
        if (local) {
          i18nBody.push(`${localKey}:"${local}",`)
        }
      });
      i18nBody.push('},');
    });
    i18nBody.push('}');

    mutateBody = `
      ${mutateBody}
      app_${id}:moduleBuilderAppUpdate(storeID: ${storeID}, id: ${id}, app: {
        name: "${name}",
        type: "${type}",
        icon: "${icon}",
        iconType: "${iconType}",
        i18n: ${i18nBody.join('')},
      }) {
        id
      }
    `;
  });

  return client.mutate({
    mutation: gql`
      mutation{
        ${mutateBody}
      }
    `,
  }).then(() => ({
    success: true,
  }));
}

export const deleteApp = async ({storeID, id}) => {
  const variables = {storeID, id};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $id: UID!){
        moduleBuilderAppDelete(storeID: $storeID, id: $id) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const {
      success,
    } = data.moduleBuilderAppDelete;

    return success;
  });
}

export const updateAppPositions = async ({storeID, positions}) => {
  const variables = {storeID, positions};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $positions: [positionInput!]!){
        moduleBuilderUpdateAppPositions(storeID: $storeID, positions: $positions) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const {
      success,
    } = data.moduleBuilderUpdateAppPositions;

    return success;
  });
}

export const permissionBatchUpdate = async ({ storeID, input }) => {
  const variables = { storeID, input };
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $input: [PermissionInput!]!){
        permissionBatchUpdate(storeID: $storeID, input: $input) {
          ${permissionModel}
        }
      }
    `,
    variables,
  }).then(({ data }) => cloneDeep(data.permissionBatchUpdate));
}
