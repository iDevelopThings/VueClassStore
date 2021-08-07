import { Compilation, Compiler } from 'webpack';
import { PluginConfiguration } from "./Configuration";
export declare class VueClassStoresLoader {
    private configuration;
    constructor(configuration?: PluginConfiguration);
    apply(compiler: Compiler): void;
    setupWatcher(): void;
    static generate(compilation?: Compilation, configuration?: PluginConfiguration): void;
}
