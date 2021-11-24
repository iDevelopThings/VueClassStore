import { Compiler } from 'webpack';
import { PluginConfiguration } from "../Plugin";
export declare class WebpackClassStoresLoader {
    private configuration;
    constructor(configuration?: PluginConfiguration);
    apply(compiler: Compiler): void;
    setupWatcher(): void;
}
