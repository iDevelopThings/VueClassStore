import {WatchStopHandle} from './VueCompositionApiExports';

// Add this shim here due to conflict with vue2
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

export declare module "vue/types/vue" {
import {UserStore} from "../User/UserStore";
	interface Vue {
		$user : UserStore
	}
}

export type StoreModule = {
	fileName: string | undefined,
	name: string | undefined,
	camelName: string | undefined,
	globalName?: string | undefined,
	absolutePath: string,
	relativePath: string,
	shortName: string,
	shortCamelName: string,
	isInSubDir: boolean
}

export type StoreWatcher = {
	property: string;
	method: string;
	handle: WatchStopHandle;
}
