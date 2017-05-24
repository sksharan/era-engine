const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        new ExtractTextPlugin('styles.css'),
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
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use:  [
                        {
                            loader: 'css-loader',
                            options: {
                                localIdentName: '[name]-[local]___[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                }),
                test: /\.(css|scss)$/
            }
        ]
    }
};
