const path = require('path');
import fs from "fs";
import {Configuration} from "../Configuration";
import {StoreManager} from "./StoreManager";
import {getTemplate} from "../Utilities";


export class PluginManager {

	public static pluginStoreImports: string    = null;
	public static vuePluginStoreImports: string = null;

	public static generatePluginStoreImports() {
		this.pluginStoreImports = StoreManager.stores
			.map(m => {
				const storePath = path.relative(
					path.resolve(...Configuration.pluginDirectory.split('/')),
					m.absolutePath,
				).replace(Configuration.fileExtension, '');

				return `import {${m.name}} from "${storePath}";`;
			})
			.join("\n");

		let fileNamesImport = StoreManager.stores.map(m => m.camelName);

		if (Configuration.vueVersion === 3) {
			fileNamesImport.push(...StoreManager.stores.map(m => m.name + 'Symbol'));
		}

		this.vuePluginStoreImports = `import {${fileNamesImport.join(', ')}} from "./${Configuration.fileNames(false).stores}"; \n`;
	}

	public static generatePlugin() {
		let template    = getTemplate('plugin', Configuration.vueVersion);
		let defTemplate = getTemplate('vuestore-definition', Configuration.vueVersion);

		const definitions = StoreManager.stores.map(module => defTemplate
			.replaceAll('{{name}}', module.name)
			.replaceAll('{{camelName}}', module.camelName)
			.replaceAll('{{globalName}}', module.globalName),
		).join("\n");

		let imports = this.vuePluginStoreImports + this.pluginStoreImports;

		template = template
			.replaceAll('{{imports}}', imports)
			.replaceAll('{{definitions}}', definitions);

		fs.writeFileSync(Configuration.vueStorePluginFilePath, template);
	}

}

//export class StoreManager {
//	public static stores: StoreModule[] = [];
//
//	public static loadStores() {
//		ensureDirectoryExists(Configuration.storesPath);
//
//		const files = walkDirectory(Configuration.storesPath);
//
//		for (let {filePath, isSubDir} of files) {
//			const fileName       = filePath.split('/').pop();
//			const name           = fileName.split('.').shift();
//			const shortName      = fileName.split('.').shift().replace('Store', '');
//			const camelName      = camelize(name);
//			const shortCamelName = camelize(name).replace('Store', '');
//
//			this.stores.push({
//				fileName,
//				name,
//				camelName,
//				absolutePath : filePath,
//				relativePath : filePath.replace(Configuration.storesPath + '/', '').split('.')[0],
//				isInSubDir   : isSubDir,
//				shortName,
//				shortCamelName,
//				globalName   : Configuration.shortVueDeclaration ? shortCamelName : camelName,
//			});
//		}
//	}
//}