<template>
	<ela-content-layout padding="0">
		<div slot="head">
			<h3>Brands</h3>
			<div class="header-right">
				<el-button
					type="primary"
					icon="plus"
					@click="$view.brand()">Add Brand
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
			:data="brands.nodes"
			style="width: 100%"
			stripe
			border
			v-loading="loadingSelfData">
			<el-table-column label="View" align="center" width="90">
					<el-button
						slot-scope="scope"
						type="primary"
						size="small"
						@click="$view.brand(scope.row)">Details
					</el-button>
			</el-table-column>
			<el-table-column prop="id" label="Id" width="60"></el-table-column>
			<el-table-column prop="name" label="Name"></el-table-column>
			<el-table-column prop="aliases" label="Aliases">
				<template slot-scope="scope">{{ scope.row.aliases.join(', ') }}</template>
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
					:total="brands.totalCount">
				</el-pagination>
			</div>
		</div>

	</ela-content-layout>
</template>

<script>
import {paginationMixin} from 'vutils';

export default {
	name: 'Brands',
	mixins: [paginationMixin()],

	data() {
		return {
			brands: {},
			filters: {
				search: '',
				status: '',
				page: 1,
				count: 20,
			},
		};
	},

	methods: {
		loadSelfData(filters) {
			return this.$api.getBrands(filters).then((brands) => {
				this.brands = brands;
			});
		},
	},

	events: {
		brandMutated() {
			this.reloadSelfData();
		},
	},
};
</script>
