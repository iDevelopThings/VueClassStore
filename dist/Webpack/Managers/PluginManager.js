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
var Configuration_1 = require("../Configuration");
var StoreManager_1 = require("./StoreManager");
var Utilities_1 = require("../Utilities");
var PluginManager = /** @class */ (function () {
    function PluginManager() {
    }
    PluginManager.pluginStoreImportsObject = function () {
        return StoreManager_1.StoreManager.stores
            .map(function (m) {
            var storePath = path.relative(path.resolve.apply(path, __spreadArray([], __read(Configuration_1.Configuration.pluginDirectory.split('/')))), m.absolutePath).replace(Configuration_1.Configuration.fileExtension, '');
            return {
                moduleName: m.name,
                importPath: storePath,
            };
        });
    };
    PluginManager.generatePluginStoreImports = function () {
        this.pluginStoreImports = this.pluginStoreImportsObject()
            .map(function (m) {
            return "import {" + m.moduleName + "} from \"" + m.importPath + "\";";
        })
            .join("\n");
        var fileNamesImport = StoreManager_1.StoreManager.stores.map(function (m) { return m.globalName; });
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
        Utilities_1.writeFile(Configuration_1.Configuration.vueStorePluginFilePath, template);
    };
    PluginManager.clearFiles = function () {
        Object.values(Configuration_1.Configuration.fileNames(true)).forEach(function (name) {
            var filePath = path.join.apply(path, __spreadArray(__spreadArray([], __read(Configuration_1.Configuration.pluginDirectory.split('/'))), [name]));
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.rmSync(filePath);
            }
        });
    };
    PluginManager.pluginStoreImports = null;
    PluginManager.vuePluginStoreImports = null;
    return PluginManager;
}());
exports.PluginManager = PluginManager;
//# sourceMappingURL=PluginManager.js.map