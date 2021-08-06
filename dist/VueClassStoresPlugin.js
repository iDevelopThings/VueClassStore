"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.VueClassStoresPlugin = void 0;
var path = require('path');
var fs = require('fs');
var requireContext = require('require-context');
var semver = require('semver');
var packageJson = require(path.resolve(process.cwd(), 'package.json'));
var VueClassStoresPlugin = /** @class */ (function () {
    function VueClassStoresPlugin(configuration) {
        this.shortVueDeclaration = false;
        this.usingTypescript = false;
        this.pluginDirectory = 'src/Stores/Plugin';
        this.pluginStoresImport = '..';
        this.storesDirectory = 'src/Stores';
        this.stores = [];
        this.storeExports = "";
        this.pluginStoreImports = "";
        this.vuePluginStoreImports = "";
        if (configuration.usingTypescript !== undefined) {
            this.usingTypescript = configuration.usingTypescript;
        }
        if (configuration.pluginDirectory !== undefined) {
            this.pluginDirectory = configuration.pluginDirectory;
        }
        if (configuration.storesDirectory !== undefined) {
            this.storesDirectory = configuration.storesDirectory;
        }
        if (configuration.pluginStoresImport !== undefined) {
            this.pluginStoresImport = configuration.pluginStoresImport;
        }
        if (configuration.shortVueDeclaration !== undefined) {
            this.shortVueDeclaration = configuration.shortVueDeclaration;
        }
        this.vueVersion = this.getVueVersion();
        this.fileExtension = this.usingTypescript ? '.ts' : '.js';
        this.storesPath = path.resolve.apply(path, __spreadArray([], __read(this.storesDirectory.split('/'))));
        this.fullFileNames = {
            stores: 'VueStores' + this.fileExtension,
            definitions: 'VueStoresTypeDefinitions.d.ts',
            plugin: 'VueStorePlugin' + this.fileExtension,
        };
        this.fileNames = {
            stores: 'VueStores',
            definitions: 'VueStoresTypeDefinitions',
            plugin: 'VueStorePlugin',
        };
        this.storesFilePath = path.resolve.apply(path, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split('/'))), [this.fullFileNames.stores]));
        this.definitionsFilePath = path.resolve.apply(path, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split('/'))), [this.fullFileNames.definitions]));
        this.vueStorePluginFilePath = path.resolve.apply(path, __spreadArray(__spreadArray([], __read(this.pluginDirectory.split('/'))), [this.fullFileNames.plugin]));
    }
    VueClassStoresPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.done.tap('WebpackStorePlugin', function (compilationParams) {
            //				console.log('Directories: ', {
            //					pluginDirectory    : this.pluginDirectory,
            //					storesDirectory    : this.storesDirectory,
            //					pluginStoresImport : this.pluginStoresImport,
            //				});
            if (_this.vueVersion === null) {
                console.error('VUE VERSION IS NOT 2 OR 3. CANNOT USE VUE CLASS STORE PLUGIN.');
                return;
            }
            _this.prepare();
            //				console.log('Stores: ', this.stores);
            _this.processStores();
        });
    };
    VueClassStoresPlugin.prototype.prepare = function () {
        var e_1, _a;
        this.preparePath(this.pluginDirectory);
        this.preparePath(this.storesDirectory);
        //this.cleanFiles();
        var files = this.walkDirectory(this.storesPath);
        try {
            for (var files_1 = __values(files), files_1_1 = files_1.next(); !files_1_1.done; files_1_1 = files_1.next()) {
                var _b = files_1_1.value, filePath = _b.filePath, stat = _b.stat, isSubDir = _b.isSubDir;
                var fileName = filePath.split('/').pop();
                var name_1 = fileName.split('.').shift();
                var shortName = fileName.split('.').shift().replace('Store', '');
                var camelName = this.camelize(name_1);
                var shortCamelName = this.camelize(name_1).replace('Store', '');
                this.stores.push({
                    fileName: fileName,
                    name: name_1,
                    camelName: camelName,
                    absolutePath: filePath,
                    relativePath: filePath.replace(this.storesPath + '/', '').split('.')[0],
                    isInSubDir: isSubDir,
                    shortName: shortName,
                    shortCamelName: shortCamelName,
                    globalName: this.shortVueDeclaration ? shortCamelName : camelName,
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
    VueClassStoresPlugin.prototype.cleanFiles = function () {
        var _this = this;
        Object.values(this.fullFileNames).forEach(function (name) {
            var filePath = path.join.apply(path, __spreadArray(__spreadArray([], __read(_this.pluginDirectory.split('/'))), [name]));
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath);
            }
        });
    };
    VueClassStoresPlugin.prototype.processStores = function () {
        this.generatePluginStoreImports();
        this.generateExports();
        this.generateTypeDefs();
        this.generatePlugin();
    };
    VueClassStoresPlugin.prototype.generatePluginStoreImports = function () {
        var _this = this;
        this.pluginStoreImports = this.stores
            .map(function (m) { return "import {" + m.name + "} from \"" + _this.pluginStoresImport + "/" + m.relativePath + "\";"; })
            .join("\n");
        var fileNamesImport = this.stores.map(function (m) { return m.camelName; });
        if (this.vueVersion === 3) {
            fileNamesImport.push.apply(fileNamesImport, __spreadArray([], __read(this.stores.map(function (m) { return m.name + 'Symbol'; }))));
        }
        this.vuePluginStoreImports = "import {" + fileNamesImport.join(', ') + "} from \"./" + this.fileNames.stores + "\"; \n";
    };
    /**
     * Generate the contents of VueStores.js
     *
     * This will contain exports for our stores.
     * For example UserStore.ts, will export const userStore = new UserStore();
     */
    VueClassStoresPlugin.prototype.generateExports = function () {
        this.storeExports = '';
        var exportsTemplate = this.getTemplate('vuestore-exports');
        if (this.vueVersion === 3) {
            this.storeExports += "import { inject } from 'vue';\n";
        }
        this.storeExports += this.pluginStoreImports + "\n";
        this.storeExports += this.stores.map(function (store) { return exportsTemplate
            .replaceAll('{{name}}', store.name)
            .replaceAll('{{camelName}}', store.camelName); }).join("\n");
        fs.writeFileSync(this.storesFilePath, this.storeExports);
    };
    /**
     * Generate typescript definitions for our store classes
     * This will give us full auto-completion in our .vue single file components
     * and additional type completion etc in other places.
     */
    VueClassStoresPlugin.prototype.generateTypeDefs = function () {
        var _this = this;
        var template = this.getTemplate('typedef');
        template = template
            .replaceAll('{{imports}}', this.pluginStoreImports)
            .replaceAll('{{definitions}}', this.stores.map(function (m) { return "\t\t$" + (_this.shortVueDeclaration ? m.shortCamelName : m.camelName) + " : " + m.name; }).join(",\n"));
        fs.writeFileSync(this.definitionsFilePath, template);
    };
    /**
     * We generate a vue plugin every time our app builds with webpack.
     * This will autoload our store files and define the global vue app
     * instances of our stores.
     */
    VueClassStoresPlugin.prototype.generatePlugin = function () {
        var template = this.getTemplate('plugin');
        var defTemplate = this.getTemplate('vuestore-definition');
        var definitions = this.stores.map(function (module) { return defTemplate
            .replaceAll('{{name}}', module.name)
            .replaceAll('{{camelName}}', module.camelName)
            .replaceAll('{{globalName}}', module.globalName); }).join("\n");
        var imports = this.vuePluginStoreImports + this.pluginStoreImports;
        template = template
            .replaceAll('{{imports}}', imports)
            .replaceAll('{{definitions}}', definitions);
        fs.writeFileSync(this.vueStorePluginFilePath, template);
    };
    VueClassStoresPlugin.prototype.getTemplate = function (name) {
        var rootPackageDir = process.cwd();
        //Hacky fix to properly reference the packages directory
        if (!process.cwd().includes('/Packages/VueClassStore')) {
            rootPackageDir = path.join(process.cwd(), 'node_modules', 'vue-class-stores');
        }
        return fs.readFileSync(path.resolve(rootPackageDir, 'template', "vue" + this.vueVersion, name + ".template.txt"), { encoding: 'utf-8' });
    };
    /**
     * @param currentDirPath
     * @param isSubDir
     * @returns {{filePath:string, stat:Stats | BigIntStats | undefined, isSubDir:boolean}[]}
     */
    VueClassStoresPlugin.prototype.walkDirectory = function (currentDirPath, isSubDir) {
        var _this = this;
        if (isSubDir === void 0) { isSubDir = false; }
        var files = [];
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                if (!(/Store\.(ts|js)$/.test(name))) {
                    return;
                }
                files.push({ filePath: filePath, stat: stat, isSubDir: isSubDir });
            }
            else if (stat.isDirectory()) {
                files.push.apply(files, __spreadArray([], __read(_this.walkDirectory(filePath, true))));
            }
        });
        return files;
    };
    /**
     * Ensure that all of our directories exist...
     * if they don't, we'll create them
     *
     * @param pathToPrepare
     */
    VueClassStoresPlugin.prototype.preparePath = function (pathToPrepare) {
        var e_2, _a;
        var pathParts = pathToPrepare.split('/');
        var pathBuilt = pathParts[0];
        try {
            for (var pathParts_1 = __values(pathParts), pathParts_1_1 = pathParts_1.next(); !pathParts_1_1.done; pathParts_1_1 = pathParts_1.next()) {
                var pathPart = pathParts_1_1.value;
                if (pathBuilt.includes(pathPart)) {
                    continue;
                }
                var pathCheck = path.join(pathBuilt, pathPart);
                //			console.log('PathCheck: ', pathCheck);
                if (!fs.existsSync(pathCheck)) {
                    fs.mkdirSync(pathCheck);
                }
                pathBuilt = path.join(pathBuilt, pathPart);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (pathParts_1_1 && !pathParts_1_1.done && (_a = pathParts_1.return)) _a.call(pathParts_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    VueClassStoresPlugin.prototype.camelize = function (str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    };
    VueClassStoresPlugin.prototype.getVueVersion = function () {
        var _a;
        var deps = __assign(__assign({}, packageJson.dependencies), packageJson.devDependencies);
        if (!(deps === null || deps === void 0 ? void 0 : deps.vue)) {
            console.error('Vuejs is not found in package.json.\nPlease run:\nnpm install vue@next - for vue 3\nnpm install vue - for vue 2');
            return;
        }
        var version = semver.coerce(deps.vue);
        if (version.major !== 2 && version.major !== 3) {
            return null;
        }
        return (_a = version === null || version === void 0 ? void 0 : version.major) !== null && _a !== void 0 ? _a : null;
    };
    return VueClassStoresPlugin;
}());
exports.VueClassStoresPlugin = VueClassStoresPlugin;
//# sourceMappingURL=VueClassStoresPlugin.js.map