/*
 * @Author: Clloz
 * @Date: 2020-09-20 11:46:43
 * @LastEditTime: 2020-09-20 19:43:27
 * @LastEditors: Clloz
 * @Description:
 * @FilePath: /carousel/webpack.config.js
 * @博观而约取，厚积而薄发，日拱一卒，日进一寸。
 */
module.exports = {
    entry: './main.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement' }]],
                    },
                },
            },
        ],
    },
    mode: 'development',
};
