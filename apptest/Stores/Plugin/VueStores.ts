import {AnotherUserAuthStore} from "../User/AnotherUserAuthStore";
import {UserAuthStore} from "../User/UserAuthStore";
import {UserStore} from "../User/UserStore";
/** @type {AnotherUserAuthStore} */
export const anotherUserAuth = new AnotherUserAuthStore();
export const AnotherUserAuthStoreSymbol = Symbol();

/** @type {UserAuthStore} */
export const userAuth = new UserAuthStore();
export const UserAuthStoreSymbol = Symbol();

/** @type {UserStore} */
export const user = new UserStore();
export const UserStoreSymbol = Symbol();
