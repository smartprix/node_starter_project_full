import Vue from 'vue';
import Router from 'vue-router';
import Stores from '../components/Store/Stores.vue';
import Brands from '../components/Brand/Brands.vue';
import Categories from '../components/Category/Categories.vue';
import Users from '../components/User/Users';
import Dashboard from '../components/Dashboard.vue';
import Logout from '../components/Logout.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	scrollBehavior: () => ({y: 0}),
	routes: [
		{path: '/stores', component: Stores, name: 'Stores'},
		{path: '/brands', component: Brands, name: 'Brands'},
		{path: '/logout', component: Logout, name: 'Logout'},
		{path: '/categories', component: Categories, name: 'Categories'},
		{path: '/users', component: Users, name: 'Users'},
		{path: '/', component: Dashboard},
		{path: '*', redirect: '/'},
	],
});
