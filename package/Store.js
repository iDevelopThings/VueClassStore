"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
var vue_1 = __importDefault(require("vue"));
var Store = /** @class */ (function () {
    function Store() {
        this.state = vue_1.default.observable({});
        var initialState = this.initialState();
        if (!initialState) {
            return;
        }
        this.state = vue_1.default.observable(initialState);
    }
    Store.prototype.initialState = function () {
        //		return {} as T;
        return null;
    };
    return Store;
}());
exports.Store = Store;
//# sourceMappingURL=Store.js.map