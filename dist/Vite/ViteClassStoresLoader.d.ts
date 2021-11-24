import { HmrContext } from "vite";
import { PluginConfiguration } from "../Plugin";
import { InputOptions } from 'rollup';
export declare function ViteClassStoresLoader(configuration?: PluginConfiguration): {
    name: string;
    buildStart(options: InputOptions): void;
    handleHotUpdate(context: HmrContext): import("vite").ModuleNode[];
};
