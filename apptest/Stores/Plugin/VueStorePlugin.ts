import {userAuthStore, userStore} from "./VueStores"; 
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

export default {
	install : (Vue, options) => {
		/** @type {UserAuthStore} */
		Vue.prototype.$userAuthStore = userAuthStore;

		/** @type {UserStore} */
		Vue.prototype.$userStore = userStore;

	}
};
