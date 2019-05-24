/* eslint-disable */
let bindoCom = 'https://trybindo.com';
let mainBindoIO = 'https://dev-main.bindo.io';
// let bindoIOBaseUrl = 'https://dev-cn-main.bindo.io/api/v5';

/**
 * 1. alpha/production client_id 和client_secret相同
 * 2. stg环境是一套
 * 3. 未来会添加uat环境
 */
// alpha/production 环境client_id 和client_secret配置
let client_id = 'dc2zhqpvisyqct1f36nolapx5i1z8e8';
let client_secret = 'ttvp5vzgty6qevi55qmfu7fqsgtfhax';

if (process.env.NODE_ENV === 'alpha') {
  bindoCom = 'https://alpha.bindo.com';
  mainBindoIO = 'https://alpha-main.bindo.io';
} else if (process.env.NODE_ENV === 'production') {
  bindoCom = 'https://bindo.com';
  mainBindoIO = 'https://main.bindo.io';
} else {
  // stg环境client_id 和client_secret配置
  client_id = '1clvjqb9fmv5bkjoq2akbc1h4';
  client_secret = '1tfcglxmnjv4t263dji05wmjr';
}

const v2 = 'api/v2';
const v5 = 'api/v5';
const v4 = 'api/v4';

export default {
  galaxy: `${mainBindoIO}/${v5}/graphql/galaxy2`,
  login: `${bindoCom}/${v2}/login`,
  reset_password: `${bindoCom}/${v2}/reset_password`,
  forgot_password: `${bindoCom}/${v2}/forgot_password`,
  stores: `${bindoCom}/${v2}/stores`,
  store: `${mainBindoIO}/${v4}/public/stores/{storeID}`,
  currentUser: `${bindoCom}/${v2}/user/me`,
  associates: `${bindoCom}/${v2}/stores/{storeID}/associates`,
  uploadUrlByModuleID: `${mainBindoIO}/${v5}/graphql/models/{moduleID}/upload`,
  uploadUrlByAppID: `${mainBindoIO}/${v5}/graphql/apps/{appID}/upload`,
  client_id,
  client_secret,
  initGeetestUrl: `${mainBindoIO}/${v5}/public/store_slugs/{slug}/human_verify/init`,
};

/* eslint-enable */
