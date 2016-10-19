const path = require('path');

const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
const IS_DEVELOPMENT = !IS_PRODUCTION;
const APP_PATH = path.join(__dirname, 'app');
const CLIENT_PATH = path.join(__dirname, 'app', 'client');
const PUBLIC_PATH = path.join(__dirname, 'app', 'public');

const BASE_TEST = /\.jsx?$/;
const BASE_EXCLUDE = /(node_modules|bower_components|public)/;

const babel = {
  test: BASE_TEST,
  exclude: BASE_EXCLUDE,
  loader: 'babel-loader',
};

const eslint = {
  test: BASE_TEST,
  exclude: BASE_EXCLUDE,
  loader: 'eslint-loader',
  cache: true,
  failOnError: false,
  failOnWarning: false,
};

module.exports = {
  entry: CLIENT_PATH,
  output: {
    path: PUBLIC_PATH,
    filename: 'webpack.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  externals: [
    'react',
    'react-dom',
    'immutable',
    'chartist',
    'redux',
    'react-redux',
    'reselect',
    'normalizr',
  ],
  debug: IS_DEVELOPMENT,
  profile: IS_DEVELOPMENT,
  cache: IS_DEVELOPMENT,
  watch: IS_DEVELOPMENT,
  devtool: 'cheap-module-eval-source-map',
  module: {
    loaders: [
      babel,
      eslint,
    ],
  },
};
