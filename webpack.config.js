const path                 = require('path');
const webpack              = require('webpack');
const {VueLoaderPlugin}    = require('vue-loader');
const {WebpackStoreLoader} = require('./package/WebpackPlugin.js');

module.exports = {
	entry       : {
		app : './apptest/index.ts',
//		package : './src/index.ts',
	},
	output      : {
		path       : path.resolve(__dirname, './dist'),
		publicPath : '/dist/',
		filename   : '[name].js',
	},
	module      : {
		rules : [
			{
				test    : /\.vue$/,
				loader  : 'vue-loader',
				exclude : /node_modules|src|package/,
			},
			{
				test : /\.css$/,
				use  : [
					'vue-style-loader',
					'css-loader',
				],
			},
			{
				test    : /\.tsx?$/,
				loader  : 'ts-loader',
				exclude : /node_modules|src/,

				options : {
					appendTsSuffixTo : [/\.vue$/, /\.ts$/],
				},
			},
			{
				test    : /\.(png|jpg|gif|svg)$/,
				loader  : 'file-loader',
				options : {
					name : '[name].[ext]?[hash]',
				},
			},
		],
	},
	plugins     : [
		new VueLoaderPlugin(),
		new WebpackStoreLoader(
			true,
			'apptest/Stores/Plugin',
			'apptest/Stores',
			'..',
		),
	],
	resolve     : {
		extensions : ['.ts', '.js', '.vue', '.json'],
		alias      : {
			'vue$' : 'vue/dist/vue.esm.js',
		},
	},
	devServer   : {
		historyApiFallback : true,
		noInfo             : true,
	},
	performance : {
		hints : false,
	},
	devtool     : 'eval-source-map',
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map';
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env' : {
				NODE_ENV : '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap : true,
			compress  : {
				warnings : false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize : true,
		}),
	]);
}
