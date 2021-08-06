import {AnotherUserAuthStore} from "../User/AnotherUserAuthStore";
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";
/** @type {AnotherUserAuthStore} */
export const anotherUserAuthStore = new AnotherUserAuthStore();
export const AnotherUserAuthStoreSymbol = Symbol();

/** @type {UserAuthStore} */
export const userAuthStore = new UserAuthStore();
export const UserAuthStoreSymbol = Symbol();

/** @type {UserStore} */
export const userStore = new UserStore();
export const UserStoreSymbol = Symbol();
