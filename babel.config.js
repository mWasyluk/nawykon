module.exports = function (api) {
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                'module-resolver',
                {
                    root: ['./'],
                    alias: {
                        '@components': './src/components',
                        '@models': './src/models',
                        '@styles': './src/styles',
                        '@data': './src/data',
                        '@utils': './src/utils',
                        '@assets': './assets',
                    },
                    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
                },
            ],
        ],
    };
};
