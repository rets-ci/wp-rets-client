// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const PROD = JSON.parse(process.env.NODE_ENV === 'production' || '0');
const path = require('path');
const webpack = require('webpack');

const fs = require('fs');

let reactPackageJSON;
let reactMainLocation;
try {
  reactPackageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '/node_modules/react/package.json')));
  reactMainLocation = reactPackageJSON.main
} catch (err) {
  console.log('couldnt load react\'s package.json');
}

let plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname
    }
  }),
  // new BundleAnalyzerPlugin({
  //   analyzerMode: 'server'
  // })
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
        publicPath: '/wp-content/themes/wp-property-pro/static/scripts/src/dist/',
        chunkFilename: '[name].bundle.js',
        filename: 'bundle.js'
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader:  "style-loader"
              },
              {
                loader: 'css-loader'
              }
            ]
          },
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'react', 'stage-0']
              }
            }
          },
          {
            test: /\.(ico|png|jpg)(\?.*)?$/,
            exclude: /node_modules/,
            loader: "file?name=images/[name].[ext]"
          },
          {
            test: /\.svg$/,
            use: {
              loader: 'svg-react-loader'
            }
          }
        ]
    },
    plugins: plugins,
    resolve: {
      alias: {
        // this is so we can work with svg-react-loader after webpack upgrade
        'react$': path.join(__dirname, `/node_modules/react/${reactMainLocation}`),
        'slick-css': path.join(__dirname, '/node_modules/slick-carousel/slick/slick.css'),
        'swiper-css': path.join(__dirname, '/node_modules/swiper/dist/css/swiper.min.css'),
        'nprogress-css': path.join(__dirname, '/node_modules/nprogress/nprogress.css'),
      },
      extensions: ['.js','.jsx'],
      modules: [
        'node_modules'
      ]
    },
    // devtool: !PROD ? 'source-map' : false,
    watchOptions : {
      poll: true
    }
};
