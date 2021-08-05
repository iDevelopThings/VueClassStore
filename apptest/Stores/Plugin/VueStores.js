import {SomeOtherStore} from "../SomeOtherStore.ts";
import {SomeStore} from "../SomeStore.ts";
import {UserStore} from "../User/UserStore.ts"; 
 /** @type {SomeOtherStore} */
export const someOtherStore = new SomeOtherStore();
/** @type {SomeStore} */
export const someStore = new SomeStore();
/** @type {UserStore} */
export const userStore = new UserStore();