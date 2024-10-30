var path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    'control/index': './src/control/index.js',
    'layer/index': './src/layers/index.js',
    'overlay/index': './src/overlays/index.js',
    Map: './src/Map.js',
    View: './src/View.js',
    // 'demo/sample': './src/demo/sample.js',
    'hooks/useMapContext': './src/hooks/useMapContext.js',
  },
  mode: 'production',  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Output each entry as a separate file
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
        {
            test: /\.(js|jsx)$/, // Matches .js and .jsx files
            exclude: /node_modules/,
            use: 'babel-loader', // Simplified loader syntax
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'], // Loaders for CSS files
          },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  externals: {
    'react': 'commonjs react',
    'react-dom': 'commonjs react-dom',
    'styled-components': 'commonjs styled-components',
    'ol': 'commonjs ol', // OpenLayers as external
    'react-icons': 'commonjs react-icons',
  }
};