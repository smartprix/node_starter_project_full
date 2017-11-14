<template>
	<ela-content-layout>
		<div slot="head">
			<h3>
				<span v-if="isAdd">Add&nbsp;</span>Category
				<small v-if="!isAdd">{{ category.name }}</small>
			</h3>
			<div class="header-right">
				<el-button
					type="danger"
					icon="delete"
					@click="deleteCategory(data)"
					v-if="!isAdd">
				</el-button>
			</div>
		</div>
		<el-tabs type="card" slot="tabs" v-model="activeTab">
			<el-tab-pane label="Details" v-loading="loadingCategory">
				<category-form :form-data="category" @done="$emit('done')"></category-form>
			</el-tab-pane>
			<el-tab-pane
				label="Children"
				name="children"
				v-loading="loadingChildren"
				v-if="!isAdd">
				<el-table :data="category.children" border striped>
					<el-table-column prop="id" label="Id" width="60"></el-table-column>
					<el-table-column prop="name" label="Name">
						<a slot-scope="scope" class="modal-ref" @click="$view.category(scope.row)">
							{{ scope.row.name }}
						</a>
					</el-table-column>
					<el-table-column prop="pluralName" label="Plural Name"></el-table-column>
					<el-table-column prop="shortName" label="Short Name"></el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane
				label="Tree"
				name="tree"
				v-loading="loadingTrees"
				v-if="!isAdd">
				<el-table :data="category.childrenTrees" border striped>
					<el-table-column label="No." type="index" width="60"></el-table-column>
					<el-table-column label="Tree">
						<template slot-scope="scope">
							{{ category.name }}
							<span
								v-for="(item, i) in scope.row"
								:key="i">
								<span> &nbsp;&#9656;&nbsp; </span>
								<a
									class="modal-ref"
									@click="$view.category(item, {fetch: true})"
									v-text="item.name">
								</a>
							</span>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</ela-content-layout>
</template>

<script>
import CategoryForm from './CategoryForm.vue';

export default {
	name: 'Category',
	components: {
		CategoryForm,
	},

	props: {
		data: {
			type: Object,
			modify: 'category',
		},
		fetch: Boolean,
	},

	data: () => ({
		loadingCategory: false,
		loadingChildren: false,
		loadingTrees: false,
		activeTab: '0',
	}),

	computed: {
		isAdd() {
			return !(this.data && this.data.id);
		},
	},

	created() {
		this.loadCategory();
	},

	methods: {
		loadCategory() {
			if (this.fetch) {
				this.loadingCategory = true;
				this.$api.getCategory(this.data.id).then((cat) => {
					this.category = cat;
					this.loadingCategory = false;
				});
			}
		},
		loadChildren() {
			if (this.category.children) return;
			this.loadingChildren = true;
			this.$api.getCategoryChildren(this.category.id).then((children) => {
				this.category.children = children;
				this.loadingChildren = false;
			});
		},
		loadChildrenTrees() {
			if (this.category.childrenTrees) return;
			this.loadingTrees = true;
			this.$api.getCategoryChildrenTrees(this.category.id).then((trees) => {
				this.category.childrenTrees = trees;
				this.loadingTrees = false;
			});
		},
		deleteCategory(category) {
			this.$confirm(
				'Are you sure?',
				'Delete Category',
				{type: 'warning'},
			).then(() => {
				this.$api.deleteCategory(category.id)
					.then(() => {
						this.$notify({
							title: 'Success',
							message: 'Category Deleted Successfully',
							type: 'success',
						});
						this.$bus.$emit('categoryMutated');
						this.$emit('done');
					}).catch((res) => {
						this.$notify({
							title: 'Error',
							message: 'Unable to Delete',
							type: 'error',
						});
						console.log(res);
						this.$emit('done');
					});
			}).catch(() => {});
		},
	},

	watch: {
		activeTab(val) {
			if (val === 'children') this.loadChildren();
			else if (val === 'tree') this.loadChildrenTrees();
		},
	},
};
</script>
