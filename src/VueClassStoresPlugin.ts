import {config} from "@vue/test-utils";

const path           = require('path');
const fs             = require('fs');
const requireContext = require('require-context');
const semver         = require('semver');
const packageJson    = require(path.resolve(process.cwd(), 'package.json'));

type StoreModule = {
	fileName: string | undefined,
	name: string | undefined,
	camelName: string | undefined,
	globalName: string | undefined,
	absolutePath: string,
	relativePath: string,
	shortName: string,
	shortCamelName: string,
	isInSubDir: boolean
}

type Configuration = {
	usingTypescript?: boolean;
	pluginDirectory?: string;
	storesDirectory?: string;
	pluginStoresImport?: string;
	shortVueDeclaration?: boolean;
}

export class VueClassStoresPlugin {
	private shortVueDeclaration: boolean  = false;
	private usingTypescript: boolean      = false;
	private pluginDirectory: string       = 'src/Stores/Plugin';
	private pluginStoresImport: string    = '..';
	private storesDirectory: string       = 'src/Stores';
	private stores: StoreModule[]         = [];
	private storeExports: string          = "";
	private pluginStoreImports: string    = "";
	private vuePluginStoreImports: string = "";
	private vueVersion: 2 | 3;
	private fileExtension: string;
	private storesPath: string;
	private storesFilePath: string;
	private definitionsFilePath: string;
	private vueStorePluginFilePath: string;
	private fullFileNames: { plugin: string; stores: string; definitions: string };
	private fileNames: { plugin: string; stores: string; definitions: string };

	constructor(configuration: Configuration) {

		if (configuration.usingTypescript !== undefined) {
			this.usingTypescript = configuration.usingTypescript;
		}
		if (configuration.pluginDirectory !== undefined) {
			this.pluginDirectory = configuration.pluginDirectory;
		}
		if (configuration.storesDirectory !== undefined) {
			this.storesDirectory = configuration.storesDirectory;
		}
		if (configuration.pluginStoresImport !== undefined) {
			this.pluginStoresImport = configuration.pluginStoresImport;
		}
		if (configuration.shortVueDeclaration !== undefined) {
			this.shortVueDeclaration = configuration.shortVueDeclaration;
		}

		this.vueVersion    = this.getVueVersion();
		this.fileExtension = this.usingTypescript ? '.ts' : '.js';

		this.storesPath = path.resolve(...this.storesDirectory.split('/'));

		this.fullFileNames = {
			stores      : 'VueStores' + this.fileExtension,
			definitions : 'VueStoresTypeDefinitions.d.ts',
			plugin      : 'VueStorePlugin' + this.fileExtension,
		};
		this.fileNames     = {
			stores      : 'VueStores',
			definitions : 'VueStoresTypeDefinitions',
			plugin      : 'VueStorePlugin',
		};

		this.storesFilePath = path.resolve(
			...this.pluginDirectory.split('/'),
			this.fullFileNames.stores,
		);

		this.definitionsFilePath = path.resolve(
			...this.pluginDirectory.split('/'),
			this.fullFileNames.definitions,
		);

		this.vueStorePluginFilePath = path.resolve(
			...this.pluginDirectory.split('/'),
			this.fullFileNames.plugin,
		);

	}

	apply(compiler) {
		compiler.hooks.thisCompilation.tap(
			'WebpackStorePlugin',
			(compilationParams) => {
				//				console.log('Directories: ', {
				//					pluginDirectory    : this.pluginDirectory,
				//					storesDirectory    : this.storesDirectory,
				//					pluginStoresImport : this.pluginStoresImport,
				//				});

				if (this.vueVersion === null) {
					console.error('VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.');
					return;
				}

				this.prepare();

				//				console.log('Stores: ', this.stores);

				this.processStores();

			},
		);
	}

	prepare() {
		this.preparePath(this.pluginDirectory);
		this.preparePath(this.storesDirectory);

		this.cleanFiles();

		const files = this.walkDirectory(this.storesPath);

		for (let {filePath, stat, isSubDir} of files) {
			const fileName       = filePath.split('/').pop();
			const name           = fileName.split('.').shift();
			const shortName      = fileName.split('.').shift().replace('Store', '');
			const camelName      = this.camelize(name);
			const shortCamelName = this.camelize(name).replace('Store', '');

			this.stores.push({
				fileName,
				name,
				camelName,
				absolutePath : filePath,
				relativePath : filePath.replace(this.storesPath + '/', '').split('.')[0],
				isInSubDir   : isSubDir,
				shortName,
				shortCamelName,
				globalName   : this.shortVueDeclaration ? shortCamelName : camelName,
			});
		}
	}

