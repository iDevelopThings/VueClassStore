<template>
	<div>
		<p>$userStore.message : {{$userStore.message}}</p>
		<p>$userAuthStore.message : {{$userAuthStore.message}}</p>

		<button @click="$userStore.setMessage()">set</button>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	name : "TestComp"
})
export default class TestComp extends Vue {
}
</script>

<style scoped>

</style>
