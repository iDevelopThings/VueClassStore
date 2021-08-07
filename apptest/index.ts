import Vue from "vue";
import TestComp from "./components/TestComp.vue";
import {VueClassStoresPlugin} from "./Stores/Plugin/VueClassStoresPlugin";

Vue.use(VueClassStoresPlugin);

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
