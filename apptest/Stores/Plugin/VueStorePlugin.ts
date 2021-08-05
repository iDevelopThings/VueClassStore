import {userAuthStore, userStore} from "./VueStores"; 
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

export default {
	install : (Vue, options) => {
		/** @type {UserAuthStore} */
		Vue.prototype.$userAuth = userAuthStore;

		/** @type {UserStore} */
		Vue.prototype.$user = userStore;

	}
};
