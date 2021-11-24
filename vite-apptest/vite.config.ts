import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import {ViteClassStoresLoader} from './../dist/Vite/ViteClassStoresLoader';
// https://vitejs.dev/config/
export default defineConfig({
	plugins : [
		vue(),
		ViteClassStoresLoader({
			usingTypescript     : true,
			pluginDirectory     : 'src/Stores/Plugin',
			storesDirectory     : 'src/Stores',
			shortVueDeclaration : true,
		})
	]
});
