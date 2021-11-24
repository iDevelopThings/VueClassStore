<template>
	<div>
		<p v-if="$test.user">
			$test.user.username: {{ $test.user }}
		</p>
		<p v-else>
			$test.user.username is null
		</p>
		<p>
			$test.state.something {{ $test.state.something }}
		</p>
		<p>
			$yeet.state.yeet {{ $yeet.state.yeet }}
		</p>
		<button @click="updateUsername">set</button>
		<button @click="updateUserObj">setObj</button>
		<button @click="updateSomething">setSomething</button>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
	name : 'TestComp',
	data() {
		return {
		};
	},
	methods : {

		updateUsername() {
			this.$test.state.id++;
			this.$test.user.username = 'Testing:' + this.$test.state.id;
		},

		updateUserObj() {
			this.$test.state.id++;
			this.$test.user = {username : 'Testing:' + this.$test.state.id};
		},

		updateSomething() {
			this.$test.state.something = !this.$test.state.something;
		}
	}
});

</script>

<style scoped>

</style>
