import _ from 'lodash';
import {crypt} from 'sm-utils';
import {Model} from 'xorm';
import Auth from './Auth';

class User extends Model {
	static tableName = 'User';
	static softDelete = true;

	static jsonSchema = {
		type: 'object',
		properties: {
			name: {required: true},
			email: {required: true},
			phone: {required: true},
			gender: {required: true},
			dateOfBirth: {required: true},
			username: {required: true},
		},
	};

	get firstName() {
		return this.name.split(' ')[0];
	}

	get lastName() {
		return _.last(this.name.split(' '));
	}

	static async getByUsername(username) {
		return this.query()
			.where('email', username)
			.orWhere('username', username)
			.orWhere('phone', username)
			.first();
	}

	isBanned() {
		return this.status === 'banned';
	}

	static async getDuplicate(user) {
		if (!user.email || !user.phone || !user.username) {
			return null;
		}

		const query = this.query();
		if (user.id) {
			query.whereNot('id', user.id);
		}

		query.where((q1) => {
			if (user.email) {
				q1.orWhere((q2) => {
					q2.whereNot('email', '');
					q2.where('email', user.email);
				});
			}
			if (user.phone) {
				q1.orWhere((q2) => {
					q2.whereNot('phone', '');
					q2.where('phone', user.phone);
				});
			}
			if (user.username) {
				q1.orWhere((q2) => {
					q2.whereNot('username', '');
					q2.where('username', user.username);
				});
			}
		});

		return query.first();
	}

	static async save(user) {
		const duplicate = await User.getDuplicate(user);
		if (duplicate) {
			throw new User.Error('this user already exists');
		}
		// TODO: save/edit password in frontend
		if (user.password) {
			user.password = crypt.hashPassword(user.password);
		}

		return User.query().saveAndFetch(user);
	}
}

export default Auth(User);
