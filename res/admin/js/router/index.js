import Vue from 'vue';
import Router from 'vue-router';
import Stores from '../components/Store/Stores.vue';
import Brands from '../components/Brand/Brands.vue';
import Dashboard from '../components/Dashboard.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	scrollBehavior: () => ({y: 0}),
	routes: [
		{path: '/stores', component: Stores, name: 'Stores'},
		{path: '/brands', component: Brands, name: 'Brands'},
		{path: '/', component: Dashboard},
		{path: '*', redirect: '/'},
	],
});