	cleanFiles() {
		Object.values(this.fullFileNames).forEach(name => {
			const filePath = path.join(...this.pluginDirectory.split('/'), name);

			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath);
			}
		});
	}

	processStores() {
		this.generatePluginStoreImports();

		this.generateExports();

		this.generateTypeDefs();

		this.generatePlugin();
	}

	generatePluginStoreImports() {
		this.pluginStoreImports = this.stores
			.map(m => `import {${m.name}} from "${this.pluginStoresImport}/${m.relativePath}";`)
			.join("\n");

		let fileNamesImport = this.stores.map(m => m.camelName);

		if (this.vueVersion === 3) {
			fileNamesImport.push(...this.stores.map(m => m.name + 'Symbol'));
		}

		this.vuePluginStoreImports = `import {${fileNamesImport.join(', ')}} from "./${this.fileNames.stores}"; \n`;
	}

	/**
	 * Generate the contents of VueStores.js
	 *
	 * This will contain exports for our stores.
	 * For example UserStore.ts, will export const userStore = new UserStore();
	 */
	generateExports() {
		this.storeExports = '';

		const exportsTemplate = this.getTemplate('vuestore-exports');

		if (this.vueVersion === 3) {
			this.storeExports += "import { inject } from 'vue';\n";
		}

		this.storeExports += this.pluginStoreImports + "\n";

		this.storeExports += this.stores.map(store => exportsTemplate
			.replaceAll('{{name}}', store.name)
			.replaceAll('{{camelName}}', store.camelName),
		).join("\n");

		fs.writeFileSync(this.storesFilePath, this.storeExports);
	}

	/**
	 * Generate typescript definitions for our store classes
	 * This will give us full auto-completion in our .vue single file components
	 * and additional type completion etc in other places.
	 */
	generateTypeDefs() {
		let template = this.getTemplate('typedef');

		template = template
			.replaceAll('{{imports}}', this.pluginStoreImports)
			.replaceAll('{{definitions}}',
				this.stores.map(m => `\t\t$${this.shortVueDeclaration ? m.shortCamelName : m.camelName} : ${m.name}`).join(",\n"),
			);

		fs.writeFileSync(this.definitionsFilePath, template);
	}

	/**
	 * We generate a vue plugin every time our app builds with webpack.
	 * This will autoload our store files and define the global vue app
	 * instances of our stores.
	 */
	generatePlugin() {
		let template    = this.getTemplate('plugin');
		let defTemplate = this.getTemplate('vuestore-definition');

		const definitions = this.stores.map(module => defTemplate
			.replaceAll('{{name}}', module.name)
			.replaceAll('{{camelName}}', module.camelName)
			.replaceAll('{{globalName}}', module.globalName),
		).join("\n");

		let imports = this.vuePluginStoreImports + this.pluginStoreImports;

		template = template
			.replaceAll('{{imports}}', imports)
			.replaceAll('{{definitions}}', definitions);

		fs.writeFileSync(this.vueStorePluginFilePath, template);
	}

	getTemplate(name) {
		let rootPackageDir = process.cwd();

		//Hacky fix to properly reference the packages directory
		if (!process.cwd().includes('/Packages/VueClassStore')) {
			rootPackageDir = path.join(process.cwd(), 'node_modules', 'vue-class-stores');
		}

		return fs.readFileSync(
			path.resolve(rootPackageDir, 'template', `vue${this.vueVersion}`, `${name}.template.txt`),
			{encoding : 'utf-8'},
		);
	}

	/**
	 * @param currentDirPath
	 * @param isSubDir
	 * @returns {{filePath:string, stat:Stats | BigIntStats | undefined, isSubDir:boolean}[]}
	 */
	walkDirectory(currentDirPath: string, isSubDir = false) {
		const files = [];

		fs.readdirSync(currentDirPath).forEach((name) => {
			const filePath = path.join(currentDirPath, name);
			const stat     = fs.statSync(filePath);

			if (stat.isFile()) {
				if (!(/Store\.(ts|js)$/.test(name))) {
					return;
				}

				files.push({filePath, stat, isSubDir});
			} else if (stat.isDirectory()) {
				files.push(...this.walkDirectory(filePath, true));
			}
		});

		return files;
	}

	/**
	 * Ensure that all of our directories exist...
	 * if they don't, we'll create them
	 *
	 * @param pathToPrepare
	 */
	preparePath(pathToPrepare) {
		const pathParts = pathToPrepare.split('/');
		let pathBuilt   = pathParts[0];

		for (let pathPart of pathParts) {

			if (pathBuilt.includes(pathPart)) {
				continue;
			}

			const pathCheck = path.join(pathBuilt, pathPart);

			//			console.log('PathCheck: ', pathCheck);

			if (!fs.existsSync(pathCheck)) {
				fs.mkdirSync(pathCheck);
			}

			pathBuilt = path.join(pathBuilt, pathPart);
		}
	}

	camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
	}

	getVueVersion() {
		const deps = {...packageJson.dependencies, ...packageJson.devDependencies};

		if (!deps?.vue) {
			console.error('Vuejs is not found in package.json.\nPlease run:\nnpm install vue@next - for vue 3\nnpm install vue - for vue 2');
			return;
		}

		const version = semver.coerce(deps.vue);

		if (version.major !== 2 && version.major !== 3) {
			return null;
		}

		return version?.major ?? null;
	}
}

