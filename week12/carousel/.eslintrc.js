/*
 * @Author: Clloz
 * @Date: 2020-09-20 11:47:59
 * @LastEditTime: 2020-09-20 12:06:53
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /jsx/.eslintrc.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
module.exports = {
    env: {
        browser: true,
        es2020: true,
        node: true,
    },
    extends: ['eslint:recommended', 'prettier'],
    // parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 11,
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: 'module',
        allowImportExportEverywhere: true,
    },
    plugins: ['prettier', 'html'],
    rules: {
        'prettier/prettier': [
            'warn',
            {
                semi: true,
                singleQuote: true,
                tabWidth: 4,
                trailingComma: 'all',
                arrowParens: 'avoid',
            },
        ],
    },
};
