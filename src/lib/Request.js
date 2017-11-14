/* eslint-disable class-methods-use-this, max-lines */
import URI from 'urijs';
import UAParser from 'ua-parser-js';
import {crypt} from 'sm-utils';

import {User, Url} from './models';

// Slightly Modified From Original Version (To Include UC Browser), Edit With Care
// Taken From: http://detectmobilebrowsers.com/
const mobileRegexes = [
	/(android|bb\d+|meego).+mobile|uc.+mobile|tizen.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i,

	// eslint-disable-next-line
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
];

const appUserAgentMap = {
	android: 'SmartprixApp Android Mobile',
	ios: 'SmartprixApp iOS Mobile',
	wp: 'SmartprixApp Windows Phone',
	tizen: 'SmartprixApp Tizen Mobile',
	jio: 'SmartprixApp Jio Mobile',
};

const appPlatforms = Object.keys(appUserAgentMap);

const uaParser = new UAParser();

const ONE_HOUR_MILLI = 3600 * 1000;
const ONE_DAY_MILLI = 24 * ONE_HOUR_MILLI;
const ONE_MONTH_MILLI = 30 * ONE_DAY_MILLI;
const TEN_YEARS_MILLI = 10 * 365 * ONE_DAY_MILLI;
const PLATFORM_PARAM = 'platform';
const PLATFORM_COOKIE = 'platform';
const PLATFORM_COOKIE_DURATION = 4 * ONE_HOUR_MILLI;
const APPINFO_PARAM = 'utm_app';
const APPINFO_COOKIE = 'utm_app';
const UTM_COOKIE = 'sm_utm';
const UTM_COOKIE_DURATION = ONE_MONTH_MILLI;
const AFFID_PARAM = 'affid';
const SUBAFFID_PARAM = 'subaffid';
const AFFID_COOKIE = 'sm_aff';
const AFFID_COOKIE_DURATION = ONE_DAY_MILLI;
const REF_PARAM = 'ref';
const REF_COOKIE = 'ref';
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
		this.handlePlatformModification();
		this.setUTMCookie();
		this.setRefCookie();
		this.setAffidCookie();

		// in case of visit out from app we need to set cookies from params
		if (this.ctx.query.installId) {
			await this.setCookiesFromParams();
		}
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

	smUserAgent() {
		return this.ctx.headers['sm-user-agent'] || '';
	}

	userAgent() {
		return this.ctx.headers['user-agent'] || '';
	}

	referer() {
		return this.ctx.headers.referer;
	}

	refererName() {
		return this._cache.refererName;
	}

	parseUserAgent() {
		return this.cache('parsedUserAgent', () => (
			(uaParser.setUA(this.userAgent()).getResult() || {})
		));
	}

	browser() {
		const ua = this.parseUserAgent();
		const deviceType = (ua && ua.device && ua.device.type) || '';
		const browserName = (ua && ua.browser && ua.browser.name) || '';

		if (deviceType === 'mobile') {
			if (browserName === 'Chrome') return 'Chrome Mobile';
			if (browserName === 'Firefox') return 'Firefox Mobile';
		}

		return browserName;
	}

	browserVersion() {
		const ua = this.parseUserAgent();
		let browerVersion = (ua.browser && ua.browser.version) || '';
		if (browerVersion) browerVersion = ' ' + browerVersion;
		return this.browser() + browerVersion;
	}

	os() {
		const ua = this.parseUserAgent();
		return (ua.os && ua.os.name) || '';
	}

	osVersion() {
		const ua = this.parseUserAgent();
		let osVersion = (ua.os && ua.os.version) || '';
		if (osVersion) osVersion = ' ' + osVersion;
		return this.os() + osVersion;
	}

	getAppInfoFromUserAgent() {
		const userAgent = this.smUserAgent() || this.userAgent();
		for (const platform in appPlatforms) {
			if (userAgent.indexOf(appUserAgentMap[platform]) >= 0) {
				try {
					const customAppInfo = JSON.parse(userAgent.split(' @@@ ')[1].trim());
					return {
						platform,
						isMobileApp: true,
						installId: customAppInfo.installId,
					};
				}
				catch (e) {
					return {
						platform,
						isMobileApp: true,
					};
				}
			}
		}

		return null;
	}

	getAppInfoFromParam() {
		const appInfoParam = this.ctx.query[APPINFO_PARAM];
		if (appInfoParam) {
			try {
				const appInfoParsed = JSON.parse(appInfoParam);
				const platform = appInfoParsed.platform || '';
				if (platform in appUserAgentMap) {
					appInfoParsed.isMobileApp = true;
				}

				this.cookie(APPINFO_COOKIE, crypt.base64UrlEncode(appInfoParam), {
					path: '/',
					maxAge: TEN_YEARS_MILLI,
				});

				return appInfoParsed;
			}
			catch (e) {
				// Ignore errors
			}
		}

		const appInfoCookie = this.cookie(APPINFO_COOKIE);
		if (appInfoCookie) {
			try {
				const appInfoParsed = JSON.parse(crypt.base64UrlDecode(appInfoCookie));
				const platform = appInfoParsed.platform || '';
				if (platform in appUserAgentMap) {
					appInfoParsed.isMobileApp = true;
				}
			}
			catch (e) {
				// Ignore errors
			}
		}

		return null;
	}

	/*
	 * get the app related info using a query parameter
	 * this means that you can have the url as utm_app={"platform": "android"}
	 * and it'll automatically identify it as an android app
	 */
	appInfo(param = null) {
		const appInfo = this.cache('appInfo', () => {
			const appInfoParam = this.getAppInfoFromParam();
			if (appInfoParam) return appInfoParam;

			const appInfoUserAgent = this.getAppInfoFromUserAgent();
			if (appInfoUserAgent) return appInfoUserAgent;

			return {};
		});

		return param ? appInfo[param] : appInfo;
	}

	installId() {
		return this.appInfo('installId') || this.ctx.query.installId || '';
	}

	isAndroidApp() {
		return this.appInfo('platform') === 'android';
	}

	isIOSApp() {
		return this.appInfo('platform') === 'ios';
	}

	isWPApp() {
		return this.appInfo('platform') === 'wp';
	}

	isTizenApp() {
		return this.appInfo('platform') === 'tizen';
	}

	isJIOApp() {
		return this.appInfo('platform') === 'jio';
	}

	isMobileApp() {
		// for setPlatform cases
		if (this.cache('platform') === 'mobile_app') return true;

		return !!this.appInfo('isMobileApp');
	}

	isMobileWeb() {
		return this.cache('isMobileWeb', () => {
			// for setPlatform cases
			if (this.cache('platform') === 'mobile_web') return true;

			const userAgent = this.userAgent();
			for (const regex of mobileRegexes) {
				if (regex.test(userAgent)) return true;
			}
			return false;
		});
	}

	isMobile() {
		return this.isMobileApp() || this.isMobileWeb();
	}

	isAPI() {
		return false;
	}

	platform() {
		return this.cache('platform', () => {
			if (this.isMobileApp()) return 'mobile_app';
			if (this.isMobileWeb()) return 'mobile_web';
			if (this.isAPI()) return 'api';
			return 'desktop';
		});
	}

	setPlatform(platform) {
		if (!platform) return false;
		const appPlatform = platform.replace('_app', '');

		if (appPlatform in appUserAgentMap) {
			this._cache.platform = 'mobile_app';
			this._cache.subPlatform = `${appPlatform}_app`;
			return false;
		}

		switch (platform) {
			case 'mobile':
			case 'mobile_web':
				this._cache.platform = 'mobile_web';
				return true;
			case 'www':
			case 'desktop':
				this._cache.platform = 'desktop';
				return true;
			case 'mobile_app':
				this._cache.platform = 'mobile_app';
				return true;
			default:
				return false;
		}
	}

	subPlatform() {
		return this.cache('subPlatform', () => {
			const appPlatform = this.appInfo('platform');
			if (appPlatform && this.isMobileApp()) {
				return `${appPlatform}_app`;
			}

			return '';
		});
	}

	isDesktop() {
		// for setPlatform cases
		if (this.cache('platform') === 'desktop') return true;

		return this.platform() === 'desktop';
	}

	utm(param = null) {
		const utmInfo = this.cache('utmInfo', () => {
			const utmCookie = this.cookie(UTM_COOKIE);
			if (!utmCookie) return {};

			const [source, medium, campaign, term, content] = utmCookie.split('|');
			return {
				source,
				medium,
				campaign,
				term,
				content,
				sourceMedium: `${source}/${medium}`,
			};
		});

		return param ? utmInfo[param] : utmInfo;
	}

	ref() {
		return this.cookie(REF_COOKIE);
	}

	_affidSubaffid() {
		const affidCookie = this.cookie(AFFID_COOKIE);
		if (!affidCookie) return ['', ''];

		const [affid, subaffid] = affidCookie.split('|');
		return [affid || '', subaffid || ''];
	}

	affid() {
		return this._affidSubaffid()[0];
	}

	subaffid() {
		return this._affidSubaffid()[1];
	}

	subAffid() {
		return this.subaffid();
	}

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

	// TODO: Support Nginx Proxy
	ip() {
		return this.ctx.ip;
	}

	// TODO: Support X-Forwarded-For
	realIP() {
		return this.ctx.ip;
	}

	isGet() {
		return this.ctx.method === 'get';
	}

	isPost() {
		return this.ctx.method === 'post';
	}

	isAjax() {
		return this.ctx.headers['x-requested-with'] === 'xmlhttprequest';
	}

	isJSEnabled() {
		return !!this.cookie('js');
	}

	nextUrl() {
		const ctx = this.ctx;
		if (ctx.query.next) return ctx.query.next;

		const paramNext = this.param('next');
		if (paramNext) return paramNext;

		if (ctx.url !== '/login' && ctx.url !== '/signup') {
			return ctx.url;
		}

		return '/';
	}

	logoutUrl(redirectUrl = null) {
		redirectUrl = redirectUrl || this.nextUrl();
		return cfg('wwwUrl') + '/logout?next=' + encodeURIComponent(redirectUrl);
	}

	// TODO: implement
	loginUrl() {
		return '/login?next=' + encodeURIComponent(this.nextUrl());
	}

	// TODO: implement
	facebookLoginUrl() {
		return '/login?next=' + encodeURIComponent(this.nextUrl());
	}

	// TODO: implement
	googleLoginUrl() {
		return '/login?next=' + encodeURIComponent(this.nextUrl());
	}

	// TODO: implement
	twitterLoginUrl() {
		return '/login?next=' + encodeURIComponent(this.nextUrl());
	}

	// TODO: implement
	signupUrl() {
		return '/signup?next=' + encodeURIComponent(this.nextUrl());
	}

	mobileUrl() {
		return Url.addQuery(this.ctx.url, {[PLATFORM_PARAM]: 'mobile'});
	}

	desktopUrl() {
		return Url.addQuery(this.ctx.url, {[PLATFORM_PARAM]: 'desktop'});
	}

	shouldShowWebPushButton() {
		// User has already seen the push subscription page
		const wpCookie = this.cookie('_wp');
		const webPushCookie = this.cookie('web_push');
		const wppCookie = this.cookie('_wpp');
		if (webPushCookie === '1' || ['1', '-2', '-4', '-5'].includes(wpCookie) || wppCookie) {
			return false;
		}

		const userAgent = this.userAgent();

		// Request Came From A Web View
		if (userAgent.includes('; wv')) return false;

		// Extract chrome version
		const matches = this.userAgent().match(/Chrome\/([0-9]+)/);
		const chromeVersion = Number(matches[1]);
		if (chromeVersion < 42) return false;

		if (this.isMobileWeb() && this.os() === 'Android') return true;

		if (this.platform() === 'desktop' && this.browser() === 'Chrome') {
			// Request Came From A Tablet
			if (userAgent.includes('Android')) return false;
			return true;
		}

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

		const refCookie = query[COOKIE_PARAM_PREFIX + REF_COOKIE];
		if (refCookie) {
			this.cookie(REF_COOKIE, refCookie, {
				onlyCacheIfExists: true,
			});
		}

		const affidCookie = query[COOKIE_PARAM_PREFIX + AFFID_COOKIE];
		if (affidCookie) {
			this.cookie(AFFID_COOKIE, affidCookie, {
				onlyCacheIfExists: true,
			});
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

	parseReferer() {
		const referer = this.referer();
		if (!referer) {
			return {
				name: '',
				source: 'direct',
				medium: 'direct',
				term: '',
			};
		}

		const refererUri = new URI(referer);
		let host = refererUri.host().toString().toLowerCase();

		if (_.endsWith(host, 'smartprix.com')) {
			return {
				name: host,
				source: host,
				medium: 'direct',
				term: '',
			};
		}

		host = host.replace(/^(?:www|m|shop|mobile|lm|l)\./, '')
			.replace('search.yahoo', 'yahoo');

		// extract search engine names
		const searchRegex = /\.(images\.google|google|yahoo|bing|ask|duckduckgo|yandex|baidu|babylon|avg|wow|reliancenetconnect|webcrawler|inspsearch|speedbit|searches|search)\./;
		const matches = host.match(searchRegex);

		if (matches) {
			let refererSource = matches[1];
			if (['search', 'searches'].includes(refererSource)) {
				refererSource = host;
			}

			const query = refererUri.query(true);
			const term = query.q || query.searchfor || query.pq || 'not_available';

			return {
				name: host,
				source: refererSource,
				medium: 'organic',
				term: term.trim(),
			};
		}

		return {
			name: host,
			source: host,
			medium: 'referral',
			term: '',
		};
	}

	setUTMCookie() {
		const ctx = this.ctx;

		let source = ctx.query.utm_source;
		let medium = ctx.query.utm_medium;
		let campaign = ctx.query.utm_campaign;
		let term = ctx.query.utm_term;
		const content = ctx.query.utm_content;

		if (ctx.query.gclid) {
			source = source || 'google';
			medium = medium || 'cpc';
			campaign = campaign || 'google_cpc';
		}

		const utmExists = Boolean(source || medium || campaign);
		const referer = this.parseReferer();
		this._cache.refererName = referer.name;

		if (!utmExists) {
			source = referer.source;
			medium = referer.medium;
			term = referer.term;
		}

		// if the medium is direct then only set cookie if it doesn't already exist
		const shouldSetCookie = Boolean(utmExists || medium !== 'direct' || !this.cookie(UTM_COOKIE));
		if (!shouldSetCookie) return;

		this.cookie(
			UTM_COOKIE,
			this.joinCookieParts([source, medium, campaign, term, content], 'none'),
			{maxAge: UTM_COOKIE_DURATION}
		);
	}

	setRefCookie() {
		const ref = this.ctx.query[REF_PARAM];
		if (!ref) return;

		this.cookie(REF_COOKIE, ref);
	}

	setAffidCookie() {
		const affid = this.ctx.query[AFFID_PARAM];
		const subaffid = this.ctx.query[SUBAFFID_PARAM];
		if (!affid) return;

		this.cookie(
			AFFID_COOKIE,
			this.joinCookieParts([affid, subaffid]),
			{maxAge: AFFID_COOKIE_DURATION}
		);
	}

	handlePlatformModification() {
		// don't change platform in mobile apps
		if (this.isMobileApp()) return;

		const platform = this.ctx.query[PLATFORM_PARAM] || this.cookie(PLATFORM_COOKIE);
		const setPlatformCookie = this.setPlatform(platform);
		if (setPlatformCookie) {
			this.cookie(PLATFORM_COOKIE, platform, {maxAge: PLATFORM_COOKIE_DURATION});
		}
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
