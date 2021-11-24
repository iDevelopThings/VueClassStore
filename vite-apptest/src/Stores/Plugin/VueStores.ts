import { inject } from 'vue';
import {AnotherStore} from "../AnotherStore";
import {TestStore} from "../TestStore";
import {YeetStore} from "../YeetStore";
/** @type {AnotherStore} */
export const another = new AnotherStore();
export const AnotherStoreSymbol = Symbol();

/**
 * @returns {AnotherStore}
 */
export function useAnotherStore() : AnotherStore {
	const store = inject(AnotherStoreSymbol);

	if (!store) {
		throw new Error('No AnotherStore provided!');
	}

	return store as AnotherStore;
}

/** @type {TestStore} */
export const test = new TestStore();
export const TestStoreSymbol = Symbol();

/**
 * @returns {TestStore}
 */
export function useTestStore() : TestStore {
	const store = inject(TestStoreSymbol);

	if (!store) {
		throw new Error('No TestStore provided!');
	}

	return store as TestStore;
}

/** @type {YeetStore} */
export const yeet = new YeetStore();
export const YeetStoreSymbol = Symbol();

/**
 * @returns {YeetStore}
 */
export function useYeetStore() : YeetStore {
	const store = inject(YeetStoreSymbol);

	if (!store) {
		throw new Error('No YeetStore provided!');
	}

	return store as YeetStore;
}
