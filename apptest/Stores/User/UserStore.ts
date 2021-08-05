import {Store} from "../../../src/Store";

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
}
