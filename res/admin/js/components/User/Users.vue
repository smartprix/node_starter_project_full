<template>
	<ela-content-layout padding="0">
		<div slot="head">
			<h3>Users</h3>
			<div class="header-right">
				<el-button
					type="primary"
					icon="plus"
					@click="$view.user()">Add User
				</el-button>
			</div>
		</div>

		<div slot="filters">
			<el-row type="flex">
				<ela-filter-item label="Status" :span="3">
					<el-select
						size="small"
						clearable
						v-model="filters.status"
						@change="handleFilterChange">
						<el-option value="active" label="Active"></el-option>
						<el-option value="banned" label="Banned"></el-option>
					</el-select>
				</ela-filter-item>

				<ela-filter-item label="Search" :span="6" float="right">
					<el-input
						icon="search"
						size="small"
						v-model="filters.search"
						@click="handleFilterChange"
						@keyup.native.enter="handleFilterChange">
					</el-input>
				</ela-filter-item>
			</el-row>
		</div>

		<el-table
			:data="users.nodes"
			style="width: 100%"
			stripe
			border
			v-loading="loadingSelfData">
			<el-table-column label="View" align="center" width="70">
					<el-button
						slot-scope="scope"
						type="primary"
						size="small"
						icon="edit"
						@click="$view.user(scope.row)">
					</el-button>
			</el-table-column>
			<el-table-column prop="image" label="Image" width="70">
					<a slot-scope="scope" :href="scope.row.image" target="_blank">
						<img
							:src="scope.row.image"
							v-if="scope.row.image"
							width="40"
							height="40"/>
					</a>
			</el-table-column>
			<el-table-column prop="id" label="Id" width="60"></el-table-column>
			<el-table-column prop="name" label="Name"></el-table-column>
			<el-table-column prop="email" label="Email"></el-table-column>
			<el-table-column prop="phone" label="Phone"></el-table-column>
			<el-table-column
				prop="status"
				label="Status"
				width="100">
				<template slot-scope="scope">
					<el-tag
						v-if="scope.row.status === 'active'"
						type="success"
						:hit="true">
						Active
					</el-tag>
					<el-tag v-else type="danger" :hit="true">
						Banned
					</el-tag>
				</template>
			</el-table-column>
		</el-table>

		<div slot="foot">
			<div class="footer-right">
				<el-pagination
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
					:current-page="filters.page"
					:page-sizes="[20, 50, 100, 250, 500]"
					:page-size="filters.count"
					layout="total, sizes, prev, pager, next, jumper"
					:total="users.totalCount">
				</el-pagination>
			</div>
		</div>

	</ela-content-layout>
</template>

<script>
import {paginationMixin} from 'vutils';

export default {
	name: 'Users',
	mixins: [
		paginationMixin(),
	],

	data() {
		return {
			users: {},
			filters: {
				search: '',
				status: '',
				sort: 'id',
				order: 'ASC',
				page: 1,
				count: 20,
			},
		};
	},

	methods: {
		loadSelfData(filters) {
			return this.$api.getUsers(filters).then((users) => {
				this.users = users;
			});
		},

	},

	events: {
		userMutated() {
			this.reloadSelfData();
		},
	},
};
</script>

<style>
.sort .el-cascader-menu {
	height: 100%;
	max-height: 200px;
}
</style>
