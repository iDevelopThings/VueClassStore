"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
var path = require('path');
var fs_1 = __importDefault(require("fs"));
var Configuration_1 = require("./Configuration");
var StoreManager_1 = require("./StoreManager");
var Utilities_1 = require("./Utilities");
var PluginManager = /** @class */ (function () {
    function PluginManager() {
    }
    PluginManager.generatePluginStoreImports = function () {
        this.pluginStoreImports = StoreManager_1.StoreManager.stores
            .map(function (m) {
            var storePath = path.relative(path.resolve.apply(path, __spreadArray([], __read(Configuration_1.Configuration.pluginDirectory.split('/')))), m.absolutePath).replace(Configuration_1.Configuration.fileExtension, '');
            return "import {" + m.name + "} from \"" + storePath + "\";";
        })
            .join("\n");
        var fileNamesImport = StoreManager_1.StoreManager.stores.map(function (m) { return m.camelName; });
        if (Configuration_1.Configuration.vueVersion === 3) {
            fileNamesImport.push.apply(fileNamesImport, __spreadArray([], __read(StoreManager_1.StoreManager.stores.map(function (m) { return m.name + 'Symbol'; }))));
        }
        this.vuePluginStoreImports = "import {" + fileNamesImport.join(', ') + "} from \"./" + Configuration_1.Configuration.fileNames(false).stores + "\"; \n";
    };
    PluginManager.generatePlugin = function () {
        var template = Utilities_1.getTemplate('plugin', Configuration_1.Configuration.vueVersion);
        var defTemplate = Utilities_1.getTemplate('vuestore-definition', Configuration_1.Configuration.vueVersion);
        var definitions = StoreManager_1.StoreManager.stores.map(function (module) { return defTemplate
            .replaceAll('{{name}}', module.name)
            .replaceAll('{{camelName}}', module.camelName)
            .replaceAll('{{globalName}}', module.globalName); }).join("\n");
        var imports = this.vuePluginStoreImports + this.pluginStoreImports;
        template = template
            .replaceAll('{{imports}}', imports)
            .replaceAll('{{definitions}}', definitions);
        fs_1.default.writeFileSync(Configuration_1.Configuration.vueStorePluginFilePath, template);
    };
    PluginManager.pluginStoreImports = null;
    PluginManager.vuePluginStoreImports = null;
    return PluginManager;
}());
exports.PluginManager = PluginManager;
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
//# sourceMappingURL=PluginManager.js.map