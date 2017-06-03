const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: process.env.NODE_ENV !== "production"
});

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
        extractSass,
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
                enforce: 'pre',
                loader: 'eslint-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/
            },
            {
                loader: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                loader: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                localIdentName: '[name]-[local]___[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ],
                    // Use style-loader in development
                    fallback: 'style-loader',
                }),
                test: /\.(css|scss)$/
            }
        ]
    },
    externals: {
        // For Enzyme with React 15: http://airbnb.io/enzyme/docs/guides/webpack.html
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
    }
};
