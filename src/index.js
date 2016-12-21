import {cfg} from 'sm-utils';

import Koa from 'koa';
import Route from 'koa-router';
import bodyParser from 'koa-body';
import views from 'koa-views';
// staticCache is still not updated for koa 2
import staticCache from 'koa-static-cache';

global.d = require('sm-utils/d');

const app = new Koa();
const route = Route();

app.use(staticCache('./static', {
	maxAge: 30 * 24 * 60 * 60,			// 30 days
	gzip: true,							// enable compression
	prefix: '/static',					// serve at this path
	dynamic: true,						// dynamically reload files which are not cached
}));

app.use(views('./static/dist', {
	map: {
		html: 'nunjucks',
	},
}));

app.use(bodyParser({
	multipart: true,
}));

route.get('/', async (ctx) => {
	await ctx.render('index');
});

app.use(route.routes());
app.use(route.allowedMethods());

if (require.main === module) {
	const port = cfg.is_production() ? 80 : 3000;
	const server = app.listen(port, () => {
		const address = server.address();
		console.log(`Server listening on ${address.address}:${address.port}`);
	});
}
