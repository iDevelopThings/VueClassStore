import Vue from "vue";
var Store = /** @class */ (function () {
    function Store() {
        this.state = Vue.observable({});
        var initialState = this.initialState();
        if (!initialState) {
            return;
        }
        this.state = Vue.observable(initialState);
    }
    Store.prototype.initialState = function () {
        //		return {} as T;
        return null;
    };
    return Store;
}());
export { Store };
//# sourceMappingURL=Store.js.map