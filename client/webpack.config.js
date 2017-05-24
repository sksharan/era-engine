const webpack = require('webpack');
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
        }),
        // Required for Bootstrap 4 which depends on jQuery and Tether globals
        new webpack.ProvidePlugin({
           $: 'jquery',
           jQuery: 'jquery',
           Tether: 'tether'
       })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                loaders: ['style-loader', 'css-loader'],
                test: /\.css$/
            }
        ]
    }
};
