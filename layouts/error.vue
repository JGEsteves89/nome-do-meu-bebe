<template>
	<v-container dark class="main-container-background">
		<navigation-links v-if="error.statusCode === 404" :banner="false" />
		<h1 v-else>
			{{ otherError }}
		</h1>
	</v-container>
</template>

<script>
export default {
	name: 'EmptyLayout',
	layout: 'empty',
	props: {
		error: {
			type: Object,
			default: null,
		},
	},
	data() {
		return {
			otherError: 'An error occurred',
		};
	},
	head() {
		const title = this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
		return {
			title,
		};
	},
};
</script>

<style scoped>
.v-card {
	background: #f88c8c !important;
	margin: 1rem;
	max-width: 90%;
}
.main-container-background {
	background: #f88c8c;
}
h1 {
	font-size: 20px;
}
</style>
