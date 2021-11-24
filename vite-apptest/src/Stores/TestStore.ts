import {store, watch} from "../../../src";
import {Store} from "./Plugin/Store";


type UserStoreState = {
	user: { username: any },
	something: boolean;
	id: number;
}

@store()
export class TestStore extends Store<UserStoreState> {

	public initialState(): UserStoreState {
		return {
			user      : {username : null},
			something : false,
			id        : 0,
		};
	}

	get user() {
		return this.state.user;
	}

	set user(value) {
		this.state.user = value;
	}

	@watch('user')
	onUserUpdated(value: any) {
		console.log('User updated: ', value.username);
	}
}

