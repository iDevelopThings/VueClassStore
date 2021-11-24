"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
var Configuration_1 = require("./Configuration");
var PluginManager_1 = require("./Managers/PluginManager");
var StoreManager_1 = require("./Managers/StoreManager");
function generate(compilation, configuration) {
    Configuration_1.Configuration.setConfiguration(configuration);
    StoreManager_1.StoreManager.loadStores();
    if (Configuration_1.Configuration.versionManager.isInvalidVersion()) {
        var ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';
        if (compilation) {
            compilation.errors.push(new Error(ERROR));
            return;
        }
        throw new Error(ERROR);
    }
    //		PluginManager.clearFiles();
    PluginManager_1.PluginManager.generateVueCompositionApiExportsFile();
    PluginManager_1.PluginManager.generateStoreMetaFile();
    PluginManager_1.PluginManager.generateStoreClass();
    PluginManager_1.PluginManager.generatePluginStoreImports();
    StoreManager_1.StoreManager.generateStoreExportsFile();
    StoreManager_1.StoreManager.generateTypeDefs();
    PluginManager_1.PluginManager.generatePlugin();
}
exports.generate = generate;
//# sourceMappingURL=Generate.js.map