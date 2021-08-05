import {Store} from "../../src/Store";

export class SomeStore extends Store {
	get message() {
		return "Hello world!";
	}
}
