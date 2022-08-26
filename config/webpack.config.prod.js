const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const common = require('./webpack.config.common.js');

module.exports = merge(common, {
    // Enable minification and tree-shaking
    mode: 'production',
    optimization: {
        usedExports: true,
        minimize: true,
        minimizer: [
            new OptimizeCssAssetsPlugin({}),
            new TerserPlugin({ minify: TerserPlugin.uglifyJsMinify }),
        ],
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
        }),
        new BrotliPlugin(),
    ],
});
