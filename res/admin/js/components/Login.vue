<template>
	<div>
		<el-row type="flex" justify="center">
			<div class="logo">
				<img src="../../img/logo.png" height="60" class="logo"/>
			</div><br />
		</el-row>
		<el-row type="flex" justify="center">
			<h1>CRAWLER</h1>
		</el-row>
		<el-row
			type="flex"
			class="bg-color"
			justify="center"
			align="middle">
			<el-col :span="6">
				<h3>LOGIN</h3>
				<el-form
					ref="form"
					:model="userData"
					:rules="rules"
					label-position="top">
					<el-form-item>
						<div v-if="errorMessage" class="error-message">
							{{ errorMessage }}
						</div>
					</el-form-item>
					<el-form-item label="Email Id" prop="username">
						<el-input
						v-model="userData.username"
						placeholder="Enter emailId"
						@keyup.native.enter="onSubmit"></el-input>
					</el-form-item>
					<el-form-item label="Password" prop="password">
						<el-input
							type="password"
							v-model="userData.password"
							placeholder="Enter password"
							@keyup.native.enter="onSubmit"></el-input>
					</el-form-item>
					<el-form-item prop="rememberMe" class="remember-me">
						<el-checkbox v-model="userData.rememberMe">Remember Me</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button type="success" @click="onSubmit">Submit</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</el-row>
	</div>
</template>

<script>
// import * as Cookie from 'tiny-cookie';

export default {
	name: 'Login',

	data() {
		return {
			userData: {
				username: '',
				password: '',
				rememberMe: true,
			},
			rules: {
				username: [{required: true, message: 'Please Enter Email Id', trigger: 'change'}],
				password: [{required: true, message: 'Please Enter Password', trigger: 'change'}],
			},
			errorMessage: '',
		};
	},

	methods: {
		onSubmit() {
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.$store.dispatch('login', this.userData).then(() => {
						// Cookie.set('token', this.userInfo.token, {expires: '10m'});
					}).catch((err) => {
						this.errorMessage = (
							err &&
							err.userErrorMessages &&
							err.userErrorMessages.global
						) || 'An unexpected error occurred';
					});
				}
			});
		},
	},
};
</script>

<style scoped>
	.bg-color {
		background-color: #99a9bf;
	}
	.error-message {
		color: red;
	}
</style>
