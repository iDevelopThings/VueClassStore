import {user} from "./VueStores"; 
import {UserStore} from "../User/UserStore";

export const VueClassStoresPlugin = {
	install : (Vue, options) => {
		/** @type {UserStore} */
		Vue.prototype.$user = user;

	}
};


