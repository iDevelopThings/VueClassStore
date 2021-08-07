import {AnotherUserAuthStore} from "../User/AnotherUserAuthStore";
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";

// Add this shim here due to conflict with vue2
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

export declare module "vue/types/vue" {
	interface Vue {
		$anotherUserAuth : AnotherUserAuthStore,
		$userAuth : UserAuthStore,
		$user : UserStore
	}
}
