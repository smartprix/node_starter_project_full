<template>
	<ela-content-layout>
		<div slot="head">
			<h3>
				<span v-if="isAdd">Add&nbsp;</span>User
				<small v-if="!isAdd">{{ data.name }}</small>
			</h3>
			<div class="header-right">
				<el-button
					type="danger"
					icon="delete"
					@click="deleteUser(data)"
					v-if="!isAdd">
				</el-button>
			</div>
		</div>
		<el-tabs type="card" slot="tabs">
			<el-tab-pane label="Details" v-loading="loading">
				<user-form
					v-if="!loading"
					:form-data="user"
					@done="$emit('done')">
				</user-form>
			</el-tab-pane>
			<el-tab-pane label="Documents"></el-tab-pane>
		</el-tabs>
	</ela-content-layout>
</template>

<script>
import UserForm from './UserForm.vue';

export default {
	name: 'User',
	reEvents: {delete: 'done'},
	components: {
		UserForm,
	},
	props: {
		data: {
			type: Object,
			modify: 'user',
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
		this.loadUser();
	},
	methods: {
		loadUser() {
			if (!this.fetch) return;

			this.loading = true;
			this.$api.getUser({id: this.data.id}).then((user) => {
				this.user = user;
				this.loading = false;
			});
		},
		deleteUser(user) {
			this.$confirm(
				'Are you sure?',
				'Delete User',
				{type: 'warning'},
			).then(() => {
				this.$api.deleteUser(user.id)
					.then(() => {
						this.$notify({
							title: 'Success',
							message: 'User Deleted Successfully',
							type: 'success',
						});
						this.$bus.$emit('userMutated', user);
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
