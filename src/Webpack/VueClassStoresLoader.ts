import * as path from "path";
import {Compiler, Stats, WebpackError} from 'webpack';
import {Configuration, PluginConfiguration} from "./Configuration";
import {PluginManager} from "./Managers/PluginManager";
import {StoreManager} from "./Managers/StoreManager";

export class VueClassStoresLoader {
	private configuration: PluginConfiguration;

	constructor(configuration?: PluginConfiguration) {
		this.configuration = configuration;

		Configuration.setConfiguration(configuration);
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
			if (compiler.modifiedFiles) {
				const files    = Object.values(Configuration.fileNames(true, true));
				const modified = [...compiler.modifiedFiles.values()];

				for (let file of files) {
					if (modified.includes(path.resolve(file))) {
						return;
					}
				}
			}

			if (stats.hasErrors()) {
				return;
			}

			VueClassStoresLoader.generate(stats, this.configuration);
		});
	}

	public static generate(stats?: Stats, configuration?: PluginConfiguration) {
		Configuration.setConfiguration(configuration);

		StoreManager.loadStores();

		if (Configuration.versionManager.isInvalidVersion()) {
			const ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';

			if (stats) {
				stats.compilation.warnings.push(new WebpackError(ERROR));

				return;
			}

			throw new Error(ERROR);
		}

		PluginManager.clearFiles();

		PluginManager.generatePluginStoreImports();

		StoreManager.generateStoreExportsFile();

		StoreManager.generateTypeDefs();

		PluginManager.generatePlugin();
	}

}
