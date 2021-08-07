import * as path from "path";
import {AsArray} from "tapable";
import {Compilation, Compiler, EntryNormalized, Stats, WebpackError} from 'webpack';
import {Configuration, PluginConfiguration} from "./Configuration";
import {PluginManager} from "./Managers/PluginManager";
import {StoreManager} from "./Managers/StoreManager";
import chokidar, {FSWatcher} from 'chokidar';
import {isInternallyGeneratedFile} from "./Utilities";

let watcher: FSWatcher = null;

export class VueClassStoresLoader {
	private configuration: PluginConfiguration;

	constructor(configuration?: PluginConfiguration) {
		this.configuration = configuration;

		Configuration.setConfiguration(configuration);
	}

	apply(compiler: Compiler) {

		compiler.hooks.run.tap('VueClassStoreLoader', (compiler: Compiler) => {
			VueClassStoresLoader.generate(undefined, this.configuration);
		});

		compiler.hooks.watchRun.tap('VueClassStoreLoader', (compiler: Compiler) => {
			this.setupWatcher();
		});


	}

	public setupWatcher() {
		if (watcher) {
			return;
		}

		watcher = chokidar.watch(Configuration.storesPath, {
			ignoreInitial : true,
			ignored       : Object.values(Configuration.fileNames(true, true))
		});

		watcher.on('all', (event, filename) => {

			if (event !== 'add' && event !== 'unlink' && event !== 'change') {
				return;
			}

			if (isInternallyGeneratedFile(filename)) {
				return;
			}

			VueClassStoresLoader.generate(undefined, this.configuration);

			console.log('Re-generated vue-class-store files.');
		});
	}

	public static generate(compilation?: Compilation, configuration?: PluginConfiguration) {
		Configuration.setConfiguration(configuration);

		StoreManager.loadStores();

		if (Configuration.versionManager.isInvalidVersion()) {
			const ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';

			if (compilation) {
				compilation.errors.push(new WebpackError(ERROR));

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
