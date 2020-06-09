const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const e2eThemeDir = 'tests/e2e/fixtures/theme';

module.exports = {
    entry: `./${e2eThemeDir}/scripts/index.js`,
    output: {
        path: path.resolve(__dirname, e2eThemeDir, 'assets'),
        filename: 'index.js',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
        ],
    },
    plugins: [new VueLoaderPlugin()],
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js',
        },
        extensions: ['*', '.js', '.json', '.vue'],
    },
};
