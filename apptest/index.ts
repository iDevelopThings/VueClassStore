import Vue from "vue";
import TestComp from "./components/TestComp.vue";
import VueStorePlugin from "./Stores/Plugin/VueStorePlugin";

Vue.use(VueStorePlugin);

Vue.component('TestComp', TestComp);

let v = new Vue({
	el       : "#app",
	template : `
	<div>
	<h1>hello?</h1>
	<TestComp/>
</div>
`
});

//@ts-ignore
window.app = v;
