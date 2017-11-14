<template>
	<div></div>
</template>

<script>
export default {
	name: 'Logout',

	mounted() {
		this.$store.dispatch('logout')
			.then(() => {
				this.$router.push({path: '/home'});
			})
			.catch((err) => {
				console.log(err);
				this.$notify({
					type: 'error',
					message: err.message,
					title: 'Error',
				});
			});
	},
};
</script>
