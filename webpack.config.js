const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'drforna.js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static' }
            ]
        })
    ],
};