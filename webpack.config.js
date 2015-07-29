var path = require('path');

var config = {

  devtool: 'eval',
  debug: true,
  watch: true,

  output: {
    filename: 'bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loaders: ['babel?stage=0&optional[]=runtime&loose=all&cacheDirectory']
      },
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

}

module.exports = config;
