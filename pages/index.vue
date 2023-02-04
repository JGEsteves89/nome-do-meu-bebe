<template>
	<v-container>
		<v-window v-model="selected">
			<v-window-item v-for="(recipe, i) in recipesOfDays" :key="i">
				<v-row class="d-flex flex-row flex-nowrap justify-space-between py-5">
					<v-btn :disabled="selected === 0" text @click="selectPage(selected - 1)">
						<v-icon>mdi-chevron-left</v-icon>
					</v-btn>
					<v-slide-group class="maxw-70" v-model="selected">
						<v-slide-item v-for="(recipe, n) in recipesOfDays" :key="n" v-slot="{ active, toggle }">
							<v-btn class="mx-2" :input-value="active" active-class="purple white--text" depressed rounded @click="toggle">
								{{ getDayString(recipe.date) }}
							</v-btn>
						</v-slide-item>
					</v-slide-group>
					<v-btn :disabled="selected === maxDays" text @click="selectPage(selected + 1)">
						<v-icon v-if="selected === recipesOfDays.length - 1">mdi-plus</v-icon>
						<v-icon v-else>mdi-chevron-right</v-icon>
					</v-btn>
				</v-row>
				<RecipeOfDay :recipeOfDay="recipe"></RecipeOfDay>
			</v-window-item>
		</v-window>
		<v-bottom-sheet v-model="showShoppingList" inset width="92%">
			<template v-slot:activator="{ on, attrs }">
				<v-fab-transition>
					<v-btn v-bind="attrs" v-on="on" fab large dark bottom right fixed>
						<v-icon large>mdi-basket-plus</v-icon>
					</v-btn>
				</v-fab-transition>
			</template>
			<v-sheet class="accent pb-10">
				<v-list class="accent ma-3">
					<v-checkbox
						v-for="(recipe, i) in recipesOfDays"
						multiple
						:key="i"
						:label="getDayString(recipe.date) + ' - ' + recipe.alternatives[recipe.selected].name"
						v-model="recipe.forShopping" />
				</v-list>
				<div class="text-center">
					<v-btn color="primary" elevation="8" rounded @click="generateShoppingList()">Gerar lista de compras</v-btn>
				</div>
			</v-sheet>
		</v-bottom-sheet>
	</v-container>
</template>

<script>
export default {
	name: 'IndexPage',
	data() {
		return { selected: 0, maxDays: 3, showShoppingList: false };
	},
	computed: {
		recipesOfDays() {
			//console.log('Index recipes of days changed', new Date().getSeconds());
			const recipesOfTheDays = this.$store.getters['store/getRecipesOfTheDays'];
			//console.log('recipesOfDays returned', recipesOfTheDays);
			const daysArray = [];
			for (const recipesOfTheDay of Object.values(recipesOfTheDays)) {
				daysArray.push({
					loading: false,
					recipe: recipesOfTheDay.alternatives[recipesOfTheDay.selected],
					alternatives: recipesOfTheDay.alternatives,
					date: recipesOfTheDay.date,
					forShopping: [undefined],
					selected: recipesOfTheDay.selected,
				});
			}
			//console.log('Index recipes of days set', new Date().getSeconds());
			return daysArray;
		},
	},
	methods: {
		selectPage(n) {
			n = Math.max(n, 0);
			n = Math.min(n, this.maxDays);
			if (n === this.recipesOfDays.length) {
				this.$store.dispatch('store/getRecipesOfTheDays', this.addDays(new Date(), n)).then(() => {
					this.selected = n;
				});
			} else {
				this.selected = n;
			}
		},
		addDays(date, n) {
			date.setDate(date.getDate() + n);
			return date;
		},
		generateShoppingList() {
			const days = [];
			for (const recipe of this.recipesOfDays) {
				//console.log(recipe.forShopping);
				if (recipe.forShopping && recipe.forShopping.length === 1) {
					days.push(recipe.date);
				}
			}
			if (days.length === 0) return;
			this.$store.dispatch('store/generateShoppingList', days);
			this.$router.push({
				path: '/shopping',
			});
		},
		getDayString(date) {
			if (new Date().toDateString() === new Date(date).toDateString()) {
				return 'Hoje';
			} else if (this.addDays(new Date(), 1).toDateString() === new Date(date).toDateString()) {
				return 'Amanhã';
			} else if (this.addDays(new Date(), 2).toDateString() === new Date(date).toDateString()) {
				return 'Depois de manhã';
			} else if (this.addDays(new Date(), 3).toDateString() === new Date(date).toDateString()) {
				return 'Depois depois de manhã';
			}
			return new Date(date).toDateString();
		},
	},
	mounted() {
		//console.log('Component mounted');
		this.$store.dispatch('store/getSettings').then(() => {
			//console.log('index, getSettings ended', this.recipesOfDays);
			if (this.recipesOfDays.length === 0) {
				this.$store.dispatch('store/getRecipesOfTheDays', new Date());
			}
		});
	},
};
</script>
<style scoped>
.maxw-70 {
	max-width: 70% !important;
}
</style>
