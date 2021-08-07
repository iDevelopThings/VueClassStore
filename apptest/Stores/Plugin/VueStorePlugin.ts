import {anotherUserAuthStore, userAuthStore, userStore} from "./VueStores";
import {AnotherUserAuthStore} from "../User/AnotherUserAuthStore";
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

export default {
	install : (Vue, options) => {
		/** @type {AnotherUserAuthStore} */
		Vue.prototype.$anotherUserAuth = anotherUserAuthStore;

		/** @type {UserAuthStore} */
		Vue.prototype.$userAuth = userAuthStore;

		/** @type {UserStore} */
		Vue.prototype.$user = userStore;

	}
};

import Vue from "vue";
export const observableObject = <T>(object) => {
	return Vue.observable<T>({} as T)
}
