<template>
	<div :class="divStyle">
		<v-card :class="cardStyle">
			<NuxtLink class="nav-link-background" to="/father">
				<v-img
					:height="size"
					src="https://media.istockphoto.com/id/1445591066/pt/vetorial/funny-dad-covering-his-nose-needs-to-change-diaper-vector-cartoon.jpg?s=612x612&w=0&k=20&c=slZv8PmS7988ERhTBVU3Mx1XMOAEC-wZZA-_nqvNQZA=">
					<v-card-title :class="titleStyle">{{ banner ? 'Papá' : 'Nomes do Papá' }}</v-card-title>
				</v-img>
			</NuxtLink>
		</v-card>
		<v-card :class="cardStyle">
			<NuxtLink class="nav-link-background" to="/mother">
				<v-img
					:height="size"
					src="https://media.istockphoto.com/id/1401647854/pt/vetorial/mother-sitting-on-the-toilet-followed-by-her-baby-vector-cartoon.jpg?s=612x612&w=0&k=20&c=o82d6gxRSgwI5muxx1wBYasOkod0jv0iFa2-16VkkM4=">
					<v-card-title :class="titleStyle">{{ banner ? 'Mamã' : 'Nomes da Mamã' }}</v-card-title>
				</v-img>
			</NuxtLink>
		</v-card>
		<v-card :class="cardStyle">
			<NuxtLink class="nav-link-background" to="/results">
				<v-img
					:height="size"
					src="https://media.istockphoto.com/id/1457818748/pt/vetorial/little-boy-disgusted-by-his-parents-kissing-funny-vector-illustration.jpg?s=612x612&w=0&k=20&c=5yFPli5mDW5ZVn87fb56cNNGGpySe-G3evO_DA9VpJ8=">
					<v-card-title :class="titleStyle">Resultados</v-card-title>
				</v-img>
			</NuxtLink>
		</v-card>
	</div>
</template>

<script>
export default {
	name: 'NavigationLinks',
	props: {
		banner: {
			type: Boolean,
			required: true,
		},
	},
	data() {
		if (!this.banner) {
			return {
				size: 200,
				divStyle: 'grow d-flex align-center justify-center flex-column',
				cardStyle: 'not-banner',
				titleStyle: 'not-banner-title  text-center',
			};
		} else {
			return {
				size: 30,
				divStyle: 'grow d-flex align-center justify-center flex-row',
				cardStyle: 'banner',
				titleStyle: 'banner-title text-center',
			};
		}
	},
};
</script>

<style scoped>
.not-banner-title {
}
.banner-title {
	font-size: 16px;
	margin-top: -17px;
}
.banner {
	max-width: 30%;
}

.not-banner {
	max-width: 90%;
}

.v-card {
	background: #f88c8c !important;
	margin: 1rem;
}
.grow {
	width: 100%;
	max-width: 100%;
	min-width: 100%;
}
h1 {
	font-size: 20px;
}
</style>
