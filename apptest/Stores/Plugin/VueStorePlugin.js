import {someOtherStore, someStore, userStore} from "./VueStores.js"; 
import {SomeOtherStore} from "../SomeOtherStore.ts";
import {SomeStore} from "../SomeStore.ts";
import {UserStore} from "../User/UserStore.ts";

export default {
	install : (Vue, options) => {
		/** @type {SomeOtherStore} */
		Vue.prototype.$someOtherStore = someOtherStore;
		/** @type {SomeStore} */
		Vue.prototype.$someStore = someStore;
		/** @type {UserStore} */
		Vue.prototype.$userStore = userStore;
	}
};
