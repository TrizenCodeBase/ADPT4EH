const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file
const isProduction = process.env.NODE_ENV === 'production';

try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
} catch (error) {
  console.log('No .env file found, using default values');
}

// Debug environment variables
console.log('🔧 Webpack Environment Variables Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_ENV:', process.env.REACT_APP_ENV);
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('Current directory:', __dirname);


module.exports = {
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: true, // Clean dist folder before each build
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-firebase/auth': path.resolve(__dirname, 'src/shims/rnfbauth.web.ts'),
      'react-native-maps': path.resolve(__dirname, 'src/shims/react-native-maps.web.ts'),
    },
    extensions: ['.web.js', '.js', '.ts', '.tsx'],
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer"),
      "path": require.resolve("path-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['module:@react-native/babel-preset'],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'static/media',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/sw.js', to: 'sw.js' },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        REACT_APP_ENV: JSON.stringify(process.env.REACT_APP_ENV || 'development'),
        REACT_APP_API_BASE_URL: JSON.stringify(process.env.REACT_APP_API_BASE_URL || 'https://extrahandbackend.llp.trizenventures.com/'),
        REACT_APP_FIREBASE_API_KEY: JSON.stringify(process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAFo3Su1b9CoW3BS-D-Cvoi9fuNrdHw0Yw'),
        REACT_APP_FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'extrahand-app.firebaseapp.com'),
        REACT_APP_FIREBASE_PROJECT_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_PROJECT_ID || 'extrahand-app'),
        REACT_APP_FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'extrahand-app.appspot.com'),
        REACT_APP_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '961487777082'),
        REACT_APP_FIREBASE_APP_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_APP_ID || '1:961487777082:web:dd95fe5a7658b0e3b1f403'),
        REACT_APP_FIREBASE_MEASUREMENT_ID: JSON.stringify(process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-GXB3LSMR5B'),
      },
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    hot: true,
    port: 8080,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
    },
    compress: true,
    open: false,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
    setupMiddlewares: (middlewares, devServer) => {
      // Add custom middleware for proper MIME types
      devServer.app.get('/sw.js', (req, res) => {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(path.join(__dirname, 'public/sw.js'));
      });
      
      devServer.app.get('/manifest.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.sendFile(path.join(__dirname, 'public/manifest.json'));
      });
      
      return middlewares;
    },
  },
};
