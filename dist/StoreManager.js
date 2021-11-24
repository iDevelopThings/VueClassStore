"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreManager = void 0;
var StoreManager = /** @class */ (function () {
    function StoreManager() {
    }
    /**
     * Get all stores from reflect meta
     *
     * @returns {StoresList}
     */
    StoreManager.getStores = function () {
        var _a;
        return (_a = Reflect.getMetadata('stores', Reflect)) !== null && _a !== void 0 ? _a : {};
    };
    /**
     * Get a specific store from the reflect meta
     *
     * @param {string} storeName
     * @returns {StoreObject | null}
     */
    StoreManager.getStore = function (storeName) {
        var _a;
        return (_a = this.getStores()[storeName]) !== null && _a !== void 0 ? _a : null;
    };
    /**
     * Update our stores list on reflect metadata
     *
     * @param {Function} store
     * @param {boolean} persisted
     */
    StoreManager.setStore = function (store, persisted) {
        var stores = this.getStores();
        stores[store.name] = {
            store: store,
            persisted: persisted,
        };
        Reflect.defineMetadata('stores', stores, Reflect);
    };
    /**
     * Get the reflect key for a specific stores watcher values
     *
     * @param {Object} target
     * @returns {string}
     */
    StoreManager.storeWatcherKey = function (target) {
        return "store.watchers.".concat(target.constructor.name);
    };
    /**
     * Set a watcher for a store
     *
     * @param {Object} target
     * @param {StoreWatcher} storeValues
     */
    StoreManager.setStoreWatcher = function (target, storeValues) {
        var _a;
        var storeWatchers = (_a = Reflect.getMetadata(this.storeWatcherKey(target), Reflect)) !== null && _a !== void 0 ? _a : [];
        storeWatchers.push(storeValues);
        Reflect.defineMetadata(this.storeWatcherKey(target), storeWatchers, Reflect);
    };
    /**
     * Get the watchers for a specific store
     *
     * @param {Object} target
     * @returns {StoreWatcher[]}
     */
    StoreManager.getStoreWatchers = function (target) {
        var _a;
        return (_a = Reflect.getMetadata(this.storeWatcherKey(target), Reflect)) !== null && _a !== void 0 ? _a : [];
    };
    return StoreManager;
}());
exports.StoreManager = StoreManager;
//# sourceMappingURL=StoreManager.js.map