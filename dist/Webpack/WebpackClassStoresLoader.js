"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackClassStoresLoader = void 0;
var Plugin_1 = require("../Plugin");
var Generate_1 = require("../Plugin/Generate");
var chokidar_1 = __importDefault(require("chokidar"));
var Plugin_2 = require("../Plugin");
var watcher = null;
var WebpackClassStoresLoader = /** @class */ (function () {
    function WebpackClassStoresLoader(configuration) {
        this.configuration = configuration;
        Plugin_1.Configuration.setConfiguration(configuration);
    }
    WebpackClassStoresLoader.prototype.apply = function (compiler) {
        /*compiler.hooks.run.tap('VueClassStoreLoader', (compiler: Compiler) => {
         console.log('Re-generating vue-class-store loader files.');
         WebpackClassStoresLoader.generate(undefined, this.configuration);
         });*/
        console.log('Re-generating vue-class-store loader files.');
        Generate_1.generate(undefined, this.configuration);
        if (compiler.watching || compiler.watchMode) {
            this.setupWatcher();
        }
        /*if (compiler.hooks.initialize)
         compiler.hooks.initialize.tap('VueClassStoreLoader', () => {
         console.log('Starting vue-class-store watcher.');

         WebpackClassStoresLoader.generate(undefined, this.configuration);

         if (compiler.watching)
         this.setupWatcher();
         });*/
    };
    WebpackClassStoresLoader.prototype.setupWatcher = function () {
        var _this = this;
        if (watcher) {
            return;
        }
        watcher = chokidar_1.default.watch(Plugin_1.Configuration.storesPath, {
            ignoreInitial: true,
            ignored: Object.values(Plugin_1.Configuration.fileNames(true, true))
        });
        watcher.on('all', function (event, filename) {
            if (event !== 'add' && event !== 'unlink' && event !== 'change') {
                return;
            }
            if (Plugin_2.isInternallyGeneratedFile(filename)) {
                return;
            }
            Generate_1.generate(undefined, _this.configuration);
            console.log('Re-generated vue-class-store files.');
        });
    };
    return WebpackClassStoresLoader;
}());
exports.WebpackClassStoresLoader = WebpackClassStoresLoader;
//# sourceMappingURL=WebpackClassStoresLoader.js.map