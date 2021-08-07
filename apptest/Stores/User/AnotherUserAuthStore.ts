import { Store } from "../Plugin/Store";

type UserAuthStoreState = {
	user: object;
	message: string;
}

export class AnotherUserAuthStore extends Store<UserAuthStoreState> {

	public initialState(): UserAuthStoreState {
		return {
			user    : {},
			message : 'testing'
		};
	}

	get message() {
		return this.state.message;
	}

	set message(value) {
		this.state.message = value;
	}
}
