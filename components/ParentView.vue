<template>
	<v-container v-if="initialized" :class="getContainerClass()">
		<span>{{ stillToVote }} nomes por verificar</span>
		<name-card class="my-3" v-if="initialized" :card="card" :parent="parent"></name-card>
		<name-list class="my-3" v-if="initialized" :list="list" :parent="parent"></name-list>
	</v-container>
</template>

<script>
export default {
	name: 'ParentView',
	props: {
		parent: {
			type: String,
			required: true,
		},
	},
	data() {
		return { tab: null, initialized: false };
	},
	computed: {
		card() {
			return this.$store.getters['store/getCurrentStack'](this.parent)[0];
		},
		list() {
			return this.$store.getters['store/getAllNames'](this.parent);
		},
		stillToVote() {
			return this.$store.getters['store/getNotVoted'](this.parent);
		},
	},
	methods: {
		getContainerClass() {
			const base = 'd-flex flex-column justify-center align-items-center fill-width ';
			if (this.parent === 'father') {
				return base + 'father-style';
			}
			return base + 'mother-style';
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
