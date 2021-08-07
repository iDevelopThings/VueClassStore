import { Store } from "../Plugin/Store";
import {userAuth} from "../Plugin/VueStores";

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
		userAuth.message = 'reee';
	}
}
