import { VueVersionManager } from "./Managers/VueVersionManager";
export declare type PluginConfiguration = {
    usingTypescript?: boolean;
    pluginDirectory?: string;
    storesDirectory?: string;
    shortVueDeclaration?: boolean;
};
export declare type ConfigurationManagerConfiguration = {
    usingTypescript: boolean;
    pluginDirectory: string;
    storesDirectory: string;
    storesPath?: string;
    shortVueDeclaration: boolean;
    versionManager: VueVersionManager;
    vueVersion: 2 | 3;
    fileExtension: string;
    storesFilePath?: string;
    definitionsFilePath?: string;
    vueStorePluginFilePath?: string;
};
export declare class Configuration {
    static usingTypescript: boolean;
    static pluginDirectory: string;
    static storesDirectory: string;
    static storesPath?: string;
    static shortVueDeclaration: boolean;
    static versionManager: VueVersionManager;
    static vueVersion: 2 | 3;
    static fileExtension: string;
    static storesFilePath?: string;
    static definitionsFilePath?: string;
    static vueStorePluginFilePath?: string;
    static setConfiguration(configuration: PluginConfiguration): void;
    static set(key: keyof ConfigurationManagerConfiguration, value: any): void;
    private static setupConfiguration;
    static fileNames(withExtensions?: boolean, absolutePath?: boolean): {
        stores: string;
        definitions: string;
        plugin: string;
    };
}
