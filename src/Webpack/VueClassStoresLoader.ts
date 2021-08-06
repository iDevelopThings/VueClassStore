import * as path from "path";
import {Compiler, Stats, WebpackError} from 'webpack';
import {Configuration, PluginConfiguration} from "./Configuration";
//import {IgnoringWatchFileSystem} from "./IgnorePlugin";
import {PluginManager} from "./Managers/PluginManager";
import {StoreManager} from "./Managers/StoreManager";


export class VueClassStoresLoader {

	constructor(configuration: PluginConfiguration) {
		Configuration.setConfiguration(configuration);

		StoreManager.loadStores();
	}

	apply(compiler: Compiler) {

		/*compiler.watchFileSystem = new IgnoringWatchFileSystem(
			compiler.watchFileSystem,
			[
				...Object.values(Configuration.fileNames(true, true)),
				'dist/Webpack/!**!/!*'
			]
		);*/

		compiler.hooks.done.tap('VueClassStoreLoader', (stats: Stats) => {
			if(compiler.modifiedFiles) {
				const files = Object.values(Configuration.fileNames(true, true))
				const modified = [...compiler.modifiedFiles.values()];

				for (let file of files) {
					if(modified.includes(path.resolve(file))){
						return;
					}
				}
			}

			if (stats.hasErrors()) {
				return;
			}

			if (Configuration.versionManager.isInvalidVersion()) {
				stats.compilation.warnings.push(
					new WebpackError('VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.')
				);
				return;
			}

			this.runPlugin();

		});
	}

	runPlugin() {
		PluginManager.generatePluginStoreImports();

		StoreManager.generateStoreExportsFile();

		StoreManager.generateTypeDefs();

		PluginManager.generatePlugin();
	}
}

//export default function (...args) {
//	this.cacheable(false);
//
//	const callback = this.async();
//
//	//	this.addDependency(headerPath);
//
//	console.log(...args);
//
//	callback(null, args[0]);
//}

