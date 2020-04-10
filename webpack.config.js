const path = require('path');

module.exports = {
  entry: {
  	app : './src/index.js',
  	//audioManager : './src/audio-manager.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};