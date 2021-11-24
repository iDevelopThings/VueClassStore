import {Store} from "./Plugin/Store";

interface State {
	yeet: boolean;
}

export class AnotherStore extends Store<State> {

	public initialState(): State {
		return {yeet : true};
	}

}
