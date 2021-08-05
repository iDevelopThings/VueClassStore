const fs             = require('fs');
const path           = require('path');
const requireContext = require('require-context');

class WebpackStoreLoader {

	constructor(
		pluginDirectory    = 'src/Stores/Plugin',
		storesDirectory    = 'src/Stores',
		pluginStoresImport = '..',
	)
	{
		this.pluginDirectory    = pluginDirectory;
		this.storesDirectory    = storesDirectory;
		this.pluginStoresImport = pluginStoresImport;
		/**
		 * @type {{
		 *     fileName : string|undefined,
		 *     name : string|undefined,
		 *     camelName : string|undefined,
		 *     absolutePath : string,
		 *     relativePath : string,
		 *     isInSubDir : boolean
		 * }[]}
		 */
		this.stores = [];

		this.pluginStoreImports    = "";
		this.vuePluginStoreImports = "";
	}

	apply(compiler)
	{
		compiler.hooks.thisCompilation.tap(
			'WebpackStorePlugin',
			(compilationParams) => {
				const location = path.resolve(...this.storesDirectory.split('/'));

				console.log('Directories: ', {
					location           : location,
					pluginDirectory    : this.pluginDirectory,
					storesDirectory    : this.storesDirectory,
					pluginStoresImport : this.pluginStoresImport,
				});

				this.prepare();

				const files = this.walkDirectory(location);

				for (let {filePath, stat, isSubDir} of files) {
					const fileName  = filePath.split('/').pop();
					const name      = fileName.split('.').shift();
					const camelName = this.camelize(name);

					this.stores.push({
						fileName,
						name,
						camelName,
						absolutePath : filePath,
						relativePath : filePath.replace(location + '/', ''),
						isInSubDir   : isSubDir,
					});
				}

				console.log('Stores: ', this.stores);

				this.processStores();

			},
		);
	}

	prepare()
	{
		this.preparePath(this.pluginDirectory);
		this.preparePath(this.storesDirectory);
	}

	processStores()
	{
		this.generatePluginStoreImports();

		this.generateStoresFile();

		this.generateTypeDefs();

		this.generatePlugin();
	}

	/**
	 * Ensure that all of our directories exist...
	 * if they don't, we'll create them
	 *
	 * @param pathToPrepare
	 */
	preparePath(pathToPrepare)
	{
		const pathParts = pathToPrepare.split('/');
		let pathBuilt   = pathParts[0];

		for (let pathPart of pathParts) {

			if (pathBuilt.includes(pathPart)) {
				continue;
			}

			const pathCheck = path.join(pathBuilt, pathPart);

			console.log('PathCheck: ', pathCheck);

			if (!fs.existsSync(pathCheck)) {
				fs.mkdirSync(pathCheck);
			}

			pathBuilt = path.join(pathBuilt, pathPart);
		}
	}

	generatePluginStoreImports()
	{
		this.pluginStoreImports = this.stores
			.map(m => `import {${m.name}} from "${this.pluginStoresImport}/${m.relativePath}";`)
			.join("\n");

		const fileNamesImport = this.stores.map(m => m.camelName).join(', ');

		this.vuePluginStoreImports = `import {${fileNamesImport}} from "./VueStores.js"; \n`;
	}

	generateStoresFile()
	{
		let template = `${this.pluginStoreImports} \n `;

		template += this.stores.map(
			module => [
				`/** @type {${module.name}} */`,
				`export const ${module.camelName} = new ${module.name}();`,
			].join("\n"),
		).join("\n");

		fs.writeFileSync(
			path.resolve(
				...this.pluginDirectory.split('/'),
				'VueStores.js',
			),
			template,
		);
	}

	generateTypeDefs()
	{
		let template = this.getTemplate('typedef.template.txt');

		template = template
			.replace('{{imports}}', this.pluginStoreImports)
			.replace('{{definitions}}',
				this.stores.map(m => `		$${m.camelName} : ${m.name}`).join(",\n"),
			);

		fs.writeFileSync(
			path.resolve(
				...this.pluginDirectory.split('/'),
				'vue-class-store-definitions.d.ts',
			),
			template,
		);
	}

	generatePlugin()
	{
		let template = this.getTemplate('plugin.template.txt');

		template = template
			.replace('{{imports}}', this.vuePluginStoreImports + this.pluginStoreImports)
			.replace('{{definitions}}',
				this.stores
					.map(module => [
							`\t\t/** @type {${module.name}} */`,
							`\t\tVue.prototype.$${module.camelName} = ${module.camelName};`,
						].join("\n"),
					)
					.join("\n"),
			);

		fs.writeFileSync(
			path.resolve(
				...this.pluginDirectory.split('/'),
				'VueStorePlugin.js',
			),
			template,
		);
	}

	getTemplate(name)
	{
		return fs.readFileSync(
			path.resolve(process.cwd(), 'template', name),
			{encoding : 'utf-8'},
		);
	}

	/**
	 * @param currentDirPath
	 * @param callback
	 * @param isSubDir
	 * @returns {{filePath:string, stat:Stats | BigIntStats | undefined, isSubDir:boolean}[]}
	 */
	walkDirectory(currentDirPath, callback, isSubDir = false)
	{
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
				files.push(...this.walkDirectory(filePath, callback, true));
			}
		});

		return files;
	}

	camelize(str)
	{
		return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		}).replace(/\s+/g, '');
	}

}

module.exports = WebpackStoreLoader;
