var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devServer: {
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 8080
    },
    entry: {
        vendor: [
            './public/resources/bower/jquery/dist/jquery.min.js',
            './public/resources/bower/bootstrap/dist/js/bootstrap.min.js',
            './public/resources/bower/moment/moment.js',
            './public/resources/bower/datetimepicker/build/jquery.datetimepicker.full.min.js',
            './public/resources/bower/jquery-mask-plugin/dist/jquery.mask.min.js',
            './public/resources/bower/angular/angular.min.js',
            './public/resources/bower/angular-environment/dist/angular-environment.js',
            './public/resources/bower/angular-cookies/angular-cookies.js',
            './public/resources/bower/angular-route/angular-route.js',
            './public/resources/bower/angular-jwt/dist/angular-jwt.js',
        ],
        angular: [
            './codebase/ts/compiled/init.js',
            './codebase/ts/compiled/filters.js',
            './codebase/ts/compiled/http_loader.js',
            './codebase/ts/compiled/services/authentication.js',
            './codebase/ts/compiled/services/flash.js',
            './codebase/ts/compiled/services/page.js',
            './codebase/ts/compiled/services/users.js',
            './codebase/ts/compiled/services/projects.js',
            './codebase/ts/compiled/services/profiles.js',
            './codebase/ts/compiled/services/time_reports.js',
            './codebase/ts/compiled/controllers/page.js',
            './codebase/ts/compiled/controllers/404.js',
            './codebase/ts/compiled/controllers/home.js',
            './codebase/ts/compiled/controllers/account.js',
            './codebase/ts/compiled/controllers/time_report_new.js',
            './codebase/ts/compiled/controllers/time_report_list.js',
            './codebase/ts/compiled/controllers/time_report_edit.js',
            './codebase/ts/compiled/controllers/time_report_view.js',
            './codebase/ts/compiled/controllers/login.js',
        ],
        app: [
            './codebase/stylesheets/loading.css',
            './codebase/stylesheets/base.css',
        ]
    },
    output: {
        path: path.resolve(__dirname, 'public/'),
        filename: 'resources/javascripts/[name].js',
    },
    resolve: {
        modulesDirectories: [
            './public/resources/bower/',
            './node_modules/',
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new ExtractTextPlugin('resources/stylesheets/app.css'),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('bower.json', ['main'])
        )
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(woff|svg|ttf|eot)([\?]?.*)$/,
                loader: 'file-loader?[name].[ext]'
            },
            {
                test: /jquery.min.js$/,
                loader: 'expose?$!expose?jQuery'
            },
            // Shim Angular modules
            {test: /angular.min.js$/, loader: 'expose?angular!exports?angular'},
            {test: /moment.js$/, loader: 'expose?moment'},
            {test: /jquery.datetimepicker.full.min.js$/, loader: 'imports?define=>false,exports=>false,moment=moment'},
            {test: /jquery.mask.min.js$/, loader: 'imports?define=>false,exports=>false'}
        ]
    }
};
