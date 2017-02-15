module.exports = {
    entry: './src/index.jsx',
    output: {
        path: './',
        filename: 'bundle.js'
    },
    module: {
        preLoaders: [
            { test: /\.json$/, loader: 'json'},
        ],
        loaders: [
            {
              test: /\.jsx$/,
              exclude: /node_modules/,
              loader: 'babel',
              query: { presets: ['es2015', 'react', 'stage-0'] }
            },
            {
              test: /\.(ico|png|jpg)(\?.*)?$/,
              exclude: /node_modules/,
              loader: "file?name=images/[name].[ext]"},
            {
              test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
              exclude: /node_modules/,
              loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    }
};
