/*!COPYRIGHT HEADER! 
 *
 * (c) Copyright Darwino Inc. 2014-2018.
 *
 * Licensed under The MIT License (https://opensource.org/licenses/MIT)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial 
 * portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const webpack      = require('webpack');
const path         = require('path');
const autoprefixer = require('autoprefixer');
const precss       = require('precss');
const fs 		   = require('fs');

const contextDir      = path.resolve(__dirname, "src/main/app");
const assetsDir       = path.resolve(__dirname, "src/main/resources/DARWINO-INF/resources/assets");
const nodeModulesDir  = path.resolve(__dirname, 'node_modules');

const debug = process.env.NODE_ENV !== "production";
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// Ugly way to find if we are in prod
const production = (process.argv.indexOf('-p')>=0) || (process.env.NODE_ENV==='production');

const config = {
	context: contextDir,
	entry: [
		"babel-polyfill",
		path.resolve(contextDir, "js/client.jsx")
	],
	output: {
		path: assetsDir,
		filename: "bundle.js"
	},
  	resolve: {
		symlinks: false,
    	extensions: ['.js', '.jsx']
	},
  	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: [nodeModulesDir],
				query: {
					presets: ['react', 'es2015', 'stage-1'],
					plugins: [
						'transform-class-properties',
			            ["transform-imports", {
			                "redux-form": {
			                  "transform": "redux-form/es/${member}",
			                  "preventFullImport": true
			                },
			                "lodash": {
			                    "transform": "lodash/${member}",
			                    "preventFullImport": true
			                },
			                "react-bootstrap": {
				                  "transform": "react-bootstrap/lib/${member}",
				                  "preventFullImport": true
				                }
				            }]					
					]
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
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "url-loader?limit=10000&mimetype=application/font-woff" 
			}, { 
				test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
				loader: 'url-loader?limit=10000@name=[name][ext]'
			}, {
				test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
				loader: "file-loader" 
			}
		]
	},

	plugins : [
		//new BundleAnalyzerPlugin(),
		new HtmlWebpackPlugin({
			template: "html/index.html"
		})
	],
};

// Darwino development version 
if(fs.existsSync(path.resolve(__dirname,'src/main/app/darwinosrc/darwino'))) {
	// For internal development of the Darwino library
 	config.resolve.alias = {
  	  	"@darwino/darwino$": path.resolve(__dirname,'src/main/app/darwinosrc/darwino'),
  	  	"@darwino/darwino-react$": path.resolve(__dirname,'src/main/app/darwinosrc/darwino-react'),
  	  	"@darwino/darwino-react-bootstrap$": path.resolve(__dirname,'src/main/app/darwinosrc/darwino-react-bootstrap'),
  	  	"@darwino/darwino-react-bootstrap-notes$": path.resolve(__dirname,'src/main/app/darwinosrc/darwino-react-bootstrap-notes')
	}
}

if (production) {
	new webpack.DefinePlugin({ // <-- key to reducing React's size
       'process.env': {
         'NODE_ENV': JSON.stringify('production')
       }
    }),
    new webpack.optimize.DedupePlugin(), //dedupe similar code 
    new webpack.optimize.UglifyJsPlugin(), //minify everything
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 	
	
	
    // Plugins for production
    // https://stackoverflow.com/questions/35054082/webpack-how-to-build-production-code-and-how-to-use-it
/*	
    config.plugins.push(new webpack.optimize.CommonsChunkPlugin('common.js'))
    config.plugins.push(new webpack.optimize.OccurrenceOrderPlugin())
*/
    //babelSettings.plugins.push("transform-react-inline-elements");
    //babelSettings.plugins.push("transform-react-constant-elements");

} else {
    //config.devtool = "#cheap-module-source-map"
	config.devtool= "source-map"
    config.devServer = {
		port: 8008
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

module.exports = config