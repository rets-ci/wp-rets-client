
const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: './',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
          {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: { presets: ['es2015', 'react', 'stage-0'] }
          },
          {
            test: /\.json$/, loader: 'json'
          },
          {
            test: /\.(ico|png|jpg)(\?.*)?$/,
            exclude: /node_modules/,
            loader: "file?name=images/[name].[ext]"
          },
          {
            test: /\.svg$/,
            exclude: /node_modules/,
            loader: 'svg-react'
          }
        ]
    },
    resolve: {
      fallback: [
        'node_modules'
      ],
      alias: {
        'swiper-css': path.join(__dirname, '/node_modules/swiper/dist/css/swiper.min.css')
      }
    }
};
