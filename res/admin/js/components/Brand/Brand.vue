<template>
	<ela-content-layout>
		<div slot="head">
			<h3>
				<span v-if="isAdd">Add&nbsp;</span>Brand
				<small v-if="!isAdd">{{data.name}}</small>
			</h3>
			<div class="header-right">
				<el-button
					type="danger"
					icon="delete"
					@click="deleteBrand(data)"
					v-if="!isAdd">
				</el-button>
			</div>
		</div>
		<el-tabs type="card" slot="tabs">
			<el-tab-pane label="Details" v-loading="loading">
				<brand-form
					:formData="brand"
					@done="$emit('done')">
				</brand-form>
			</el-tab-pane>
		</el-tabs>
	</ela-content-layout>
</template>

<script>
import BrandForm from './BrandForm.vue';

export default {
	name: 'Brand',
	reEvents: {delete: 'done'},
	components: {
		BrandForm,
	},
	props: {
		data: {
			type: Object,
			modify: 'brand',
		},
		fetch: Boolean,
	},
	data: () => ({
		loading: false,
	}),
	computed: {
		isAdd() {
			return !(this.data && this.data.id);
		},
	},
	created() {
		this.loadBrand();
	},
	methods: {
		loadBrand() {
			if (this.fetch) {
				this.loading = true;
				this.$api.getBrand(this.data.id).then((brand) => {
					this.brand = brand;
					this.loading = false;
				});
			}
		},
		deleteBrand(brand) {
			this.$confirm(
				'Are you sure?',
				'Delete Brand',
				{type: 'warning'},
			).then(() => {
				this.$api.deleteBrand(brand.id)
				.then(() => {
					this.$notify({
						title: 'Success',
						message: 'Brand Deleted Successfully',
						type: 'success',
					});
					this.$bus.$emit('brandMutated', brand);
					this.$emit('done');
				}).catch((res) => {
					this.$notify({
						title: 'Danger',
						message: 'Unable to Delete',
						type: 'danger',
					});
					console.log(res);
					this.$emit('done');
				});
			}).catch(() => {});
		},
	},
};
</script>
