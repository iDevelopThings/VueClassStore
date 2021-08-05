import {SomeOtherStore} from "../SomeOtherStore.ts";
import {SomeStore} from "../SomeStore.ts";
import {UserStore} from "../User/UserStore.ts";

declare module "vue/types/vue" {
	interface Vue {
		$someOtherStore : SomeOtherStore,
		$someStore : SomeStore,
		$userStore : UserStore
	}
}
