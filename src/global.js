import _ from 'lodash';
import os from 'os';
import moment from 'moment';
import Promise from 'bluebird';
import {cfg} from 'sm-utils';
import d from 'sm-utils/d';
import {Oak} from '@smpx/oak';
import './objection';
import {version} from '../package.json';

Oak.installExceptionHandlers();
Oak.installExitHandlers();

Oak.setGlobalOptions({
	hostname: os.hostname(),
	app: 'smartprix',
	pm2Id: process.env.pm_id || -1,
	version,
	env: _.pick(process.env, ['APP', 'NODE_ENV']),
	appName: process.env.name,
	level: 'silly', // default level
	table: 'log',
});

global.d = d;
global._ = _;
global.moment = moment;
global.Promise = Promise;
global.cfg = cfg;
global.Oak = Oak;


let env = process.env.NODE_ENV;
if (!['production', 'test', 'staging'].includes(env)) {
	env = 'development';
	process.env.NODE_ENV = env;
}
