const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');

const compiler = webpack(config);
const devServerOptions = {
  static: {
    directory: require('path').join(__dirname, 'dist'),
  },
  hot: true,
  port: 3000,
  open: true,
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

const server = new WebpackDevServer(devServerOptions, compiler);

server.startCallback(() => {
  console.log('🚀 Development server running at http://localhost:3000');
});
