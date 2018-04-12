import {crypt} from 'sm-utils';

const USERID_COOKIE = 'utok';

export default User => class Auth extends User {
	static async login(username, password) {
		const user = await this.getByUsername(username);
		if (!user) {
			throw new User.Error('username or password is incorrect');
		}

		const passwordCorrect = crypt.verifyPassword(password, user.password);
		if (!passwordCorrect) {
			throw new User.Error('username or password is incorrect');
		}

		if (user.isBanned()) {
			throw new User.Error('account banned');
		}

		return user;
	}

	static getTimeToExpire(options = {}) {
		if (options.timeToExpire) return options.timeToExpire;

		const rememberMe = (options.rememberMe !== false);
		if (rememberMe) {
			const tenYears = 10 * 365 * 24 * 3600;
			return tenYears;
		}

		const twoHours = 2 * 3600;
		return twoHours;
	}

	// FORMAT
	// ${version}encrypt(v#${user.id}#${currentTime}#${timeToExpire}#${type}#${appId}#sm)
	getLoginToken(options = {}) {
		const currentTime = Math.floor(Date.now() / 1000);
		const timeToExpire = options.timeToExpire || 0;
		const version = '1';
		const appId = options.appId || 1;
		const type = options.type || 'none';

		const token = [
			'v',
			this.id,
			currentTime,
			timeToExpire,
			type,
			appId,
			'sm',
		].join('#');

		return version + crypt.encrypt(token, cfg('encryptionKey'));
	}

	static getIdFromLoginToken(token) {
		// eslint-disable-next-line
		const version = token[0];

		let decryptedToken = '';
		try {
			decryptedToken = crypt.decrypt(token.substring(1), cfg('encryptionKey'));
			// d(decryptedToken);
		}
		catch (e) {
			throw new User.Error('invalid token');
		}

		const [
			v,
			id,
			tokenTime,
			timeToExpire,
			type,
			appId,
			sm,
		] = decryptedToken.split('#');

		if (
			v !== 'v' ||
			sm !== 'sm' ||
			!id ||
			!tokenTime ||
			!type ||
			appId !== '1'
		) {
			throw new User.Error('invalid token');
		}

		const currentTime = Math.floor(Date.now() / 1000);
		if (currentTime > tokenTime + timeToExpire) {
			throw new User.Error('token expired');
		}

		return id;
	}

	static async loginUsingToken(token) {
		const id = this.getIdFromLoginToken(token);
		const user = await this.loadById(id);
		if (!user) {
			throw new User.Error('invalid token');
		}

		if (user.isBanned()) {
			throw new User.Error('account banned');
		}

		return user;
	}

	setCookies(ctx, options = {}) {
		const timeToExpire = Auth.getTimeToExpire(options);

		let token = options.token;
		if (!token) {
			token = this.getLoginToken({
				type: 'web',
				timeToExpire,
			});
		}

		ctx.cookies.set(USERID_COOKIE, token, {
			path: '/',
			maxAge: timeToExpire * 1000,
		});
	}

	static async getFromCookies(ctx) {
		const token = ctx.cookies.get(USERID_COOKIE);
		if (!token) return null;

		try {
			return (await this.loginUsingToken(token));
		}
		catch (e) {
			return null;
		}
	}

	static async logout(ctx) {
		// delete the user cookie
		ctx.cookies.set(USERID_COOKIE);
		return true;
	}
};
