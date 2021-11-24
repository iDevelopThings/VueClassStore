import {HmrContext} from "vite";
import {Configuration, isInternallyGeneratedFile, PluginConfiguration} from "../Plugin";
import {InputOptions} from 'rollup';
import {generate} from "../Plugin/Generate";


export function ViteClassStoresLoader(configuration?: PluginConfiguration) {
	Configuration.setConfiguration(configuration);

	return {
		name : 'class-stores-loader',
		buildStart(options: InputOptions) {
			generate(undefined, configuration);

			this.addWatchFile(Configuration.storesPath);
		},
		handleHotUpdate(context: HmrContext) {
			if (isInternallyGeneratedFile(context.file)) {
				return [];
			}

			if (context.file.includes(Configuration.storesDirectory)) {
				generate(undefined, configuration);
			}


			return context.modules;
		}
	};
}
