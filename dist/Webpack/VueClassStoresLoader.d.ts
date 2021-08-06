import { Compiler } from 'webpack';
import { PluginConfiguration } from "./Configuration";
export declare class VueClassStoresLoader {
    constructor(configuration: PluginConfiguration);
    apply(compiler: Compiler): void;
    runPlugin(): void;
}
