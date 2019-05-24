/**
 * Bindo Galaxy (https://galaxy.bindo.com/)
 *
 * Copyright © 2019-present Bindo Labs Limited. All rights reserved.
 */

module.exports = {
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    node: true,
    jasmine: true,
    jest: true,
    es6: true,
  },
  parser: 'babel-eslint',
  plugins: ['markdown', 'react', 'babel'],
  globals: {
    log: true,
  },
  rules: {
    indent: 'error',
    'react/jsx-filename-extension': ['error', { 'extensions': ['.js', '.jsx'] }],
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-indent': 'off',
    'react/jsx-boolean-value': 'off',
    'react/prop-types': 'off',
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': ['warn', 'single', 'avoid-escape'],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'eol-last': 'error',
    'no-multi-spaces': 'error',
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'no-trailing-spaces': 'error',
    'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    'comma-style': ['error', 'last'],
    'no-param-reassign': 'off',
    'no-useless-return': 'off',
    'consistent-return': 'off',
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'no-else-return': 'off',
    'no-nested-ternary': 'off',
    'no-plusplus': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'linebreak-style': [0 ,'error', 'windows'],
    'no-implied-eval': 2,
    'no-invalid-regexp': 2,
    'no-sparse-arrays': 2,
    'no-redeclare': 2,
  },
}
