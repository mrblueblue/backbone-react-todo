var path = require('path');

var config = {

  devtool: 'eval',
  debug: true,
  watch: true,

  output: {
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

}

module.exports = config;
