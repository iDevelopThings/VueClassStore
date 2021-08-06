<template>
	<div>
		<p>$user.message : {{$user.message}}</p>
		<p>$userAuth.message : {{$userAuth.message}}</p>
		<p>$anotherUserAuth.message : {{$anotherUserAuth.message}}</p>

		<button @click="$user.setMessage()">set</button>
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
