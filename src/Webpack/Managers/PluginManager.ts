const path = require('path');
import fs from "fs";
import {Configuration} from "../Configuration";
import {StoreManager} from "./StoreManager";
import {getTemplate, writeFile} from "../Utilities";

export type PluginStoreImportsObject = {
	moduleName: string;
	importPath: string;
}

export class PluginManager {

	public static pluginStoreImports: string    = null;
	public static vuePluginStoreImports: string = null;

	public static pluginStoreImportsObject(): PluginStoreImportsObject[] {
		return StoreManager.stores
			.map(m => {
				const storePath = path.relative(
					path.resolve(...Configuration.pluginDirectory.split('/')),
					m.absolutePath,
				).replace(Configuration.fileExtension, '');

				return {
					moduleName : m.name,
					importPath : storePath,
				};
			});
	}

	public static generatePluginStoreImports() {
		this.pluginStoreImports = this.pluginStoreImportsObject()
			.map(m => {
				return `import {${m.moduleName}} from "${m.importPath}";`;
			})
			.join("\n");

		let fileNamesImport = StoreManager.stores.map(m => m.globalName);

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

		writeFile(Configuration.vueStorePluginFilePath, template);
	}

	public static clearFiles() {
		Object.values(Configuration.fileNames(true)).forEach(name => {
			const filePath = path.join(...Configuration.pluginDirectory.split('/'), name);

			if (fs.existsSync(filePath)) {
				fs.rmSync(filePath);
			}
		});
	}


}
