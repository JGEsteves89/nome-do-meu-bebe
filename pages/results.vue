<template>
	<div>
		<h1 class="text-center">Nomes preferidos do Papá e da Mamã</h1>
		<name-list class="my-3" v-if="initialized" :list="list" parent="none"></name-list>
	</div>
</template>

<script>
export default {
	name: 'ResultsView',
	data() {
		return { tab: null, initialized: false };
	},
	computed: {
		list() {
			return this.$store.getters['store/getResults'];
		},
	},
	mounted() {
		this.$store.dispatch('store/loadRemoteDB').then(() => {
			this.initialized = true;
		});
	},
};
</script>
<style scoped>
.fill-width {
	width: 100%;
}
.align-items-center {
	align-items: center;
}

.v-card {
	max-width: 400px;
	min-width: 300px;
}
.mother-style {
	background-color: #932723;
}

.father-style {
	background-color: #2a2393;
}
</style>
