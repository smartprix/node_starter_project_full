<template>
	<div v-loading="loading">
		<el-form
			ref="form"
			:model="user"
			:rules="rules"
			label-position="top">
			<el-form-item prop="globalError" class="form-global-error">
			</el-form-item>

			<ela-fieldset legend="User Info">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="Name" prop="name">
							<el-input v-model.trim="user.name"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Userame" prop="username">
							<el-input v-model.trim="user.username"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="Email" prop="email">
							<el-input v-model.trim="user.email"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Personal Email" prop="personalEmail">
							<el-input v-model.trim="userData.personalEmail"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</ela-fieldset>

			<ela-fieldset legend="Official Details">
				<el-row :gutter="10">
					<el-col :span="8">
						<el-form-item label="Designation" prop="designation">
							<el-input v-model.trim="userData.designation"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Date of Joining">
							<el-date-picker
								v-model="userData.dateOfJoin"
								type="date"
								placeholder="Pick a date"
								style="width: 100%">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Aptitude Marks" prop="aptitudeMarks">
							<el-input v-model.trim="userData.aptitudeMarks"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-row :gutter="10">
					<el-col :span="16">
						<el-form-item label="Roles" prop="roleIds">
							<suggest
								item="Roles"
								multiple
								v-model="user.roleIds" />
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Status" prop="status">
							<el-select v-model="user.status">
								<el-option label="Active" value="active"></el-option>
								<el-option label="Banned" value="banned"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</ela-fieldset>

			<ela-fieldset legend="Personal Details">
				<el-row :gutter="10">
					<el-col :span="6">
						<el-form-item label="Date of Birth" prop="dateOfBirth">
							<el-date-picker
								v-model="user.dateOfBirth"
								type="date"
								placeholder="Pick a date"
								style="width: 100%">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="Gender" prop="gender">
							<el-select v-model="user.gender">
								<el-option value="male">Male</el-option>
								<el-option value="female">Female</el-option>
								<el-option value="others">Other</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="Marital Status" prop="maritalStatus">
							<el-select v-model="userData.maritalStatus" clearable>
								<el-option value="Single">Single</el-option>
								<el-option value="Married">Married</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="Blood Group" prop="bloodGroup">
							<el-select v-model="userData.bloodGroup">
								<el-option
									v-for="bloodGroup in bloodGroups"
									:key="bloodGroup"
									:value="bloodGroup"
									:label="bloodGroup">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="Profile Picture URL" prop="image">
					<el-input v-model.trim="user.image"></el-input>
				</el-form-item>
			</ela-fieldset>

			<ela-fieldset legend="Contact Details">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="Phone" prop="phone">
							<el-input v-model.trim="user.phone"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="Emergency Contact" prop="emergencyContact">
							<el-input v-model.trim="userData.emergencyContact"></el-input>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="Permanent Address" prop="permanentAddress">
					<el-input type="textarea" v-model.trim="userData.permanentAddress"></el-input>
				</el-form-item>

				<el-form-item label="Current Address" prop="currentAddress">
					<el-input type="textarea" v-model.trim="userData.currentAddress"></el-input>
				</el-form-item>
			</ela-fieldset>

			<ela-fieldset legend="Account Details">
				<el-row :gutter="10">
					<el-col :span="8">
						<el-form-item label="PAN No" prop="panNo">
							<el-input v-model.trim="userData.panNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Account No" prop="accountNo">
							<el-input v-model.trim="userData.accountNo"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Aadhaar No" prop="aadhaarNo">
							<el-input v-model.trim="userData.aadhaarNo"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</ela-fieldset>

			<el-form-item label="Comments" prop="comment">
				<el-input type="textarea" v-model.trim="userData.comment"></el-input>
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
	name: 'UserForm',

	components: {
		Suggest,
	},

	props: {
		formData: {
			type: Object,
			default: () => ({
				username: '',
				name: '',
				email: '',
				image: '',
				dateOfBirth: '',
				gender: '',
				phone: '',
				status: '',
			}),
			modify: 'user',
		},
	},


	data() {
		return {
			rules: {
				name: [{required: true, message: 'Please Enter Name'}],
				username: [{required: true, message: 'Please Enter Username'}],
				email: [{type: 'email', message: 'Enter a valid Email'},
					{required: true, message: 'Please Enter Email'}],
				dateOfBirth: [{required: true, message: 'Please Choose Date of Birth'}],
				gender: [{required: true, message: 'Please Choose Gender'}],
				phone: [{required: true, message: 'Please Enter Phone'}],
			},
			loading: false,
			bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
			userData: {
				dateOfJoin: null,
				maritalStatus: null,
				bloodGroup: null,
			},
		};
	},

	created() {
		// const user = this.user;
		if (this.user.data && this.user.data.data) {
			this.userData = Object.assign({}, this.userData, this.user.data.data);
		}
	},

	methods: {
		submit() {
			this.makeNullIfNotExist(this.user, Object.keys(this.user));
			this.$utils.clearFormErrors(this.$refs.form);
			this.$refs.form.validate((valid) => {
				if (!valid) return;
				this.loading = true;
				this.$api.saveUser({
					id: this.user.id,
					name: this.user.name,
					username: this.user.username,
					email: this.user.email,
					phone: this.user.phone,
					image: this.user.image,
					dateOfBirth: this.user.dateOfBirth,
					gender: this.user.gender,
					status: this.user.status,
				}).then(({id}) => (
					this.$api.saveUserData({
						userId: id,
						data: JSON.stringify(this.userData),
					})
				)).then(() => {
					this.$notify({
						title: 'Success',
						message: 'User Saved Successfully',
						type: 'success',
					});
					this.loading = false;
					this.$bus.$emit('userMutated', this.user);
					this.$emit('done');
				}).catch((res) => {
					this.$notify({
						title: 'Danger',
						message: 'Unable to save user',
						type: 'danger',
					});
					this.$utils.setFormErrors(this.$refs.form, res.userErrors);
					this.loading = false;
				});
			});
		},

		makeNullIfNotExist(obj, args) {
			_.forEach(args, (arg) => {
				if (!obj[arg]) obj[arg] = null;
			});
		},
	},
};
</script>

<style>
fieldset {
	display: block;
	margin-top: 10px;
	margin-bottom: 10px;
	padding-top: 0.625em;
	padding-bottom: 0.625em;
}
</style>
