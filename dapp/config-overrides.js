const {ProvidePlugin} = require('webpack');

module.exports = function (config, env) {
    config.module.rules.unshift({
        test: /\.m?js$/,
        resolve: {
            fullySpecified: false, // disable the behavior
        },
    });

    config.resolve.fallback = {
        buffer: require.resolve('buffer'),
        Buffer: require.resolve('buffer')
    };

    config.plugins.push(
        new ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    );

    return config;
};