"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VueClassStoresLoader = void 0;
var webpack_1 = require("webpack");
var Configuration_1 = require("./Configuration");
var PluginManager_1 = require("./Managers/PluginManager");
var StoreManager_1 = require("./Managers/StoreManager");
var chokidar_1 = __importDefault(require("chokidar"));
var Utilities_1 = require("./Utilities");
var watcher = null;
var VueClassStoresLoader = /** @class */ (function () {
    function VueClassStoresLoader(configuration) {
        this.configuration = configuration;
        Configuration_1.Configuration.setConfiguration(configuration);
    }
    VueClassStoresLoader.prototype.apply = function (compiler) {
        /*compiler.hooks.run.tap('VueClassStoreLoader', (compiler: Compiler) => {
         console.log('Re-generating vue-class-store loader files.');
         VueClassStoresLoader.generate(undefined, this.configuration);
         });*/
        console.log('Re-generating vue-class-store loader files.');
        VueClassStoresLoader.generate(undefined, this.configuration);
        if (compiler.watching) {
            this.setupWatcher();
        }
        /*if (compiler.hooks.initialize)
         compiler.hooks.initialize.tap('VueClassStoreLoader', () => {
         console.log('Starting vue-class-store watcher.');

         VueClassStoresLoader.generate(undefined, this.configuration);

         if (compiler.watching)
         this.setupWatcher();
         });*/
    };
    VueClassStoresLoader.prototype.setupWatcher = function () {
        var _this = this;
        if (watcher) {
            return;
        }
        watcher = chokidar_1.default.watch(Configuration_1.Configuration.storesPath, {
            ignoreInitial: true,
            ignored: Object.values(Configuration_1.Configuration.fileNames(true, true))
        });
        watcher.on('all', function (event, filename) {
            if (event !== 'add' && event !== 'unlink' && event !== 'change') {
                return;
            }
            if (Utilities_1.isInternallyGeneratedFile(filename)) {
                return;
            }
            VueClassStoresLoader.generate(undefined, _this.configuration);
            console.log('Re-generated vue-class-store files.');
        });
    };
    VueClassStoresLoader.generate = function (compilation, configuration) {
        Configuration_1.Configuration.setConfiguration(configuration);
        StoreManager_1.StoreManager.loadStores();
        if (Configuration_1.Configuration.versionManager.isInvalidVersion()) {
            var ERROR = 'VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.';
            if (compilation) {
                compilation.errors.push(new webpack_1.WebpackError(ERROR));
                return;
            }
            throw new Error(ERROR);
        }
        //		PluginManager.clearFiles();
        PluginManager_1.PluginManager.generateStoreClass();
        PluginManager_1.PluginManager.generatePluginStoreImports();
        StoreManager_1.StoreManager.generateStoreExportsFile();
        StoreManager_1.StoreManager.generateTypeDefs();
        PluginManager_1.PluginManager.generatePlugin();
    };
    return VueClassStoresLoader;
}());
exports.VueClassStoresLoader = VueClassStoresLoader;
//# sourceMappingURL=VueClassStoresLoader.js.map