var nodeExternals = require('webpack-node-externals');
var path = function(path) { return __dirname + '/' + path }

module.exports = {
    entry: path("src"),
    mode: 'development',
    externals: [nodeExternals()],
    output: {
        publicPath: 'dist',
        path: path("dist"),
    },
    resolve: {
        modules: [
            "node_modules",
            path("src"),
        ],
    }
};
