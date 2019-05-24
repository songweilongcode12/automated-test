import { gql } from 'apollo-boost'
import {
  cloneDeep,
  isObject,
} from 'lodash'
import menuModel from './menuModel'
import client from '../client'
import {
  handleAndCloneMenu,
} from '../../../utils/menu'

export const queryMenus = async ({storeID, appID}) => {
  const variables = {storeID, appID};
  return client.query({
    query: gql`
      query($storeID: Int!, $appID: UID!){
        menus(storeID: $storeID, appID: $appID) {
          data{
            ${menuModel}
          }
        }
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => {
    const menus = [];
    if (
      isObject(data)
      && isObject(data.menus)
      && Array.isArray(data.menus.data)
    ) {
      data.menus.data.forEach(menu => {
        const newMenu = handleAndCloneMenu({
          menu,
          storeID,
        });
        menus.push(newMenu);
      });
    }

    return menus;
  });
}

export const queryStoresMenus = async ({ storeIDs }) => {
  if (!Array.isArray(storeIDs) || storeIDs.length < 1) {
    return new Map();
  }

  let queryBody = '';
  storeIDs.forEach(storeID => {
    queryBody = `
      ${queryBody}
      store_${storeID}_menus:storeMenus(storeID: ${storeID}) {
        data{
          ${menuModel}
        }
      }
    `;
  });

  return client.query({
    query: gql`query{${queryBody}}`,
    fetchPolicy: 'network-only',
  }).then(({ data }) => {
    const storesMenusMap = new Map();

    storeIDs.forEach(storeID => {
      const menusData = data[`store_${storeID}_menus`];

      const appsMenusMap = new Map();
      if (menusData && Array.isArray(menusData.data) && menusData.data.length > 0) {
        menusData.data.forEach(menu => {
          const newMenu = handleAndCloneMenu({
            menu,
            storeID,
          });

          if (!Array.isArray(appsMenusMap.get(newMenu.appID))) {
            appsMenusMap.set(newMenu.appID, []);
          }

          appsMenusMap.get(newMenu.appID).push(newMenu);
        });
      }

      storesMenusMap.set(storeID, appsMenusMap);
    });
    return storesMenusMap;
  });
}

export const queryEmbeddedUrl = async ({storeID, menuID, params}) => {
  const variables = {storeID, menuID, params};
  return client.query({
    query: gql`
      query($storeID: Int!, $menuID: UID!, $params: Map){
        menuEmbedURL(storeID: $storeID, menuID: $menuID, parameter: $params)
      }
    `,
    variables,
    fetchPolicy: 'network-only',
  }).then(({data}) => cloneDeep(data.menuEmbedURL));
}

export const createMenu = async ({storeID, input}) => {
  const variables = {storeID, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $input: MenuInput!){
        appMenuCreate(storeID: $storeID, input: $input) {
          ${menuModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newMenu = handleAndCloneMenu({
      menu: data.appMenuCreate,
      storeID,
    });

    return newMenu;
  });
}

export const updateMenu = async ({storeID, id, input}) => {
  const variables = {storeID, id, input};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $id: UID!, $input: MenuInput!){
        appMenuUpdate(storeID: $storeID, id: $id input: $input) {
          ${menuModel}
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const newMenu = handleAndCloneMenu({
      menu: data.appMenuUpdate,
      storeID,
    });

    return newMenu;
  });
}

export const deleteMenu = async ({storeID, id}) => {
  const variables = {storeID, id};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $id: UID!){
        appMenuDelete(storeID: $storeID, id: $id) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const {
      success,
    } = data.appMenuDelete;

    return success;
  });
}

export const updateMenusPosition = async ({storeID, appID, positions}) => {
  const variables = {storeID, appID, positions};
  return client.mutate({
    mutation: gql`
      mutation($storeID: Int!, $appID: UID!, $positions: [AppMenuPositionInput!]!){
        appMenuUpdateMenuPositions(storeID: $storeID, appID: $appID, positions: $positions) {
          success
        }
      }
    `,
    variables,
  }).then(({data}) => {
    const {
      success,
    } = data.appMenuUpdateMenuPositions;

    return success;
  });
}
