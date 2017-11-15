/* eslint-disable class-methods-use-this, max-lines */

import {User} from './models';

const ONE_HOUR_MILLI = 3600 * 1000;
const ONE_DAY_MILLI = 24 * ONE_HOUR_MILLI;
const ONE_MONTH_MILLI = 30 * ONE_DAY_MILLI;
const TEN_YEARS_MILLI = 10 * 365 * ONE_DAY_MILLI;
const UTM_COOKIE = 'sm_utm';
const UTM_COOKIE_DURATION = ONE_MONTH_MILLI;
const USERID_COOKIE = 'uid';
const SESSIONID_COOKIE = 'sid';
const COOKIEID_COOKIE = 'id';
const COOKIE_PARAM_PREFIX = '_ck_';

class Request {
	constructor(ctx) {
		this.ctx = ctx;
		this._cache = {
			cookies: {},
		};
	}

	static middleware() {
		return async (ctx, next) => {
			ctx.$req = await Request.from(ctx);
			await next();
		};
	}

	static async from(ctx) {
		const req = new Request(ctx);
		await req.init();
		return req;
	}

	param(key, defaultValue = '') {
		const ctx = this.ctx;
		let paramValue;

		if (ctx.request.body &&
			ctx.request.body.fields &&
			(key in ctx.request.body.fields)
		) {
			paramValue = ctx.request.body.fields[key];
		}
		if (ctx.request.body &&
			(key in ctx.request.body)
		) {
			paramValue = ctx.request.body[key];
		}
		else {
			paramValue = ctx.query[key];
		}

		paramValue = paramValue || defaultValue;

		if (typeof paramValue === 'string') return paramValue.trim();
		if (Array.isArray(paramValue)) return paramValue.map(_.trim);
		return paramValue;
	}

	cache(key, callback) {
		if (!callback) return this._cache[key];

		if (!(key in this._cache)) {
			this._cache[key] = callback();
		}

		return this._cache[key];
	}

	// initialize a request
	// set important cookies and all
	async init() {
		await this.handleUser();
	}

	cookie(name, value, options = {}) {
		if (value === undefined) {
			if (name in this._cache.cookies) {
				return this._cache.cookies[name];
			}

			return this.ctx.cookies.get(name);
		}

		this._cache.cookies[name] = value;

		// only set the cookie in cache
		// don't set it in real
		if (options.onlyCache) {
			return null;
		}

		// set the cookie only if does not exist
		// but always set it in cache
		if (options.onlyCacheIfExists) {
			if (this.ctx.cookies.get(name)) return null;
		}

		if (!('path' in options)) {
			options.path = '/';
		}
		if ('days' in options) {
			options.maxAge = options.days * 24 * 3600 * 1000;
		}
		if ('years' in options) {
			options.maxAge = options.years * 365 * 24 * 3600 * 1000;
		}

		this.ctx.cookies.set(name, value, options);
		return null;
	}

	// smUserAgent() {
	// 	return this.ctx.headers['sm-user-agent'] || '';
	// }
	//
	// userAgent() {
	// 	return this.ctx.headers['user-agent'] || '';
	// }

	/*
	 * get the app related info using a query parameter
	 * this means that you can have the url as utm_app={"platform": "android"}
	 * and it'll automatically identify it as an android app
	 */

	userId() {
		return (this.ctx.user && this.ctx.user.id) || 0;
	}

	cookieId() {
		return this.cookie(COOKIEID_COOKIE);
		// TODO: create cookie id if it does not exist
		// if (!cookieId) {
		// 	// cookie id does not exist, set it
		// 	cookieId = crypt.randomId(16);
		// 	const currentTime = crypt.baseConvert(Math.floor(Date.now() / 1000), 10, 62);
		// 	const version = '1';
		// 	const randomId = crypt.randomId(10);

		// }
	}

	// cookie id that's existing (not set in this request)
	// TODO: testing & take params into account
	existingCookieId() {
		return this.ctx.cookies.get(COOKIEID_COOKIE);
	}

	sessionId() {
		return this.cookie(SESSIONID_COOKIE);
	}

	// session id that's existing (not set in this request)
	// TODO: testing & take params into account
	existingSessionId() {
		return this.ctx.cookies.get(SESSIONID_COOKIE);
	}

	isSmartprixRequest() {
		if (!cfg.isProduction()) return true;

		const origin = this.ctx.headers.origin;

		// this is needed because firefox currently does not
		// send origin with form submit requests (sends with xhr)
		// so this might cause csrf on firefox
		if (!origin) return true;

		const matches = origin.match(/^((http|https):\/\/)?([^/:]+)[/]?/i);
		if (!matches) return false;
		if (_.endsWith('.' + matches[3], '.smartprix.com')) return true;

		return false;
	}

	// this is when user visits an out link from our app
	// we send all the cookies as params
	// so we need to set the cookies on browser if they don't exist
	async setCookiesFromParams() {
		const query = this.ctx.query;

		const utmCookie = query[COOKIE_PARAM_PREFIX + UTM_COOKIE];
		if (utmCookie) {
			this.cookie(UTM_COOKIE, utmCookie, {
				maxAge: UTM_COOKIE_DURATION,
				onlyCacheIfExists: true,
			});
		}

		const idCookie = query[COOKIE_PARAM_PREFIX + COOKIEID_COOKIE];
		if (idCookie) {
			this.cookie(COOKIEID_COOKIE, idCookie, {
				maxAge: TEN_YEARS_MILLI,
				onlyCacheIfExists: true,
			});
		}

		const sessionIdCookie = query[COOKIE_PARAM_PREFIX + SESSIONID_COOKIE];
		if (sessionIdCookie) {
			this.cookie(SESSIONID_COOKIE, sessionIdCookie, {
				onlyCacheIfExists: true,
			});
		}

		const userIdCookie = query[COOKIE_PARAM_PREFIX + USERID_COOKIE];
		if (userIdCookie && !this.user) {
			try {
				const user = await User.loginUsingToken(userIdCookie);
				user.setCookies(this.ctx);
				this.setUserInCtx(user);
			}
			catch (e) {
				// Ignore error
			}
		}
	}

	sanitizeCookiePart(value, defaultValue = '') {
		if (!value) return defaultValue;
		return value.replace(/\|/g, '!~!');
	}

	joinCookieParts(parts, defaultValue = '') {
		return parts.map(part => this.sanitizeCookiePart(part, defaultValue)).join('|');
	}

	splitCookieParts(cookie) {
		return cookie.split('|').map(part => part.replace(/!~!/g, '|'));
	}

	setUserInCtx(user) {
		this.user = user;
		this.ctx.user = user;
		this.ctx.userId = (user && user.id) || 0;
		this.ctx.userName = (user && user.name) || '';
		this.ctx.userEmail = (user && user.email) || '';
	}

	async handleUser() {
		this.setUserInCtx(await User.getFromCookies(this.ctx));
	}
}

export default Request;
