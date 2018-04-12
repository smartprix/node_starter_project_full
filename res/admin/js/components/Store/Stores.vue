<template>
	<ela-content-layout padding="0">
		<div slot="head">
			<h3>Stores</h3>
			<div class="header-right">
				<el-button
					type="primary"
					icon="el-icon-plus"
					@click="$view.store()">Add Store
				</el-button>
			</div>
		</div>

		<div slot="filters">
			<el-row type="flex">
				<ela-filter-item label="Status" :span="5">
					<el-select
						size="small"
						clearable
						v-model="filters.status"
						@change="handleFilterChange">
						<el-option value="Active">Active</el-option>
						<el-option value="Inactive">Inactive</el-option>
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
			:default-sort="defaultSort"
			@sort-change="handleSortChange"
			v-loading="loadingSelfData">
			<el-table-column label="View" align="center" width="90">
				<el-button
					slot-scope="scope"
					type="primary"
					size="small"
					@click="$view.store(scope.row)">Details
				</el-button>
			</el-table-column>
			<el-table-column prop="id" label="Id" width="60"></el-table-column>
			<el-table-column prop="name" label="Name"></el-table-column>
			<el-table-column prop="shortName" label="Short Name"></el-table-column>
			<el-table-column prop="image" label="Logo" width="106">
				<img
					slot-scope="scope"
					class="store-logo"
					v-if="scope.row.image"
					:src="scope.row.image" />
			</el-table-column>
			<el-table-column prop="link" label="Link" width="70">
				<a slot-scope="scope" :href="scope.row.link" target="_blank">Link</a>
			</el-table-column>
			<el-table-column
				prop="priceBoost"
				label="Boost"
				width="95"
				sortable></el-table-column>
			<el-table-column prop="rating" label="Rating" width="165">
				<el-rate slot-scope="scope" :value="scope.row.rating / 2" disabled></el-rate>
			</el-table-column>
			<el-table-column prop="status" label="Status" width="100"></el-table-column>
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
					:total="stores.totalCount">
				</el-pagination>
			</div>
		</div>

	</ela-content-layout>
</template>

<script>
import {paginationMixin} from 'vutils';

export default {
	name: 'Stores',
	mixins: [paginationMixin()],

	data() {
		return {
			stores: {},
			filters: {
				search: '',
				status: '',
				sort: '',
				order: '',
				page: 1,
				count: 20,
			},
		};
	},

	computed: {
		displayItems() {
			return this.stores.nodes;
		},
	},

	methods: {
		loadSelfData(filters) {
			return this.$api.getStores(filters).then((stores) => {
				this.stores = stores;
			});
		},
	},

	events: {
		storeMutated() {
			this.reloadSelfData();
		},
	},
};
</script>

<style>
.store-logo {
	display: block;
	max-width: 70px;
	max-height: 30px;
	padding: 5px 0;
	margin: 0 auto;
}
</style>
