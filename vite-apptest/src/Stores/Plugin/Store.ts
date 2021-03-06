import {LocalStorage} from "typesafe-local-storage";
import {StoreManager} from '../../../../dist';
import {StoreModule, StoreWatcher} from './VueClassStoresPluginTypes';
import {reactive, UnwrapRef, watchEffect} from "vue";
import {UnwrapNestedRefs} from "@vue/reactivity";

/**
 * Use this method to define your reactive state object.
 * It's used by internals, but you can also use it yourself for other things.
 *
 * @param {O} state
 * @returns {UnwrapNestedRefs<O>}
 */
function observable<O extends object>(state: O): UnwrapNestedRefs<O> {
	return reactive<O>(state);
}

/**
 * Get all of the store metadata
 *
 * @returns {StoreModule[]}
 */
export const storesMeta = (): StoreModule[] => {
	return require('./stores.meta.json');
};

export {observable};

export abstract class Store<T extends object> {

	/**
	 * Has our component set up watchers and state?
	 *
	 * @type {boolean}
	 * @private
	 */
	private isSetup: boolean = false;

	/**
	 * The state object reference.
	 * This is where you will modify state values.
	 * For ex: this.state.user.username = 'Sam';
	 *
	 * @type {UnwrapNestedRefs<UnwrapRef<T>> | T}
	 */
	public state: UnwrapNestedRefs<UnwrapRef<T>> | T = null;

	/**
	 * An array of vue watch handlers.
	 * Prevents us from registering them twice and allows us to stop them also.
	 *
	 * @type {StoreWatcher[]}
	 * @private
	 */
	private watchers: StoreWatcher[] = [];

	private storeMeta: { store: string, persisted: boolean };

	constructor() {
		this.storeMeta = StoreManager.getStore(this.constructor.name);

		this.setup();
	}

	/**
	 * Prepare our state and make it a reactive object
	 *
	 * @private
	 */
	private setup() {
		this.state = observable(this.getInitialState()) as UnwrapNestedRefs<UnwrapRef<T>>;

		if (this?.storeMeta?.persisted) {
			this.onLoadedFromStorage();
		}

		this.setupWatchers();

		this.initiated();
	}

	private getInitialState(): T {
		if (!this?.storeMeta?.persisted) {
			return this.initialState();
		}

		return {...this.initialState(), ...this.getStateFromStorage()};
	}

	/**
	 * Get the watchers defined on Reflect metadata for this store and initialise them
	 *
	 * @private
	 */
	private setupWatchers() {
		const watchers = StoreManager.getStoreWatchers(this);

		for (let watcher of watchers) {
			if (this.hasWatcher(watcher.property)) {
				continue;
			}

			this.watchers.push({
				property : watcher.property,
				method   : watcher.method,
				handle   : watchEffect(() => {
					this[watcher.method](this.state[watcher.property]);

					return this.state[watcher.property];
				})
			});
		}

		if (this?.storeMeta?.persisted) {
			watchEffect(() => {
				this.stateChanged(this.state as T);

				return this.state;
			});
		}
	}

	/**
	 * Has our watcher for the property been setup already?
	 *
	 * @param {string} property
	 * @returns {boolean}
	 */
	private hasWatcher(property: string): boolean {
		return this.watchers.some(watcher => watcher.property === property);
	}

	/**
	 * Define your initial base state, for example, how your store will look when it's empty
	 * If you don't define these values, vue may loose reactivity.
	 *
	 * @returns {T}
	 */
	public abstract initialState(): T;

	/**
	 * Load the state from local storage
	 *
	 * @private
	 */
	private getStateFromStorage(): T {
		let stateValues: T | string = LocalStorage.get<string>(
			`state:${this.constructor.name}`, null
		);

		stateValues = JSON.parse(stateValues) as T;

		if (!stateValues) {
			return this.initialState();
		}

		return DataTransferObjectManager.serialization().deserialize(stateValues);
	}

	/**
	 * When our state is updated, we want to store the new object in local storage
	 *
	 * @param {T} value
	 * @private
	 */
	private stateChanged(value: T) {
		LocalStorage.set(
			`state:${this.constructor.name}`,
			DataTransferObjectManager.serialization().serialize(value)
		);
	}

	public onLoadedFromStorage() {

	}

	public initiated() {

	}
}
