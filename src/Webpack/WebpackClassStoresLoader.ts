import {Compiler} from 'webpack';
import {Configuration, PluginConfiguration} from "../Plugin";
import {generate} from "../Plugin/Generate";
import chokidar, {FSWatcher} from 'chokidar';
import {isInternallyGeneratedFile} from "../Plugin";

let watcher: FSWatcher = null;

export class WebpackClassStoresLoader {
	private configuration: PluginConfiguration;

	constructor(configuration?: PluginConfiguration) {
		this.configuration = configuration;

		Configuration.setConfiguration(configuration);
	}

	apply(compiler: Compiler) {

		/*compiler.hooks.run.tap('VueClassStoreLoader', (compiler: Compiler) => {
		 console.log('Re-generating vue-class-store loader files.');
		 WebpackClassStoresLoader.generate(undefined, this.configuration);
		 });*/

		console.log('Re-generating vue-class-store loader files.');

		generate(undefined, this.configuration);

		if (compiler.watching || compiler.watchMode) {
			this.setupWatcher();
		}

		/*if (compiler.hooks.initialize)
		 compiler.hooks.initialize.tap('VueClassStoreLoader', () => {
		 console.log('Starting vue-class-store watcher.');

		 WebpackClassStoresLoader.generate(undefined, this.configuration);

		 if (compiler.watching)
		 this.setupWatcher();
		 });*/


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

			generate(undefined, this.configuration);

			console.log('Re-generated vue-class-store files.');
		});
	}


}
