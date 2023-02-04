const getRecipes = (day: number) => import('~/data/' + day + '.json').then((m) => m.default || m);
const deepCopy = (object: any) => JSON.parse(JSON.stringify(object));
export const state = (): any => ({
	empty: true,
	recipesOfTheDays: {},
	shoppingList: [],
});

export const getters = {
	getRecipesOfTheDays: (state: any) => state.recipesOfTheDays,
	getShoppingList: (state: any) => state.shoppingList,
};

export const mutations = {
	changeRecipesOfTheDays(state: any, recipesOfTheDays: any) {
		//console.log('mutations changeRecipesOfTheDay was called');
		state.recipesOfTheDays = recipesOfTheDays;
		const recipesOfTheDaysSmall: any = {};
		for (const [date, recipe] of Object.entries(recipesOfTheDays)) {
			const selected = (recipe as any).selected;
			const portions = (recipe as any).alternatives[selected].portions;
			recipesOfTheDaysSmall[date] = {
				selected,
				portions,
				date: (recipe as any).date,
			};
		}
		(this as any).$cookies.set('recipesOfTheDaysSmall', JSON.stringify(recipesOfTheDaysSmall), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			sameSite: true,
		});
		state.empty = false;
	},
	changeShoppingList(state: any, shoppingList: any) {
		//console.log('mutations changeRecipesOfTheDay was called');
		state.shoppingList = shoppingList;
		(this as any).$cookies.set('shoppingList', JSON.stringify(shoppingList), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7,
			sameSite: true,
		});
		state.empty = false;
	},
};

export const actions = {
	async getRecipesOfTheDays({ state }: any, date: any) {
		//console.log('Store getRecipesOfTheDays started', onDeactivated, new Date().getSeconds());
		const dateString = new Date(date).toDateString();
		if (state.recipesOfTheDays[dateString]) return;

		const start: any = new Date(date.getFullYear(), 0, 0);
		const diff = (new Date(date) as any) - start;
		const oneDay = 1000 * 60 * 60 * 24;
		const day = Math.max(Math.min(Math.floor(diff / oneDay), 365), 0);
		const todaysRecipes = await getRecipes(day);
		const alternatives: any[] = Object.values(todaysRecipes);

		for (const alternative of alternatives) {
			alternative.defaultPortions = alternative.portions;
		}
		const recipesOfTheDay = { alternatives, selected: 0, date: new Date(date) };
		const copy = deepCopy(state.recipesOfTheDays);
		copy[dateString] = recipesOfTheDay;
		//console.log('Store getRecipesOfTheDays commit', new Date().getSeconds());
		(this as any).commit('store/changeRecipesOfTheDays', copy);
	},
	async changeSelection({ state }: any, info: any) {
		//console.log('Store changeSelection started', info, new Date().getSeconds());
		const date = new Date(info.date).toDateString();
		//console.log('changeSelection called with', info);
		if (!state.recipesOfTheDays[date]) {
			await (this as any).dispatch('store/getRecipesOfTheDays', new Date(info.date));
		}
		const copy = deepCopy(state.recipesOfTheDays);
		copy[date].selected = info.n;
		//console.log('Changing selected to', info.n);
		//console.log('Store changeSelection commit', new Date().getSeconds());
		(this as any).commit('store/changeRecipesOfTheDays', copy);
	},
	async setPortions({ state }: any, info: any) {
		//console.log('Store setPortions started', info, new Date().getSeconds());
		const date = new Date(info.date).toDateString();
		if (!state.recipesOfTheDays[date]) {
			await (this as any).dispatch('store/getRecipesOfTheDay', new Date(info.date));
		}
		const copy = deepCopy(state.recipesOfTheDays);
		copy[date].alternatives[copy[date].selected].portions = info.portions;
		//console.log('Changing portions to', info.portions);
		//console.log('Store setPortions commit', new Date().getSeconds());
		(this as any).commit('store/changeRecipesOfTheDays', copy);
	},
	async generateShoppingList({ state }: any, days: any[]) {
		//console.log('Store setPortions started', info, new Date().getSeconds());
		for (const day of days) {
			const date = new Date(day).toDateString();
			if (!state.recipesOfTheDays[date]) {
				await (this as any).dispatch('store/getRecipesOfTheDays');
			}
		}
		let ingredients: any = [];
		for (const day of days) {
			const date = new Date(day).toDateString();
			const selected = state.recipesOfTheDays[date].selected;
			const selectedRecipe = state.recipesOfTheDays[date].alternatives[selected];
			const recipeIngredients = deepCopy(selectedRecipe.ingredients);
			for (const ingredient of recipeIngredients) {
				ingredient.qtd = (selectedRecipe.portions * ingredient.qtd) / selectedRecipe.defaultPortions;
			}
			ingredients = ingredients.concat(recipeIngredients);
		}
		let distinctIngredients: any = [];
		for (const ingredient of ingredients) {
			const find = distinctIngredients.find((t: any) => t.name === ingredient.name);
			if (find) {
				//(find.name, find.qtd, find.unit, '+', ingredient.qtd, ingredient.unit);
				const qtdFind = find.qtd.find((q: any) => q.unit === ingredient.unit);
				if (qtdFind) {
					qtdFind.qtd += ingredient.qtd;
				} else {
					find.qtd.push({ qtd: ingredient.qtd, unit: ingredient.unit });
				}
			} else {
				ingredient.qtd = [{ qtd: ingredient.qtd, unit: ingredient.unit }];
				distinctIngredients.push(ingredient);
			}
		}
		const prettyDecimalPoint = (qtd: number) => {
			let prettyDecimal = qtd.toString();
			if (prettyDecimal.includes('.')) {
				prettyDecimal = qtd.toFixed(1);
			}
			return prettyDecimal;
		};

		let finalShoppingList: any = distinctIngredients
			.map((i: any) => {
				return { name: i.name, qtd: i.qtd.map((q: any) => prettyDecimalPoint(q.qtd) + ' ' + q.unit).join(' + '), active: false };
			})
			.sort((a: any, b: any) => a.name > b.name);
		(this as any).commit('store/changeShoppingList', finalShoppingList);
	},
	async updateShoppingList({ state }: any, shoppingList: any[]) {
		(this as any).commit('store/changeShoppingList', deepCopy(shoppingList));
	},
	async getSettings({ state }: any) {
		//console.log('Getting settings', this);
		const allCookies = deepCopy((this as any).$cookies.getAll());
		if (state.empty) {
			//console.log('Restoring cookies', allCookies);
			if (allCookies.recipesOfTheDaysSmall) {
				//console.log('Restoring recipes');
				for (const recipeDay of Object.values(allCookies.recipesOfTheDaysSmall) as any[]) {
					if (new Date(new Date().toDateString()) <= new Date(new Date(recipeDay.date).toDateString())) {
						await (this as any).dispatch('store/getRecipesOfTheDays', new Date(recipeDay.date));
					}
				}
				const copy = deepCopy(state.recipesOfTheDays);
				for (const recipeDay of Object.values(allCookies.recipesOfTheDaysSmall) as any[]) {
					const date = new Date(recipeDay.date).toDateString();
					if (copy[date]) {
						copy[date].selected = recipeDay.selected;
						copy[date].alternatives[recipeDay.selected].portions = recipeDay.portions;
					}
				}
				//console.log('Changed recipes to', copy);
				(this as any).commit('store/changeRecipesOfTheDays', copy);
			}
			if (allCookies.shoppingList) {
				//console.log('Restoring ingredients');
				(this as any).commit('store/changeShoppingList', allCookies.shoppingList);
			}
		}
	},
};
