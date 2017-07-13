/*!COPYRIGHT HEADER! - CONFIDENTIAL 
 *
 * Darwino Inc Confidential.
 *
 * (c) Copyright Darwino Inc. 2014-2017.
 *
 * Notice: The information contained in the source code for these files is the property 
 * of Darwino Inc. which, with its licensors, if any, owns all the intellectual property 
 * rights, including all copyright rights thereto.  Such information may only be used 
 * for debugging, troubleshooting and informational purposes.  All other uses of this information, 
 * including any production or commercial uses, are prohibited. 
 */

const webpack      = require('webpack');
const path         = require('path');
const autoprefixer = require('autoprefixer');
const precss       = require('precss');

const contextDir      = path.resolve(__dirname, "src/main/app");
const assetsDir       = path.resolve(__dirname, "src/main/resources/DARWINO-INF/resources/assets");
const nodeModulesDir  = path.resolve(__dirname, 'node_modules');

const debug = process.env.NODE_ENV !== "production";
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: contextDir,
	devtool: debug ? "inline-sourcemap" : null,
	devServer: {
		port: 8008
	},	
	entry: [
		"babel-polyfill",
		path.resolve(contextDir, "js/client.jsx")
	],
	output: {
		path: assetsDir,
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: [nodeModulesDir],
				query: {
					presets: ['react', 'es2015', 'stage-1'],
					plugins: ['transform-class-properties']
				}
			}, {
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			}, {
				test: /\.css$/,
				loader: 'style-loader!css-loader'
			}, {
				test: /\.json$/,
				loader: 'json-loader'
			}, {
				test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif)(\?\S*)?$/,
				loader: 'url-loader?limit=100000@name=[name][ext]'
			}
		]
	},
	plugins : [
		new HtmlWebpackPlugin({
			template: "html/index.html"
		}),
	    new webpack.ProvidePlugin({   
	        jQuery: 'jquery',
	        $: 'jquery',
	        jquery: 'jquery'
	    })
	],
};
