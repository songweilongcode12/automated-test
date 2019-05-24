/**
 * Bindo Galaxy (https://galaxy.bindo.com/)
 *
 * Copyright © 2019-present Bindo Labs Limited. All rights reserved.
 */

module.exports = {
  presets: [
    'react-app',
  ],
  'plugins': [
    [
      'import',
      {
        'libraryName': 'antd',
        'libraryDirectory': 'es',
        'style': 'css',
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
}
