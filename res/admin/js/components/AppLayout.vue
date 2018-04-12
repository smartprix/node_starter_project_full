<template>
	<ela-app-layout>
		<div slot="header">
			<div class="header-left">
				<ela-menu-items :items="headerMenuItems" mode="horizontal"></ela-menu-items>
			</div>
			<div class="header-right">
				<el-input icon="el-icon-search" placeholder="Search" style="width: 300px;"></el-input>
				<ela-menu-items :items="userMenuItems" mode="horizontal"></ela-menu-items>
			</div>
		</div>

		<div slot="sidebar">
			<div class="logo">
				<img src="~img/logo.png" height="60" class="logo" />
			</div>
			<ela-menu-items :items="sideMenuItems"></ela-menu-items>
		</div>

		<router-view></router-view>
	</ela-app-layout>
</template>

<script>
import sideMenuItems from '../menuItems.js';

export default {
	name: 'Dashboard',

	data() {
		return {
			sideMenuItems,
			headerMenuItems: [
				{
					text: 'smartprix',
					link: '/home',
				},
			],
		};
	},

	computed: {
		userMenuItems() {
			return [
				{
					// text: this.userInfo.user.firstName,
					text: 'Hitesh',
					icon: 'setting',
					items: [
						{
							text: 'Settings',
						},
						{
							text: 'Logout',
							link: '/logout',
						},
					],
				},
			];
		},
	},
};
</script>
