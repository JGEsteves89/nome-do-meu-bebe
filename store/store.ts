import TimeElapsed from '~/utils/TimeElapsed';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, child, get } from 'firebase/database';

const getNamesData = () => import('~/data/namesData.json').then((m) => m.default || m);
const deepCopy = (object: any) => JSON.parse(JSON.stringify(object));

const firebaseConfig = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
	appId: process.env.appId,
	databaseURL: process.env.databaseURL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const state = (): any => ({
	father: {
		names: null,
		stillToVote: [],
	},
	mother: {
		names: null,
		stillToVote: [],
	},
	max: 0,
	sum: 0,
});

export const getters = {
	getCurrentStack: (state: any) => (parent: string) => {
		const timeCount = new TimeElapsed();
		const res = state[parent].stillToVote.slice(0, 10);
		timeCount.print('[Store]-getCurrentStack');
		return res;
	},
	getAllNames: (state: any) => (parent: string) => Object.values(state[parent].names),
	getNotVoted: (state: any) => (parent: string) => {
		//console.log('getNotVoted', parent);
		return Object.values(state[parent].names).filter((n: any) => n.voted === 0).length;
	},
	getResults: (state: any) => {
		const timeCount = new TimeElapsed();
		const results = deepCopy(state.father.names);
		for (let [key, vote] of Object.entries(results) as any[]) {
			vote.score += state.mother.names[key].score;
			vote.voted += state.mother.names[key].voted;
		}
		timeCount.print('[Store]-getResults');
		return Object.values(results);
	},
	getSum: (state: any) => state.sum,
};

export const mutations = {
	setData(state: any, data: any) {
		const timeCount = new TimeElapsed();
		state.max = data.max;
		state.sum = data.sum;
		state.mother.names = data.mother.names;
		state.mother.stillToVote = Object.values(state.mother.names)
			.filter((n: any) => n.voted === 0)
			.sort((a: any, b: any) => a.name.localeCompare(b.name))
			.sort((a: any, b: any) => b.count - a.count);

		state.father.names = data.father.names;
		state.father.stillToVote = Object.values(state.father.names)
			.filter((n: any) => n.voted === 0)
			.sort((a: any, b: any) => a.name.localeCompare(b.name))
			.sort((a: any, b: any) => b.count - a.count);
		timeCount.print('[Store]-mutation-setData');
	},
	changeScore(state: any, data: any) {
		const timeCount = new TimeElapsed();
		//console.log('Parent', data.parent, 'changed', data.card.name, 'to', data.score);
		const name = state[data.parent].names[data.card.name + data.card.sex];
		name.voted = 1;
		name.score = data.score;
		const svIndex = state[data.parent].stillToVote.findIndex((n: any) => n.name === data.card.name && n.sex === data.card.sex);
		state[data.parent].stillToVote.splice(svIndex, 1);

		timeCount.print('[Store]-mutation-changeScore');
	},
};

export const actions = {
	async scoreName({ state }: any, data: any) {
		const timeCount = new TimeElapsed();
		if (!state.mother.names || !state.father.names) {
			await (this as any).dispatch('store/loadRemoteDB');
		}
		const res = (this as any).commit('store/changeScore', data);

		(this as any).dispatch('store/saveRemoteDB', data.parent);
		timeCount.print('[Store]-action-changeScore');
		return res;
	},
	async loadRemoteDB({ state }: any) {
		const timeCount = new TimeElapsed();
		if (!state.mother.names || !state.father.names) {
			const dbRef = ref(database);
			return get(child(dbRef, `votes/`))
				.then(async (snapshot) => {
					let data = snapshot.val();
					if (!data) {
					}
					timeCount.print('[Store]-action-loadRemoteDB');
					return await (this as any).commit('store/setData', data);
				})
				.catch((error: any) => {
					console.error(error);
				});
		}
	},
	async saveRemoteDB({ state }: any, parent: string) {
		const timeCount = new TimeElapsed();
		if (!state.mother.names || !state.father.names) {
			await (this as any).dispatch('store/loadRemoteDB');
		}
		//console.log('Pai', state.father.stillToVote.length);
		//console.log('Mãe', state.mother.stillToVote.length);
		set(ref(database, 'votes/' + parent + '/'), state[parent]);
		//console.log('Saved to database');
		timeCount.print('[Store]-action-saveRemoteDB');
	},
	async reset({ state }: any) {
		//console.log('Preparing to reset all the data');
		const resetState = await (this as any).dispatch('store/getResetState');
		set(ref(database, 'votes/'), resetState).then(async () => {
			await (this as any).dispatch('store/loadRemoteDB');
		});
	},
	async getResetState({ state }: any) {
		const names = await getNamesData();
		let data = {} as any;
		data.mother = { ...names };
		data.father = { ...names };
		data.max = names.max;
		data.sum = names.sum;
		return data;
	},
};
