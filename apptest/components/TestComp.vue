<template>
	<div>
		{{$userStore.message}}
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
