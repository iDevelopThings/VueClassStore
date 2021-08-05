export declare class WebpackStoreLoader {
    private usingTypescript;
    private pluginDirectory;
    private pluginStoresImport;
    private storesDirectory;
    private stores;
    private storeExports;
    private pluginStoreImports;
    private vuePluginStoreImports;
    private vueVersion;
    private fileExtension;
    private storesPath;
    private storesFilePath;
    private definitionsFilePath;
    private vueStorePluginFilePath;
    private fullFileNames;
    private fileNames;
    constructor(usingTypescript?: boolean, pluginDirectory?: string, storesDirectory?: string, pluginStoresImport?: string);
    apply(compiler: any): void;
    prepare(): void;
    cleanFiles(): void;
    processStores(): void;
    generatePluginStoreImports(): void;
    /**
     * Generate the contents of VueStores.js
     *
     * This will contain exports for our stores.
     * For example UserStore.ts, will export const userStore = new UserStore();
     */
    generateExports(): void;
    /**
     * Generate typescript definitions for our store classes
     * This will give us full auto-completion in our .vue single file components
     * and additional type completion etc in other places.
     */
    generateTypeDefs(): void;
    /**
     * We generate a vue plugin every time our app builds with webpack.
     * This will autoload our store files and define the global vue app
     * instances of our stores.
     */
    generatePlugin(): void;
    getTemplate(name: any): any;
    /**
     * @param currentDirPath
     * @param isSubDir
     * @returns {{filePath:string, stat:Stats | BigIntStats | undefined, isSubDir:boolean}[]}
     */
    walkDirectory(currentDirPath: string, isSubDir?: boolean): any[];
    /**
     * Ensure that all of our directories exist...
     * if they don't, we'll create them
     *
     * @param pathToPrepare
     */
    preparePath(pathToPrepare: any): void;
    camelize(str: any): any;
    getVueVersion(): any;
}
