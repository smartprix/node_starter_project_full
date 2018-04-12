<template>
	<ela-content-layout padding="0">
		<div slot="head">
			<h3>Categories</h3>
			<div class="header-right">
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="$view.category()">Add Category
				</el-button>
			</div>
		</div>

		<div slot="filters">
			<el-row type="flex">
				<ela-filter-item label="Status" :span="6">
					<el-select
						size="small"
						clearable
						placeholder="Status"
						v-model="filters.status"
						@change="handleFilterChange">
						<el-option value="ACTIVE" label="Active"></el-option>
						<el-option value="INACTIVE" label="Inactive"></el-option>
					</el-select>
				</ela-filter-item>
				<ela-filter-item label="Search" :span="6" float="right">
					<el-input
						icon="el-icon-search"
						size="small"
						v-model="filters.search"
						@click="handleFilterChange"
						@keyup.native.enter="handleFilterChange">
					</el-input>
				</ela-filter-item>
			</el-row>
		</div>

		<el-table
			:data="displayItems"
			style="width: 100%"
			stripe
			border
			v-loading="loadingSelfData"
			@row-dblclick="rowClick">
			<el-table-column label="View" width="90">
				<el-button
					slot-scope="scope"
					type="primary"
					icon="el-icon-edit"
					size="mini"
					@click="$view.category(scope.row)">
					&nbsp;<strong>{{ scope.row.id }}</strong>
				</el-button>
			</el-table-column>
			<el-table-column prop="name" label="Name"></el-table-column>
			<el-table-column label="Parent">
				<a
					slot-scope="scope"
					class="modal-ref"
					@click="$view.category(scope.row.parent, {fetch: true})"
					v-if="scope.row.parent">
					{{ scope.row.parent.name }}
				</a>
			</el-table-column>
			<el-table-column label="Tree">
				<template slot-scope="scope">
					<span
						v-for="(item, i) in scope.row.parentTree"
						:key="i">
						<span v-if="i > 0"> &nbsp;&#9656;&nbsp; </span>
						<a
							class="modal-ref"
							@click="$view.category(item, {fetch: true})"
							v-text="item.name">
						</a>
					</span>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="Status"></el-table-column>
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
					:total="categories.totalCount">
				</el-pagination>
			</div>
		</div>
	</ela-content-layout>
</template>


<script>
import {paginationMixin} from 'vutils';

export default {
	name: 'Categories',
	mixins: [
		paginationMixin(),
	],

	data() {
		return {
			filters: {
				search: '',
				status: '',
				page: 1,
				count: 20,
			},
			categories: {},
		};
	},

	computed: {
		displayItems() {
			return this.categories.nodes;
		},
	},

	methods: {
		rowClick(row) {
			this.$router.push({path: '/storeProducts', query: {categoryId: row.id}});
		},

		loadSelfData(filters) {
			return this.$api.getCategories(filters).then((categories) => {
				this.categories = categories;
			});
		},
	},

	events: {
		categoryMutated() {
			this.reloadSelfData();
		},
	},
};
</script>
