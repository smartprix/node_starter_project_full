<template>
	<div id="app">
		<!-- use ~img to refer to img folder, alternatively you can write ../img/logo.png -->
		<img src="~img/logo.png">
		<hello></hello>
	</div>
</template>

<script>
export default {
	name: 'App',

	data() {
		return {
			showSidebar: true,
		};
	},
};
</script>

<style>
#app {
	font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
