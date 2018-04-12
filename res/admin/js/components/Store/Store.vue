<template>
	<ela-content-layout>
		<div slot="head">
			<h3>
				<span v-if="isAdd">Add&nbsp;</span>Store
				<small v-if="!isAdd">{{ data.name }}</small>
			</h3>
			<div class="header-right">
				<el-button
					type="danger"
					icon="el-icon-delete"
					@click="deleteStore(data)"
					v-if="!isAdd">
				</el-button>
			</div>
		</div>
		<el-tabs type="card" slot="tabs">
			<el-tab-pane label="Details" v-loading="loading">
				<store-form
					:form-data="store"
					@done="$emit('done')">
				</store-form>
			</el-tab-pane>
		</el-tabs>
	</ela-content-layout>
</template>

<script>
import StoreForm from './StoreForm.vue';

export default {
	name: 'Store',
	reEvents: {delete: 'done'},
	components: {
		StoreForm,
	},
	props: {
		data: {
			type: Object,
			modify: 'store',
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
		this.loadStore();
	},
	methods: {
		loadStore() {
			if (this.fetch) {
				this.loading = true;
				this.$api.getStore(this.data.id).then((store) => {
					this.store = store;
					this.loading = false;
				});
			}
		},
		deleteStore(store) {
			this.$confirm(
				'Are you sure?',
				'Delete Store',
				{type: 'warning'},
			).then(() => {
				this.$api.deleteStore(store.id)
					.then(() => {
						this.$notify({
							title: 'Success',
							message: 'Store Deleted Successfully',
							type: 'success',
						});
						this.$bus.$emit('storeMutated', store);
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
