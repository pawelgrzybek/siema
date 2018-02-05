const path = require('path');
const webpack = require('webpack');

const PROD_ENV = process.argv.indexOf('--prod') !== -1;

module.exports = {
  entry: './src/siema.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'siema.min.js',
    library: 'Siema',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['babel-plugin-add-module-exports'],
        },
      },
    ]
  },
  plugins: PROD_ENV ? [
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
    }),
  ] : []
};
