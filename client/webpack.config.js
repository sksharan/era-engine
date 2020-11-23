const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './main/index.js',
    output: {
        filename: './dist/bundle.js'
    },
    watch: true,
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'dist/index.html',
            template: 'main/index.html'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(js|tsx?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            // https://v5.getbootstrap.com/docs/5.0/getting-started/webpack/#importing-precompiled-sass
            {
                test: /\.(scss)$/,
                use: [{
                    // inject CSS to page
                    loader: 'style-loader'
                }, {
                    // translates CSS into CommonJS modules
                    loader: 'css-loader'
                }, {
                    // Run postcss actions
                    loader: 'postcss-loader',
                    options: {
                        // `postcssOptions` is needed for postcss 8.x;
                        // if you use postcss 7.x skip the key
                        postcssOptions: {
                            // postcss plugins, can be exported to postcss.config.js
                            plugins: function () {
                                return [
                                    require('autoprefixer')
                                ];
                            }
                        }
                    }
                }, {
                    // compiles Sass to CSS
                    loader: 'sass-loader'
                }]
              }
        ]
    },
    devServer: {
        historyApiFallback: {
            index: '/dist/'
        }
    }
};
