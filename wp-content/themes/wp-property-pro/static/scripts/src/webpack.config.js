const PROD = JSON.parse(process.env.NODE_ENV === 'production' || '0');
const AssetsPlugin = require('assets-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const path = require('path');
const webpack = require('webpack');

let plugins = [
  new AssetsPlugin({
    filename: 'assets.json',
    prettyPrint: true,
    update: true
  }),
  new WebpackCleanupPlugin({verbose: false}),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  // function() {
  //   this.plugin("done", function(stats) {
  //     require("fs").writeFileSync(
  //       path.join(__dirname, "hash.json"),
  //       JSON.stringify({hash: stats.hash}));
  //   });
  // }
];


if (PROD) {
  console.log('in production mode');
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    mangle: true
  }));
} else {
  console.log('NOT in production mode');
}

module.exports = {
    entry: './src/index.jsx',
    output: {
        path: path.join(__dirname, 'dist'),
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
    plugins: plugins,
    resolve: {
      fallback: [
        'node_modules'
      ],
      alias: {
        'swiper-css': path.join(__dirname, '/node_modules/swiper/dist/css/swiper.min.css'),
        'nprogress-css': path.join(__dirname, '/node_modules/nprogress/nprogress.css'),
      }
    },
    watchOptions : {
      poll: true
    }
};
