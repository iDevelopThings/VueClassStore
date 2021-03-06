import {WatchStopHandle} from 'vue';

// Add this shim here due to conflict with vue3
export declare module '*.vue' {
	import type {DefineComponent} from 'vue';
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

export declare module '@vue/runtime-core' {
	import {AnotherStore} from "../AnotherStore";
import {TestStore} from "../TestStore";
import {YeetStore} from "../YeetStore";

	interface ComponentCustomProperties {
		$another : AnotherStore,
		$test : TestStore,
		$yeet : YeetStore
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
