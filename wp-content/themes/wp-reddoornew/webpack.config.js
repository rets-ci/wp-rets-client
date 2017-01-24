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
                query: { presets: [ 'es2015', 'react' ] }
            }
        ]
    }
};
