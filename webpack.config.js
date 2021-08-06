const path                   = require('path');
const webpack                = require('webpack');
const {VueLoaderPlugin}      = require('vue-loader');
//const {VueClassStoresPlugin} = require('./dist');
const {VueClassStoresLoader} = require('./dist/Webpack');

module.exports = {
	entry       : {
		app : './apptest/index.ts',
//		package : './src/index.ts',
	},
	output      : {
		path       : path.resolve(__dirname, './apptestdist'),
		publicPath : '/apptestdist/',
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
			/*{
			 test    : /(\.ts|\.js)$/,
			 loader  : '',
			 exclude : /node_modules|src/,
			 },*/
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
		new VueClassStoresLoader(),
//		new VueClassStoresPlugin({
//			usingTypescript     : true,
//			shortVueDeclaration : true,
//			pluginDirectory     : 'apptest/Stores/Plugin',
//			storesDirectory     : 'apptest/Stores',
//		}),
	],
	resolve     : {
		extensions : ['.ts', '.js', '.vue', '.json'],
		alias      : {
			'vue$' : 'vue/dist/vue.esm.js',
		},
		fallback   : {
			util   : require.resolve('util'),
			path   : require.resolve('path-browserify'),
			crypto : require.resolve('crypto-browserify'),
			zlib   : require.resolve('browserify-zlib'),
			stream : require.resolve('stream-browserify'),
			buffer : require.resolve('buffer'),
			https  : require.resolve('https-browserify'),
			http   : require.resolve('stream-http'),
			url    : require.resolve('url'),
			vm     : require.resolve('vm-browserify'),
			os     : require.resolve('os-browserify/browser'),

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
