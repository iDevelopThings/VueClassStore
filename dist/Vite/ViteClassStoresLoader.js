"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViteClassStoresLoader = void 0;
var Plugin_1 = require("../Plugin");
var Generate_1 = require("../Plugin/Generate");
function ViteClassStoresLoader(configuration) {
    Plugin_1.Configuration.setConfiguration(configuration);
    return {
        name: 'class-stores-loader',
        buildStart: function (options) {
            (0, Generate_1.generate)(undefined, configuration);
            this.addWatchFile(Plugin_1.Configuration.storesPath);
        },
        handleHotUpdate: function (context) {
            if ((0, Plugin_1.isInternallyGeneratedFile)(context.file)) {
                return [];
            }
            if (context.file.includes(Plugin_1.Configuration.storesDirectory)) {
                (0, Generate_1.generate)(undefined, configuration);
            }
            return context.modules;
        }
    };
}
exports.ViteClassStoresLoader = ViteClassStoresLoader;
//# sourceMappingURL=ViteClassStoresLoader.js.map