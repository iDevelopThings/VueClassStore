import { Compiler, Stats } from 'webpack';
import { PluginConfiguration } from "./Configuration";
export declare class VueClassStoresLoader {
    private configuration;
    constructor(configuration?: PluginConfiguration);
    apply(compiler: Compiler): void;
    static generate(stats?: Stats, configuration?: PluginConfiguration): void;
}
