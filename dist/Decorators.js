"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.watch = void 0;
require("reflect-metadata");
var StoreManager_1 = require("./StoreManager");
function watch(property) {
    return function (target, propertyKey, descriptor) {
        StoreManager_1.StoreManager.setStoreWatcher(target, {
            method: propertyKey,
            property: property
        });
    };
}
exports.watch = watch;
function store() {
    return function (target) {
        StoreManager_1.StoreManager.setStore(target, false);
    };
}
exports.store = store;
//export function persistedStore(): ClassDecorator {
//	return function (target: Function): void {
//		StoreManager.setStore(target, true);
//	};
//}
//# sourceMappingURL=Decorators.js.map