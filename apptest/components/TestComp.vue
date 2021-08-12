<template>
	<div>
		<p v-if="$user.state.user">
			$user.state.user.username: {{ $user.state.user }}
		</p>
		<p v-else>
			$user.state.user.username is null
		</p>
		<p>
			$user.state.something {{ $user.state.something }}
		</p>
		<button @click="updateUsername">set</button>
		<button @click="updateUserObj">setObj</button>
		<button @click="updateSomething">setSomething</button>
	</div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component({
	name : "TestComp"
})
export default class TestComp extends Vue {
	userId: number = 0;

	updateUsername() {
		this.$user.state.id++;
		this.$user.state.user.username = 'Testing:' + this.$user.state.id;
	}

	updateUserObj() {
		this.$user.state.id++;
		this.$user.state.user = {username : 'Testing:' + this.$user.state.id};
	}

	updateSomething() {
		this.$user.state.something = !this.$user.state.something;
	}
}
</script>

<style scoped>

</style>
