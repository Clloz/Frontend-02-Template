/*
 * @Author: Clloz
 * @Date: 2020-09-27 14:44:44
 * @LastEditTime: 2020-09-27 19:36:38
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /animation/webpack.config.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
module.exports = {
    entry: './main.js',
    // contentBase: './',
    module: {
        rules: [
            {
                test: /.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        // plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]],
                    },
                },
            },
        ],
    },
    mode: 'development',
};
