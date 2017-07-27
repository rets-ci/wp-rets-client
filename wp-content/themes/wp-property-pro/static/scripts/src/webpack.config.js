
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.jsx',
  output: {
      path: path.resolve(__dirname, './'),
      filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015', 'react', 'stage-0'] },
        }]
      },
      {
        test: /\.(ico|png|jpg)(\?.*)?$/,
        exclude: [/node_modules/],
        use: ['file-loader?name=images/[name].[ext]']
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        use: 'svg-react-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'swiper-css': path.join(__dirname, '/node_modules/swiper/dist/css/swiper.min.css'),
      'nprogress-css': path.join(__dirname, '/node_modules/nprogress/nprogress.css'),
    },
    modules: ['node_modules']
  }
};
