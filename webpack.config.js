const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

// Load environment variables from .env file if it exists
try {
  require('dotenv').config({ path: path.resolve(__dirname, '.env') });
} catch (error) {
  console.log('No .env file found, using default values');
}

// Debug environment variables
console.log('🔧 Webpack Environment Variables Debug:');
console.log('REACT_APP_FIREBASE_API_KEY:', process.env.REACT_APP_FIREBASE_API_KEY ? 'SET' : 'NOT SET');
console.log('REACT_APP_FIREBASE_PROJECT_ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Current directory:', __dirname);


module.exports = {
  entry: './index.web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
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
    new webpack.DefinePlugin({
      'process.env': {
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
  },
};
