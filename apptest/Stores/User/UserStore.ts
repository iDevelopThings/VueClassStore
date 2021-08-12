import {store, persistedStore, watch} from "../../../dist";
import {Store} from "../Plugin/Store";

type UserStoreState = {
	user: { username: any },
	something: boolean;
	id: number;
}

@persistedStore()
export class UserStore extends Store<UserStoreState> {

	public initialState(): UserStoreState {
		return {
			user      : {username : null},
			something : false,
			id        : 0,
		};
	}

	@watch('user')
	onUserUpdated(value: any) {
		console.log('User updated: ', value.username);
	}

}
