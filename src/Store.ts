import Vue from "vue";

export class Store<T> {

	public state: T = Vue.observable<T>({} as T);

	constructor() {
		const initialState = this.initialState();

		if(!initialState) {
			return;
		}

		this.state = Vue.observable<T>(initialState);
	}

	public initialState(): T {
//		return {} as T;
		return null;
	}
}
