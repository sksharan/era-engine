const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    filename: "styles.css",
    disable: process.env.NODE_ENV !== "production"
});

module.exports = {
    entry: './main/source/index.js',
    output: {
        filename: './main/public/bundle.js'
    },
    watch: true,
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'main/public/index.html',
            template: 'main/template/index.html.template'
        }),
        extractSass
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
                // https://github.com/webpack-contrib/sass-loader
                // https://getbootstrap.com/docs/4.0/getting-started/webpack/
                loader: extractSass.extract({
                    use: [
                        {
                            loader: 'css-loader', // translates CSS into CommonJS modules
                            options: {
                                localIdentName: '[name]-[local]___[hash:base64:5]'
                            }
                        },
                        {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                                plugins: function () { // post css plugins, can be exported to postcss.config.js
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader' // compiles SASS to CSS
                        }
                    ],
                    // Use style-loader in development
                    fallback: 'style-loader', // inject CSS to page
                }),
                test: /\.(scss)$/
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
