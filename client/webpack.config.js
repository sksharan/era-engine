const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: './dist/bundle.js',
  },
  watch: true,
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'dist/index.html',
      template: 'src/index.html',
    }),
  ],
  // Make webpack aware of tsx and ts files (and include the default js as well), otherwise
  // the app will crash with module not found errors: https://stackoverflow.com/a/43596713
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
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
        use: [
          {
            // inject CSS to page
            loader: 'style-loader',
          },
          {
            // translates CSS into CommonJS modules
            loader: 'css-loader',
          },
          {
            // Run postcss actions
            loader: 'postcss-loader',
            options: {
              // `postcssOptions` is needed for postcss 8.x;
              // if you use postcss 7.x skip the key
              postcssOptions: {
                // postcss plugins, can be exported to postcss.config.js
                plugins: function () {
                  return [require('autoprefixer')];
                },
              },
            },
          },
          {
            // compiles Sass to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: {
      index: '/dist/',
    },
  },
};
