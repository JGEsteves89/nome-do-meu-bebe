<template>
	<v-app dark class="main-container-background">
		<v-app-bar class="striped-background" :clipped-left="false" fixed app>
			<navigation-links :banner="true" />
		</v-app-bar>
		<v-main class="main-container-background">
			<v-container>
				<Nuxt />
			</v-container>
		</v-main>
		<v-footer class="striped-background" :absolute="true" app>
			<span class="background-text">&copy; {{ new Date().getFullYear() }}</span>
			<v-spacer />
			<span class="background-text">José Esteves</span>
		</v-footer>
	</v-app>
</template>

<script>
export default {
	name: 'DefaultLayout',
	data() {
		return {
			title: 'Nome do meu bebé',
		};
	},
};
</script>
<style>
.background-text {
	color: #12162d;
	background: #ffffff;
}
.main-container-background {
	background: #f88c8c;
}
.striped-background {
	background: repeating-linear-gradient(-45deg, #ffffff, #ffffff 30px, #6875c0 30px, #6875c0 60px);
}
</style>
