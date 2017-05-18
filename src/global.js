import {cfg} from 'sm-utils';
import './objection';

global.d = require('sm-utils/d');
global._ = require('lodash');
global.moment = require('moment');
global.Promise = require('bluebird');

global.cfg = cfg;

cfg.set({
	logsDir: '/smartprix/logs',
});
