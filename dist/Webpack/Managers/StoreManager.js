"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreManager = void 0;
var Configuration_1 = require("../Configuration");
var PluginManager_1 = require("./PluginManager");
var Utilities_1 = require("../Utilities");
var StoreManager = /** @class */ (function () {
    function StoreManager() {
    }
    StoreManager.loadStores = function () {
        var e_1, _a;
        Utilities_1.ensureDirectoryExists(Configuration_1.Configuration.storesPath);
        Utilities_1.ensureDirectoryExists(Configuration_1.Configuration.pluginPath);
        var files = Utilities_1.walkDirectory(Configuration_1.Configuration.storesPath);
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var _b = files_1_1.value, filePath = _b.filePath, isSubDir = _b.isSubDir;
                var fileName = filePath.split('/').pop();
                var name_1 = fileName.split('.').shift();
                var shortName = fileName.split('.').shift().replace('Store', '');
                var camelName = Utilities_1.camelize(name_1);
                var shortCamelName = Utilities_1.camelize(name_1).replace('Store', '');
                this.stores.push({
                    fileName: fileName,
                    name: name_1,
                    camelName: camelName,
                    absolutePath: filePath,
                    relativePath: filePath.replace(Configuration_1.Configuration.storesPath + '/', '').split('.')[0],
                    isInSubDir: isSubDir,
                    shortName: shortName,
                    shortCamelName: shortCamelName,
                    globalName: Configuration_1.Configuration.shortVueDeclaration ? shortCamelName : camelName,
                });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    StoreManager.generateStoreExportsFile = function () {
        this.storeExports = '';
        var exportsTemplate = Utilities_1.getTemplate('vuestore-exports', Configuration_1.Configuration.vueVersion);
        if (Configuration_1.Configuration.vueVersion === 3) {
            this.storeExports += "import { inject } from 'vue';\n";
        }
        this.storeExports += PluginManager_1.PluginManager.pluginStoreImports + "\n";
        this.storeExports += this.stores.map(function (store) { return exportsTemplate
            .replaceAll('{{name}}', store.name)
            .replaceAll('{{camelName}}', store.camelName); }).join("\n");
        Utilities_1.writeFile(Configuration_1.Configuration.storesFilePath, this.storeExports);
    };
    StoreManager.generateTypeDefs = function () {
        var template = Utilities_1.getTemplate('typedef', Configuration_1.Configuration.vueVersion);
        template = template
            .replaceAll('{{imports}}', PluginManager_1.PluginManager.pluginStoreImports)
            .replaceAll('{{definitions}}', this.stores.map(function (m) { return "\t\t$" + m.globalName + " : " + m.name; }).join(",\n"));
        Utilities_1.writeFile(Configuration_1.Configuration.definitionsFilePath, template);
    };
    StoreManager.stores = [];
    StoreManager.storeExports = null;
    return StoreManager;
}());
exports.StoreManager = StoreManager;
//# sourceMappingURL=StoreManager.js.map