import {getConnectionResolver} from 'gqutils';
import {User} from '../models';

export default {
	Query: {
		user: User.getFindOneResolver(),

		async users(root, args) {
			const query = User.query();

			if (args.id) {
				query.where('id', args.id);
			}

			if (args.email) {
				query.where('email', args.email);
			}

			if (args.status) {
				query.where('status', args.status);
			}

			if (args.search) {
				query.where('id', args.search)
					.orWhere('name', 'like', `%${args.search}%`)
					.orWhere('email', 'like', `%${args.search}%`)
					.orWhere('username', 'like', `%${args.search}%`);
			}

			return getConnectionResolver(query, args);
		},

		async loginUser(root, args, ctx) {
			const {username, password, rememberMe, setCookies} = args;

			const user = await User.login(username, password);
			const token = user.getLoginToken({
				type: 'web',
				timeToExpire: User.getTimeToExpire({rememberMe}),
			});

			if (setCookies) {
				user.setCookies(ctx, {token, rememberMe});
			}

			return {user, token};
		},

		async loginUsingToken(root, {token}) {
			const user = await User.loginUsingToken(token);
			return {user, token};
		},

		async me(root, args, ctx) {
			return ctx.user || null;
		},

		async logoutMe(root, args, ctx) {
			User.logout(ctx);
			return true;
		},
	},

	Mutation: {
		async saveUser(root, user) {
			if (user.id === null) delete user.id;
			return User.save(user);
		},

		async deleteUser(root, user) {
			return User.getDeleteByIdResolver()(root, user);
		},
	},

	User: {
		// eslint-disable-next-line
		async data(){},

		firstName(user) {
			return user.firstName;
		},

		lastName(user) {
			return user.lastName;
		},
	},
};
