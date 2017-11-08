<template>
	<div v-loading="loading">
		<el-form
			ref="form"
			:model="store"
			:rules="rules"
			label-position="top">
			<el-form-item prop="globalError" class="form-global-error"></el-form-item>
			<el-row :gutter="12">
				<el-col :span="12">
					<el-form-item label="Store Name" prop="name">
						<el-input v-model.trim="store.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Short Name" prop="shortName">
						<el-input v-model.trim="store.shortName"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="12">
				<el-col :span="12">
					<el-form-item label="Link" prop="link">
						<el-input v-model.trim="store.link"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Domain" prop="domain">
						<el-input v-model.trim="store.domain"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="12">
				<el-col :span="12">
					<el-form-item label="Rating" prop="rating">
						<el-rate v-model="store.rating" :max="10" prop="rating"></el-rate>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="Status" prop="status">
				<el-select v-model="store.status">
					<el-option label="Active" value="ACTIVE"></el-option>
					<el-option label="Inactive" value="INACTIVE"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submit">Submit</el-button>
				<el-button type="text" @click="$emit('done');">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
export default {
	name: 'StoreForm',

	props: {
		formData: {
			type: Object,
			default: () => ({
				name: '',
				domain: '',
				shortName: '',
				link: '',
				status: 'ACTIVE',
				rating: 0,
			}),
			modify: 'store',
		},
	},

	data() {
		return {
			rules: {
				name: [{required: true, message: 'Please Enter Name'}],
				domain: [{required: true, message: 'Please Enter Domain'}],
				shortName: [{required: true, message: 'Please Enter Short Name'}],
				link: [{type: 'url', required: true}],
				status: [{required: true, message: 'Please Choose Status'}],
			},
			loading: false,
		};
	},

	methods: {
		submit() {
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (!valid) return;
				this.loading = true;
				this.$api.saveStore(this.store).then(() => {
					this.$notify({
						title: 'Success',
						message: 'Store Saved Successfully',
						type: 'success',
					});
					this.loading = false;
					this.$bus.$emit('storeMutated', this.store);
					this.$emit('done');
				}).catch((res) => {
					this.$utils.setFormErrors(this.$refs.form, res.userErrors);
					this.loading = false;
				});
			});
		},
	},
};
</script>

<style>
</style>
