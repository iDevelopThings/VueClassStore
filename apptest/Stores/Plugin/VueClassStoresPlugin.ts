import {anotherUserAuth, userAuth, user} from "./VueStores"; 
import {AnotherUserAuthStore} from "../User/AnotherUserAuthStore";
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

export const VueClassStoresPlugin = {
	install : (Vue, options) => {
		/** @type {AnotherUserAuthStore} */
		Vue.prototype.$anotherUserAuth = anotherUserAuth;

		/** @type {UserAuthStore} */
		Vue.prototype.$userAuth = userAuth;

		/** @type {UserStore} */
		Vue.prototype.$user = user;

	}
};

import Vue from "vue";
export const observableObject = <T>(object) => {
	return Vue.observable<T>({} as T)
}
