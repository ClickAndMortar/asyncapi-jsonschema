const Encore = require('@symfony/webpack-encore');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('build/')
    .setPublicPath('/')
    .addEntry('app', './assets/js/app.js')
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .autoProvidejQuery()
;

const config = Encore.getWebpackConfig();

config.watchOptions = {
    poll: 500,
    ignored: /node_modules/,
};

config.plugins.push(new CopyPlugin([
    {from: 'assets/images/*', to: 'images/', flatten: true}
]));

config.plugins.push(new HtmlWebpackPlugin({
    template: 'assets/index.html',
    hash: true,
}));

module.exports = config;
