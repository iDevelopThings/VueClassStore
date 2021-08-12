export declare type StoreWatcher = {
    method: string;
    property: string;
};
declare type StoreObject = {
    store: any;
    persisted: boolean;
};
declare type StoresList = {
    [key: string]: StoreObject;
};
export declare class StoreManager {
    /**
     * Get all stores from reflect meta
     *
     * @returns {StoresList}
     */
    static getStores(): StoresList;
    /**
     * Get a specific store from the reflect meta
     *
     * @param {string} storeName
     * @returns {StoreObject | null}
     */
    static getStore(storeName: string): StoreObject | null;
    /**
     * Update our stores list on reflect metadata
     *
     * @param {Function} store
     * @param {boolean} persisted
     */
    static setStore(store: Function, persisted: boolean): void;
    /**
     * Get the reflect key for a specific stores watcher values
     *
     * @param {Object} target
     * @returns {string}
     */
    static storeWatcherKey(target: Object): string;
    /**
     * Set a watcher for a store
     *
     * @param {Object} target
     * @param {StoreWatcher} storeValues
     */
    static setStoreWatcher(target: Object, storeValues: StoreWatcher): void;
    /**
     * Get the watchers for a specific store
     *
     * @param {Object} target
     * @returns {StoreWatcher[]}
     */
    static getStoreWatchers(target: Object): StoreWatcher[];
}
export {};
