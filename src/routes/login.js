import {User} from '../lib/models';

export default async function login(ctx) {
	const username = ctx.request.body.username;
	const password = ctx.request.body.password;

	if (!username || !password) {
		ctx.throw(403, 'username and password are required');
		return;
	}

	try {
		const user = await User.login(username, password);
		user.setCookies(ctx);
		ctx.user = user;
	}
	catch (e) {
		ctx.throw(403, e.message);
	}
}
