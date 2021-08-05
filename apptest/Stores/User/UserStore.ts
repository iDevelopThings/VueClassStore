import {Store} from "../../../src/Store";

export class UserStore extends Store {
	get message() {
		return "Hello world!";
	}
}
