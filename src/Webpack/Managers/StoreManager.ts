import fs from "fs";
import {Configuration} from "../Configuration";
import {PluginManager} from "./PluginManager";
import {camelize, ensureDirectoryExists, getTemplate, walkDirectory, writeFile} from "../Utilities";

export type StoreModule = {
	fileName: string | undefined,
	name: string | undefined,
	camelName: string | undefined,
	globalName?: string | undefined,
	absolutePath: string,
	relativePath: string,
	shortName: string,
	shortCamelName: string,
	isInSubDir: boolean
}

export class StoreManager {
	public static stores: StoreModule[] = [];
	public static storeExports: string  = null;

	public static loadStores() {
		ensureDirectoryExists(Configuration.storesPath);
		ensureDirectoryExists(Configuration.pluginPath);

		const files = walkDirectory(Configuration.storesPath);

		for (let {filePath, isSubDir} of files) {
			const fileName       = filePath.split('/').pop();
			const name           = fileName.split('.').shift();
			const shortName      = fileName.split('.').shift().replace('Store', '');
			const camelName      = camelize(name);
			const shortCamelName = camelize(name).replace('Store', '');

			this.stores.push({
				fileName,
				name,
				camelName,
				absolutePath : filePath,
				relativePath : filePath.replace(Configuration.storesPath + '/', '').split('.')[0],
				isInSubDir   : isSubDir,
				shortName,
				shortCamelName,
				globalName   : Configuration.shortVueDeclaration ? shortCamelName : camelName,
			});
		}
	}

	public static generateStoreExportsFile() {
		this.storeExports = '';

		const exportsTemplate = getTemplate('vuestore-exports', Configuration.vueVersion);

		if (Configuration.vueVersion === 3) {
			this.storeExports += "import { inject } from 'vue';\n";
		}

		this.storeExports += PluginManager.pluginStoreImports + "\n";

		this.storeExports += this.stores.map(store => exportsTemplate
			.replaceAll('{{name}}', store.name)
			.replaceAll('{{camelName}}', store.camelName),
		).join("\n");

		writeFile(Configuration.storesFilePath, this.storeExports);
	}

	public static generateTypeDefs() {
		let template = getTemplate('typedef', Configuration.vueVersion);

		template = template
			.replaceAll('{{imports}}', PluginManager.pluginStoreImports)
			.replaceAll('{{definitions}}',
				this.stores.map(m => `\t\t$${m.globalName} : ${m.name}`).join(",\n"),
			);

		writeFile(Configuration.definitionsFilePath, template);
	}
}
