const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './main/source/main.js',
    output: {
        filename: './main/public/bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'main/public/index.html',
            template: 'main/template/index.html.template'
        })
    ]
};
