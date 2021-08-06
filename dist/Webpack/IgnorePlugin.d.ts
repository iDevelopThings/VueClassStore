export declare class IgnoringWatchFileSystem {
    private wfs;
    private paths;
    /**
     * @param {WatchFileSystem} wfs original file system
     * @param {(string|RegExp)[]} paths ignored paths
     */
    constructor(wfs: any, paths: any);
    watch(files: any, dirs: any, missing: any, startTime: any, options: any, callback: any, callbackUndelayed: any): {
        close: () => any;
        pause: () => any;
        getContextTimeInfoEntries: () => any;
        getFileTimeInfoEntries: () => any;
    };
}
