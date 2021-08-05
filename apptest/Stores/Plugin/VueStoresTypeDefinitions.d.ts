import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

declare module "vue/types/vue" {
	interface Vue {
		$userAuthStore : UserAuthStore,
		$userStore : UserStore
	}
}
