<template>
	<div class="hello">
		<h1>{{ msg }}</h1>
		<h2>Essential Links</h2>
		<ul>
			<li><a href="https://vuejs.org" target="_blank">VueJS</a></li>
			<li><a href="http://www.smartprix.com" target="_blank">Smartprix</a></li>
			<li><a href="http://www.smartprix.com/deals/" target="_blank">Deals</a></li>
			<li><a href="http://twitter.com/smartprix" target="_blank">Twitter</a></li>
			<br><br>
			<li><a href="http://github.com/smartprix/node_starter_project_full" target="_blank">Docs for This Template</a></li>
		</ul>
		<h2>Ecosystem</h2>
		<ul>
			<li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
			<li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
			<li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
			<li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'hello',

	data() {
		return {
			msg: 'Welcome to Node Starter Template',
		};
	},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
	font-weight: normal;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}
</style>
