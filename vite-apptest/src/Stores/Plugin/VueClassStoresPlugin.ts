import {another, test, yeet, AnotherStoreSymbol, TestStoreSymbol, YeetStoreSymbol} from "./VueStores"; 
import {AnotherStore} from "../AnotherStore";
import {TestStore} from "../TestStore";
import {YeetStore} from "../YeetStore";

export const VueClassStoresPlugin = {
	install : (app, options) => {
		/** @type {AnotherStore} */
		app.config.globalProperties.$another = another;
		app.provide(AnotherStoreSymbol, AnotherStore);

		/** @type {TestStore} */
		app.config.globalProperties.$test = test;
		app.provide(TestStoreSymbol, TestStore);

		/** @type {YeetStore} */
		app.config.globalProperties.$yeet = yeet;
		app.provide(YeetStoreSymbol, YeetStore);

	}
};


