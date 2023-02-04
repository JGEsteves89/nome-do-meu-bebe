<template>
	<v-list>
		<v-list-item-group>
			<v-list-item v-for="(item, i) in shoppingList" :key="item.name">
				<v-list-item-action>
					<v-checkbox v-model="item.active" @click="update(i)"></v-checkbox>
				</v-list-item-action>
				<v-list-item-content>
					<v-list-item-title>{{ item.name }}</v-list-item-title>
					<v-list-item-subtitle>{{ item.qtd }}</v-list-item-subtitle>
					<v-divider></v-divider>
				</v-list-item-content>
				<v-list-item-action>
					<v-btn icon @click="remove(i)"><v-icon>mdi-delete</v-icon></v-btn>
				</v-list-item-action>
			</v-list-item>
		</v-list-item-group>
	</v-list>
</template>

<script>
export default {
	name: 'Shopping',
	data() {
		return { internalList: [] };
	},
	methods: {
		update() {
			this.$store.dispatch('store/updateShoppingList', this.shoppingList);
		},
		remove(i) {
			//console.log(this.internalList[i].name);
			this.internalList.splice(i, 1);
			this.$store.dispatch('store/updateShoppingList', this.shoppingList);
		},
	},
	computed: {
		shoppingList() {
			return this.internalList
				.filter((i) => !i.active)
				.sort((a, b) => a.name > b.name)
				.concat(this.internalList.filter((i) => i.active).sort((a, b) => a.name > b.name));
		},
	},
	mounted() {
		this.$store.dispatch('store/getSettings').then(() => {
			this.internalList = JSON.parse(JSON.stringify(this.$store.getters['store/getShoppingList']));
		});
	},
};
</script>
<style scoped></style>
