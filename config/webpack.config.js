var webpack                   = require('webpack');

var helpers                   = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

module.exports = (env, argv) => {
   
    // Set ENV depending on wepack mode (contained in argv passed by webpack --mode)
    const ENV = process.env.NODE_ENV = process.env.ENV = (argv.mode === 'development') ? 'development' : 'production';

    return {
        output: {
            path: helpers.root('dist'),
            filename: '[name].js',
            libraryTarget: 'umd',
            library: '[name]',
            umdNamedDefine: true,
            globalObject: `(typeof self !== 'undefined' ? self : this)`
        
        },

        entry: {
            'siema': helpers.root('src', 'siema.ts')
        },

        devtool: ENV === 'development' ? 'eval-cheap-module-source-map': 'source-map',

        resolve: {
            extensions: ['.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'awesome-typescript-loader',
                            options: { configFileName: helpers.root('tsconfig.json') }
                        }
                    ]
                }
            ]

        },

        optimization: {
            minimize: true
        }
        
    }

}
