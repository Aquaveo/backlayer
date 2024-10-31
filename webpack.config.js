var path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    'demo/sample': './src/demo/sample.js',
  },
  mode: 'production',  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // This will output 'demo/sample.js' in 'dist/demo/sample.js'
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