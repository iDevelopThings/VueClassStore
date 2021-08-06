export declare type StoreModule = {
    fileName: string | undefined;
    name: string | undefined;
    camelName: string | undefined;
    globalName?: string | undefined;
    absolutePath: string;
    relativePath: string;
    shortName: string;
    shortCamelName: string;
    isInSubDir: boolean;
};
export declare class StoreManager {
    static stores: StoreModule[];
    static storeExports: string;
    static loadStores(): void;
    static generateStoreExportsFile(): void;
    static generateTypeDefs(): void;
}
