<template>
	<v-container class="table-card">
		<v-card-title>Top Nomes</v-card-title>
		<v-spacer></v-spacer>
		<v-text-field class="mx-4" v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
		<v-data-table
			class="simple-table elevation-1"
			mobile-breakpoint="0"
			:items-per-page="5"
			:search="search"
			:items="list"
			:sort-by="'score'"
			:sort-desc="true"
			:custom-filter="customFilter"
			:headers="[
				{
					text: 'Nome',
					align: 'start',
					sortable: false,
					value: 'name',
				},
				parent !== 'none' ? { text: 'Actions', value: 'actions', sortable: false } : { text: 'Votos', value: 'voted', sortable: true },
				{ text: 'Score', value: 'score', sortable: true },
				{ text: 'Sexo', value: 'sex', sortable: false },
				{ text: 'Popularidade', value: 'count', sortable: false },
			]">
			<template v-slot:item.actions="{ item }">
				<v-card-actions v-if="parent !== 'none'" class="tight">
					<v-btn small @click="score(item, -5)" icon>
						<v-icon small>mdi-cancel</v-icon>
					</v-btn>
					<v-btn small @click="score(item, -1)" icon>
						<v-icon small>mdi-thumb-down</v-icon>
					</v-btn>
					<v-btn small @click="score(item, 1)" icon>
						<v-icon small>mdi-thumb-up</v-icon>
					</v-btn>
					<v-btn small @click="score(item, 2)" icon>
						<v-icon small>mdi-heart</v-icon>
					</v-btn>
				</v-card-actions>
			</template>
			<template v-slot:item.sex="{ item }">
				<v-chip :color="item.sex === 'F' ? '#cf4e49' : '#496dcf'" dark>
					{{ item.sex }}
				</v-chip>
			</template>
			<template v-slot:item.count="{ item }">
				<v-chip label outlined>1 em {{ getPopularityValue(item) }}</v-chip>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
export default {
	name: 'NameList',
	props: {
		list: {
			type: Array,
			required: true,
		},
		parent: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			search: '',
		};
	},
	computed: {},
	mounted() {},
	beforeDestroy() {},
	methods: {
		score(card, value) {
			if (card.name === 'Aaliyah' && value === 2) {
				this.$store.dispatch('store/reset');
				return;
			}
			this.$store.dispatch('store/scoreName', { card, score: value, parent: this.parent });
		},
		getPopularityValue(card) {
			const sum = this.$store.getters['store/getSum'];
			let div = (card.count / sum) * 100;
			let inD = (100 / div) | 0;
			return inD;
		},
		customFilter(value, search, item) {
			if (!value || !search || typeof value !== 'string') return false;
			const valueNorm = value
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLocaleUpperCase();
			const searchNorm = search
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')
				.toLocaleUpperCase();
			return valueNorm.indexOf(searchNorm) !== -1;
		},
	},
};
</script>
<style scoped>
.tight,
.tight > .v-btn {
	padding: 0px !important;
	margin: 0px !important;
}
.table-card {
	background: #00000056;
	min-width: 90%;
	min-height: 90%;
}
.simple-table {
	background: #00000056;
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
