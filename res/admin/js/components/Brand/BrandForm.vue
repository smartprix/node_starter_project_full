<template>
	<div v-loading="loading">
		<el-form
			ref="form"
			:model="brand"
			:rules="rules"
			label-position="top">
			<el-form-item prop="globalError" class="form-global-error">
			</el-form-item>
			<el-row :gutter="12">
				<el-col :span="16">
					<el-form-item label="Brand Name" prop="name">
						<el-input v-model.trim="brand.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="Status" prop="status">
						<el-select v-model="brand.status">
							<el-option value="Active">Active</el-option>
							<el-option value="Inactive">Inactive</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item prop="categoryIds" label="Categories">
				<suggest
					item="Categories"
					multiple
					v-model="brand.categoryIds">
				</suggest>
			</el-form-item>

			<el-form-item label="Aliases" prop="aliases">
				<el-input type="textarea" :rows="7" v-model.trim="aliases"></el-input>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submit">Submit</el-button>
				<el-button type="text" @click="$emit('done')">Cancel</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import Suggest from '../Suggest.vue';

export default {
	name: 'BrandForm',

	components: {
		Suggest,
	},
	props: {
		formData: {
			type: Object,
			default: () => ({
				name: '',
				aliases: [],
				categoryIds: [],
				status: 'Active',
			}),
			modify: 'brand',
		},
	},

	data() {
		return {
			rules: {
				name: [{required: true, message: 'Please Enter Name'}],
				status: [{required: true, message: 'Please Choose Status'}],
			},
			loading: false,
			aliases: '',
		};
	},

	created() {
		if (this.brand.categories) {
			this.brand.categoryIds = this.brand.categories.map(cat => cat.id);
		}
		if (this.brand.aliases) {
			this.aliases = this.brand.aliases.join('\n');
		}
	},

	methods: {
		submit() {
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (!valid) return;
				this.loading = true;
				this.brand.aliases = this.aliases.split('\n').filter(item => !!item);
				this.$api.saveBrand(this.brand).then(() => {
					this.$notify({
						title: 'Success',
						message: 'Brand Saved Successfully',
						type: 'success',
					});
					this.loading = false;
					this.$bus.$emit('brandMutated', this.brand);
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
