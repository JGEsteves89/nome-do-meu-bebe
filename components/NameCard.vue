<template>
	<v-card :title="card.name" :class="card.sex === 'F' ? 'girl-card' : 'boy-card'">
		<v-card-title class="h1 justify-center">{{ card.name }}</v-card-title>
		<h5 align="center">{{ card.name }} Martins Esteves</h5>
		<v-card-text class="my-5" align="center">1 em cada {{ getPopularityValue() }} bebés tem o nome {{ card.name }}</v-card-text>
		<v-card-actions class="justify-space-around">
			<v-btn @click="score(-5)" icon>
				<v-icon>mdi-cancel</v-icon>
			</v-btn>
			<v-btn @click="score(-1)" icon>
				<v-icon>mdi-thumb-down</v-icon>
			</v-btn>
			<v-btn @click="score(1)" icon>
				<v-icon>mdi-thumb-up</v-icon>
			</v-btn>
			<v-btn @click="score(2)" icon>
				<v-icon>mdi-heart</v-icon>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
// Please check the following for the sweep options!
// https://github.com/goweiwen/vue-swing
// and for nuxt https://github.com/simllll/nuxt-swing
export default {
	name: 'NameCard',
	props: {
		card: {
			type: Object,
			required: true,
		},
		parent: {
			type: String,
			required: true,
		},
	},
	computed: {},
	mounted() {},
	methods: {
		getPopularityValue() {
			const sum = this.$store.getters['store/getSum'];
			let div = (this.card.count / sum) * 100;
			let inD = (100 / div) | 0;
			return inD;
		},
		score(value) {
			this.$store.dispatch('store/scoreName', { card: this.card, score: value, parent: this.parent }).then(() => {});
		},
	},
};
</script>
<style scoped>
.align-items-center {
	align-items: center;
}
.v-card {
	max-width: 400px;
	min-width: 300px;
}
.girl-card {
	background: #cf4e49;
}
.boy-card {
	background: #496dcf;
}
</style>
