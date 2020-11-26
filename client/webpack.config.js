var path = require('path');
const webpack = require('webpack');
// require('@babel/polyfill');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = (argv) => {
    const dev  = 'development';
    
    return ({

    devServer: {
        contentBase: path.join(__dirname, './src'),
        compress: true,
        port: 8000
    },
    node: {
        global: true,
        __filename: false,
        __dirname: false,
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, '../docs'),
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: [
                  {
                    loader: 'handlebars-loader',
                    options: {
                      helperDirs: path.join(__dirname, '/src/templates/helpers'),
                      partialDirs: path.join(__dirname, '/src/templates/partials'),
                    },
                  },
                  {
                    loader: 'extract-loader',
                  },
                  {
                    loader: 'html-loader',

                  },
                ],
              },
              {
                test: /\.(sa|sc|c)ss$/,
                use: [
                  dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader',
                ],
              },
        {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
            'file-loader',
            ],
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
            'file-loader',
            ],
        },

        { 
          test: /\.xlsx$/, loader: "webpack-xlsx-loader" 
        },

        {

            test: /\.(csv|tsv)$/,

            use: [

            'csv-loader',

            ],

        },

        {

            test: /\.xml$/,

            use: [

            'xml-loader',

            ],

        },
        ],
    },
    plugins: [
            new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {},
            },
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.hbs'),

            }),
            new MiniCssExtractPlugin({
                filename: dev ? '[name].css' : '[name].[hash].css',
                chunkFilename: dev ? '[id].css' : '[id].[hash].css',
              }),
              new StylelintPlugin({
                configFile: '.stylelintrc',
                context: 'src',
                files: '**/*.scss',
                failOnError: false,
                quiet: false,
              }),
        ],
    })
};