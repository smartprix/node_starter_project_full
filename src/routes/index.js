import Route from 'koa-router';
import login from './login';

const route = Route();

route.post('/login', login);

export default function installRoutes(app) {
	app.use(route.routes());
	app.use(route.allowedMethods());
}
