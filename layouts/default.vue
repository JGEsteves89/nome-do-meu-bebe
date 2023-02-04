<template>
	<v-app dark>
		<v-app-bar :clipped-left="false" fixed app>
			<v-container fluid>
				<v-toolbar-title class="d-flex justify-center">{{ title }}</v-toolbar-title>
			</v-container>
		</v-app-bar>
		<v-main>
			<v-container>
				<Nuxt />
			</v-container>
		</v-main>
		<v-footer :absolute="true" app>
			<span>&copy; {{ new Date().getFullYear() }}</span>
			<v-spacer />
			<span>José Esteves</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			title: 'O que fazer para jantar?',
		};
	},
};
</script>
<style scoped></style>
