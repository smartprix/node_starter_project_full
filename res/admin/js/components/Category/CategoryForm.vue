<template>
	<div v-loading="loading">
		<el-form
			ref="form"
			:model="category"
			:rules="rules"
			label-position="top">
			<el-form-item prop="globalError" class="form-global-error">
			</el-form-item>
			<el-row :gutter="12">
				<el-col :span="8">
					<el-form-item label="Category Name" prop="name">
						<el-input v-model.trim="category.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="Short Name" prop="shortName">
						<el-input v-model.trim="category.shortName"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="Plural Name" prop="pluralName">
						<el-input v-model.trim="category.pluralName"></el-input>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row :gutter="12">
				<el-col :span="12">
					<el-form-item label="Status" prop="status">
						<el-select v-model="category.status">
							<el-option label="Active" value="ACTIVE"></el-option>
							<el-option label="Inactive" value="INACTIVE"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="Parent Category" prop="parentId">
						<suggest item="Categories" v-model="category.parentId"></suggest>
					</el-form-item>
				</el-col>
			</el-row>

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
export default {
	name: 'CategoryForm',

	props: {
		formData: {
			type: Object,
			default: () => ({
				name: '',
				shortName: '',
				pluralName: '',
				aliases: [],
				parentId: '',
				status: 'ACTIVE',
			}),
			modify: 'category',
		},
	},

	data() {
		return {
			rules: {
				name: [{required: true, message: 'Please Enter Name'}],
				pluralName: [{required: true, message: 'Please Enter Plural Name'}],
				shortName: [{required: true, message: 'Please Enter Short Name'}],
				status: [{required: true, message: 'Please Choose Status'}],
			},
			loading: false,
			aliases: '',
		};
	},

	created() {
		if (this.category.aliases) {
			this.aliases = this.category.aliases.join('\n');
		}
	},

	methods: {
		submit() {
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (!valid) return;
				this.loading = true;
				this.category.aliases = this.aliases.split('\n').filter(item => !!item);
				this.$api.saveCategory(this.category).then(() => {
					this.$notify({
						title: 'Success',
						message: 'Category Saved Successfully',
						type: 'success',
					});
					this.loading = false;
					this.$bus.$emit('categoryMutated', this.category);
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
