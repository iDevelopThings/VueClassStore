import {Store} from "../../../package";
import {userAuthStore} from "../Plugin/VueStores";

type UserStoreState = {
	user: object;
}

export class UserStore extends Store<UserStoreState> {

	public initialState(): UserStoreState {
		return {
			user : {}
		};
	}

	get message() {
		return "Hello world!";
	}

	setMessage() {
		userAuthStore.message = 'reee';
	}
}
