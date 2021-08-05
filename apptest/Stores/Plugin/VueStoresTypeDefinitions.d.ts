import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

export declare module "vue/types/vue" {
	interface Vue {
		$userAuth : UserAuthStore,
		$user : UserStore
	}
}
