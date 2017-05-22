const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './main/source/entry.jsx',
    output: {
        filename: './main/public/bundle.js'
    },
    watch: true,
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'main/public/index.html',
            template: 'main/template/index.html.template'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        }]
    }
};
