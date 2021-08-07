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

		/*compiler.watchFileSystem = new IgnoringWatchFileSystem(
		 compiler.watchFileSystem,
		 [
		 ...Object.values(Configuration.fileNames(true, true)),
		 'dist/Webpack/!**!/!*'
		 ]
		 );*/

		//		compiler.hooks.assetEmitted.tap('VueClassStoreLoader', (file, {content, source, outputPath, compilation, targetPath}) => {
		//			const files = Object.values(Configuration.fileNames(true, true));
		//
		//			for (let intFiles of files) {
		//				if (file.includes(intFiles)) {
		//					console.log('ASSET EMITTED: ', file, {
		//						content : content, source : source, outputPath : outputPath, compilation : compilation, targetPath : targetPath
		//					});
		//				}
		//			}
		//
		//		});


		compiler.hooks.entryOption.tap(
			'VueClassStoreLoader',
			//@ts-ignore
			(...args: AsArray<string, EntryNormalized>) => {
				/*if (compiler.modifiedFiles) {
				 const files    = Object.values(Configuration.fileNames(true, true));
				 const modified = [...compiler.modifiedFiles.values()];

				 for (let file of files) {
				 if (modified.includes(path.resolve(file))) {
				 return;
				 }
				 }

				 console.log('MODIFIED FILES: ', compiler.modifiedFiles);
				 }*/

				this.setupWatcher();

				return true;
			});
	}

	public setupWatcher() {
		if (watcher) {
			console.log('Tried to create new watcher but one already exists.');
			return;
		}


		console.log('Watcher initialized.');

		watcher = chokidar.watch(Configuration.storesPath, {
			ignoreInitial : true,
			ignored       : Object.values(Configuration.fileNames(true, true))
		});

		watcher.on('all', (event, filename) => {

			if (event !== 'add' && event !== 'unlink' && event !== 'change') {
				return
			}

			if(isInternallyGeneratedFile(filename)) {
				return;
			}

			console.log('Watcher event: ', event, filename);

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
