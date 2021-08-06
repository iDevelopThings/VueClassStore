"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.VueClassStoresLoader = void 0;
var path = __importStar(require("path"));
var webpack_1 = require("webpack");
var Configuration_1 = require("./Configuration");
//import {IgnoringWatchFileSystem} from "./IgnorePlugin";
var PluginManager_1 = require("./Managers/PluginManager");
var StoreManager_1 = require("./Managers/StoreManager");
var VueClassStoresLoader = /** @class */ (function () {
    function VueClassStoresLoader(configuration) {
        Configuration_1.Configuration.setConfiguration(configuration);
        StoreManager_1.StoreManager.loadStores();
    }
    VueClassStoresLoader.prototype.apply = function (compiler) {
        /*compiler.watchFileSystem = new IgnoringWatchFileSystem(
            compiler.watchFileSystem,
            [
                ...Object.values(Configuration.fileNames(true, true)),
                'dist/Webpack/!**!/!*'
            ]
        );*/
        var _this = this;
        compiler.hooks.done.tap('VueClassStoreLoader', function (stats) {
            var e_1, _a;
            if (compiler.modifiedFiles) {
                var files = Object.values(Configuration_1.Configuration.fileNames(true, true));
                var modified = __spreadArray([], __read(compiler.modifiedFiles.values()));
                try {
                    for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                        var file = files_1_1.value;
                        if (modified.includes(path.resolve(file))) {
                            return;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (files_1_1 && !files_1_1.done && (_a = files_1.return)) _a.call(files_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            if (stats.hasErrors()) {
                return;
            }
            if (Configuration_1.Configuration.versionManager.isInvalidVersion()) {
                stats.compilation.warnings.push(new webpack_1.WebpackError('VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.'));
                return;
            }
            _this.runPlugin();
        });
    };
    VueClassStoresLoader.prototype.runPlugin = function () {
        PluginManager_1.PluginManager.generatePluginStoreImports();
        StoreManager_1.StoreManager.generateStoreExportsFile();
        StoreManager_1.StoreManager.generateTypeDefs();
        PluginManager_1.PluginManager.generatePlugin();
    };
    return VueClassStoresLoader;
}());
exports.VueClassStoresLoader = VueClassStoresLoader;
//export default function (...args) {
//	this.cacheable(false);
//
//	const callback = this.async();
//
//	//	this.addDependency(headerPath);
//
//	console.log(...args);
//
//	callback(null, args[0]);
//}
//# sourceMappingURL=VueClassStoresLoader.js.map