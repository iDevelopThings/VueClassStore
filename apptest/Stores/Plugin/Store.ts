import {observableObject} from "./VueClassStoresPlugin";

export class Store<T> {

	public state: T = observableObject<T>({} as T);

	constructor() {
		const initialState = this.initialState();

		if(!initialState) {
			return;
		}

		this.state = observableObject<T>(initialState);
	}

	public initialState(): T {
//		return {} as T;
		return null;
	}
}
