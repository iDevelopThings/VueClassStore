import { createApp } from 'vue'
import App from './App.vue'
import {VueClassStoresPlugin} from "./Stores/Plugin/VueClassStoresPlugin";

createApp(App)
	.use(VueClassStoresPlugin)
	.mount('#app')
